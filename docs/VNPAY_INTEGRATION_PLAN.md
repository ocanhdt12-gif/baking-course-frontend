# VNPay Integration Plan for `/Users/hoangkien/NLV/baking`

## 1. Objective

Tích hợp VNPay vào hệ thống baking hiện tại để thay thế hoặc bổ sung luồng chuyển khoản thủ công đang được xây dựng. Mục tiêu là:

- cho người dùng tạo order và thanh toán qua VNPay ngay trên luồng checkout
- backend xác thực callback từ VNPay một cách an toàn
- cập nhật trạng thái order tự động, hạn chế xác nhận thủ công
- giữ tương thích với kiến trúc hiện tại: React frontend, Express backend, Prisma/PostgreSQL
- vẫn giữ được fallback thủ công nếu cần trong giai đoạn chuyển tiếp

## 2. Current State of This Project

## Frontend hiện có
- `frontend/src/pages/Checkout.jsx`
- `frontend/src/components/Admin/AdminOrders.jsx`
- `frontend/src/components/Admin/AdminPaymentConfig.jsx`
- `frontend/src/services/api.js`

Luồng hiện tại đang thiên về chuyển khoản thủ công:
- tạo `Order`
- hiển thị QR + thông tin chuyển khoản từ `PaymentConfig`
- user upload ảnh biên lai hoặc nhập `transactionRef`
- admin xác nhận hoặc từ chối
- webhook generic `/api/webhook/payment` mới chỉ phục vụ auto-confirm kiểu bank webhook đơn giản

## Backend hiện có
- `backend/src/controllers/orderController.js`
- `backend/src/controllers/paymentConfigController.js`
- `backend/src/controllers/webhookController.js`
- `backend/src/routes/orderRoutes.js`
- `backend/src/routes/paymentConfigRoutes.js`
- `backend/src/routes/webhookRoutes.js`
- Prisma models: `Order`, `PaymentConfig`

Hiện chưa có lớp tích hợp payment gateway chuyên biệt cho VNPay.

## 3. VNPay Model to Apply

Theo tài liệu VNPay sandbox, merchant cần xử lý 3 phần riêng biệt:

1. **Create payment URL**
   - backend tạo URL thanh toán có ký chữ ký `vnp_SecureHash`
   - frontend redirect user sang VNPay

2. **Return URL**
   - VNPay redirect user quay lại website sau khi thanh toán
   - endpoint này chủ yếu để hiển thị kết quả cho người dùng
   - không nên coi đây là nguồn sự thật cuối cùng để chốt đơn

3. **IPN URL**
   - VNPay gọi server-to-server để báo kết quả thanh toán
   - đây mới nên là nguồn chính để cập nhật trạng thái order

## 4. Key VNPay Parameters Relevant Here

Các tham số quan trọng cần dùng:

- `vnp_TmnCode`
- `vnp_HashSecret`
- `vnp_ReturnUrl`
- `vnp_Amount` (VNPay yêu cầu nhân 100)
- `vnp_TxnRef` (mã giao dịch phía merchant, phải unique)
- `vnp_OrderInfo`
- `vnp_OrderType`
- `vnp_CreateDate`
- `vnp_ExpireDate`
- `vnp_IpAddr`
- `vnp_Locale`
- `vnp_ResponseCode`
- `vnp_TransactionStatus`
- `vnp_TransactionNo`
- `vnp_SecureHash`

## 5. Recommended Integration Strategy

## Recommendation
Không nên nhét VNPay vào `PaymentConfig` hiện tại như một vài field rời rạc. Nên tách thành một lớp cấu hình payment gateway rõ ràng, nhưng để giảm chi phí thay đổi, có thể triển khai theo 2 pha.

### Phase A, low-risk integration into current structure
- giữ `Order` làm trung tâm
- mở rộng `PaymentConfig` hoặc thêm env vars để chứa cấu hình VNPay
- thêm controller/service riêng cho VNPay
- giữ checkout manual transfer như fallback

### Phase B, cleanup after payment proves stable
- tách `PaymentConfig` thành cấu hình đa cổng thanh toán rõ ràng hơn
- phân biệt `BANK_TRANSFER_MANUAL` và `VNPAY`
- chuẩn hóa payment transaction audit log

Với repo này, tôi khuyến nghị **làm Phase A trước**.

## 6. Data Model Changes

## Option recommended for current repo
Giữ bảng `Order`, mở rộng thêm các field sau:

### `Order`
- `paymentMethod String?` — ví dụ `MANUAL_BANK`, `VNPAY`
- `paymentProvider String?` — ví dụ `VNPAY`
- `paymentUrl String?` — optional, chủ yếu debug hoặc audit
- `paymentInitiatedAt DateTime?`
- `paymentExpiresAt DateTime?`
- `gatewayTxnRef String?` — map với `vnp_TxnRef`
- `gatewayTransactionNo String?` — map với mã giao dịch phía VNPay
- `gatewayResponseCode String?`
- `gatewayTransactionStatus String?`
- `paidAt DateTime?`
- `rawGatewayPayload Json?` — lưu payload callback đã xác thực, có kiểm soát dung lượng

### `PaymentConfig` hoặc ENV
Nếu muốn ship nhanh và an toàn hơn, nên để secrets ở `.env`, không lưu DB.

ENV đề xuất:
- `VNPAY_TMN_CODE`
- `VNPAY_HASH_SECRET`
- `VNPAY_PAYMENT_URL`
- `VNPAY_RETURN_URL`
- `VNPAY_IPN_URL`
- `VNPAY_LOCALE=vn`
- `VNPAY_ORDER_TYPE=other`

Khuyến nghị:
- `TMN_CODE`, `HASH_SECRET` để trong env
- các thông tin hiển thị thủ công như QR ngân hàng tiếp tục để `PaymentConfig`

## 7. Backend Architecture Plan

Tạo module riêng cho VNPay thay vì nhồi logic vào `webhookController.js` hiện tại.

### Files to add
- `backend/src/controllers/vnpayController.js`
- `backend/src/routes/vnpayRoutes.js`
- `backend/src/services/vnpayService.js`
- `backend/src/utils/vnpay.js`

### Route design

#### Public/User authenticated
- `POST /api/vnpay/create-payment-url`
  - auth required
  - input: `{ orderId, bankCode? }`
  - output: `{ paymentUrl }`

#### Public return endpoint
- `GET /api/vnpay/return`
  - receives redirected params from VNPay
  - verifies secure hash
  - loads order by `vnp_TxnRef`
  - does **not** blindly confirm payment unless project deliberately accepts return-url confirmation
  - redirects frontend result page or returns JSON in dev mode

#### Public IPN endpoint
- `GET /api/vnpay/ipn`
  - server-to-server callback from VNPay
  - verifies secure hash
  - validates order existence, amount, and idempotency
  - updates order to `CONFIRMED` when valid success callback arrives
  - returns response code per VNPay contract

### Service responsibilities

#### `vnpayService.js`
- sort params
- build query string
- sign payload with HMAC SHA512
- verify incoming callback signature
- normalize callback fields
- compute create/expire date in GMT+7 format expected by VNPay

#### `vnpayController.js`
- create payment URL from order
- process return flow for UI
- process IPN flow for source-of-truth status updates

## 8. Order Lifecycle Mapping

## Current statuses
- `PENDING`
- `AWAITING_CONFIRM`
- `CONFIRMED`
- `REJECTED`
- `CANCELLED`

## Recommended VNPay mapping

### For VNPay orders
- create order → `PENDING`
- create VNPay URL successfully → still `PENDING`
- user redirected to VNPay and pays → wait for IPN
- valid successful IPN → `CONFIRMED`
- failed payment or abandoned flow → remain `PENDING` until timeout/cancel
- explicit cancel by user before payment → `CANCELLED`

### Important note
`AWAITING_CONFIRM` should remain reserved for manual bank-transfer proof flow. Do not reuse it for VNPay if payment confirmation is automatic.

## 9. Frontend Integration Plan

## Checkout changes
Current `Checkout.jsx` is optimized for manual transfer. Với VNPay nên sửa theo hướng:

### Step flow đề xuất
1. Order Summary
2. Payment Method
3. VNPay Redirect or Manual Transfer
4. Result / Status

### Specific frontend work
- thêm lựa chọn phương thức thanh toán:
  - `VNPay`
  - `Manual Bank Transfer` (fallback, optional)
- nếu chọn VNPay:
  - gọi `POST /api/vnpay/create-payment-url`
  - redirect browser sang `paymentUrl`
- thêm trang nhận kết quả, ví dụ:
  - `frontend/src/pages/PaymentResult.jsx`
- route mới:
  - `/payment/vnpay-return`
- trang result sẽ:
  - đọc query params do VNPay trả về
  - hiển thị pending/success/failure
  - gọi API order detail để lấy trạng thái thực tế mới nhất

### Why not trust frontend query params alone
Vì người dùng có thể quay lại trang return trước khi IPN cập nhật DB. UI phải chấp nhận trạng thái trung gian như:
- “Thanh toán đã ghi nhận, đang chờ xác nhận hệ thống”

## 10. Admin Panel Changes

Admin hiện có `AdminOrders.jsx` và `AdminPaymentConfig.jsx`.

### `AdminOrders.jsx`
Bổ sung hiển thị:
- `paymentMethod`
- `paymentProvider`
- `gatewayTxnRef`
- `gatewayTransactionNo`
- `gatewayResponseCode`
- `paidAt`
- raw callback summary

### Admin actions
- Với order VNPay đã `CONFIRMED`, không nên cho confirm/reject như proof thủ công nữa, hoặc chỉ cho manual override nếu thật sự cần.
- Với order `PENDING` quá lâu, admin có thể cancel.

### `AdminPaymentConfig.jsx`
Nếu tiếp tục dùng màn này cho payment setup, nên tách rõ 2 khối:
- Manual transfer settings
- VNPay settings

Nhưng **không hiển thị `HASH_SECRET` thẳng ra UI admin nếu không thật sự cần**. Tốt nhất là cấu hình qua env trên server.

## 11. Security Requirements

Đây là phần quan trọng nhất.

### Always do
- chỉ tạo payment URL ở backend
- verify `vnp_SecureHash` cho cả return và IPN
- dùng IPN làm nguồn xác nhận chuẩn
- so khớp `vnp_Amount` với `order.amount * 100`
- kiểm tra `vnp_TxnRef` map đúng 1 order
- xử lý idempotency, nếu order đã `CONFIRMED` thì callback lặp lại không được tạo side effect mới
- log có chọn lọc, không log secret

### Ask first / design choice
- có giữ manual transfer song song không
- có cho admin manual override payment VNPay không
- có lưu raw payload đầy đủ vào DB không

### Never do
- không tạo chữ ký hoặc verify chữ ký ở frontend
- không trust `vnp_ResponseCode=00` từ query string nếu chưa verify hash
- không dùng return URL để cập nhật đơn hàng như nguồn duy nhất
- không lưu `VNPAY_HASH_SECRET` ở frontend hoặc public config endpoint

## 12. Detailed Implementation Tasks

## Task 1, prepare spec and env
- thêm tài liệu env VNPay vào backend docs
- định nghĩa rõ sandbox vs production config
- acceptance: có danh sách env và format URL callback

## Task 2, extend Prisma schema
- thêm các field payment/gateway cần thiết vào `Order`
- optional: thêm `provider` fields vào `PaymentConfig` nếu thật sự cần
- acceptance: schema phản ánh đủ trạng thái payment VNPay

## Task 3, build VNPay utility and service layer
- hàm build signed URL
- hàm verify callback signature
- hàm normalize response
- acceptance: test được logic sign/verify bằng fixture

## Task 4, build backend VNPay routes
- create-payment-url
- return handler
- ipn handler
- acceptance: route trả đúng contract, xử lý success/failure/idempotent

## Task 5, update checkout frontend
- thêm chọn phương thức thanh toán
- gọi API create payment URL
- redirect sang VNPay
- acceptance: user có thể đi từ course → order → VNPay redirect

## Task 6, add payment result page
- render trạng thái từ query params và order API
- acceptance: return flow không gây lỗi, UX rõ ràng

## Task 7, update admin orders UI
- hiển thị metadata VNPay
- khóa bớt các action không phù hợp
- acceptance: admin nhìn được nguồn thanh toán và trạng thái gateway

## Task 8, verification
- test sandbox payment success
- test cancelled/failed payment
- test duplicate IPN
- test amount mismatch
- test invalid hash
- acceptance: không có case confirm sai đơn

## 13. Commands

### Backend
```bash
cd /Users/hoangkien/NLV/baking/backend
npm install
npx prisma generate
npx prisma migrate dev --name add_vnpay_fields
npm run dev
```

### Frontend
```bash
cd /Users/hoangkien/NLV/baking/frontend
npm install
npm run dev
```

## 14. Example API Contract Draft

### Create payment URL
`POST /api/vnpay/create-payment-url`

Request:
```json
{
  "orderId": "uuid",
  "bankCode": "VNBANK"
}
```

Response:
```json
{
  "paymentUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?..."
}
```

### VNPay return
`GET /api/vnpay/return?...`

Behavior:
- verify hash
- map to order
- redirect về frontend route như:
  - `/payment/vnpay-return?orderId=...&status=success`
  - hoặc `status=pending`
  - hoặc `status=failed`

### VNPay IPN
`GET /api/vnpay/ipn?...`

Behavior:
- verify hash
- check order
- check amount
- check order not already confirmed
- update DB
- return VNPay-compatible response code

## 15. Testing Strategy

## Unit tests
- param sorting
- secure hash signing
- secure hash verification
- query normalization

## Integration tests
- create payment URL with valid order
- reject create URL for confirmed/cancelled order
- IPN success updates order to `CONFIRMED`
- duplicate IPN returns success without double update
- invalid hash rejected
- amount mismatch rejected and flagged

## Manual sandbox tests
- successful VNPay payment
- payment cancelled by user
- browser close before return URL but IPN still arrives
- return URL arrives before IPN

## 16. Risks and Mitigations

### Risk 1, current order model is built for manual transfer first
**Mitigation:** keep statuses but separate VNPay path clearly, especially keep `AWAITING_CONFIRM` for manual flow only.

### Risk 2, secrets currently seem likely to be pushed toward admin UI config
**Mitigation:** store VNPay secrets in backend env, not public/admin-readable API.

### Risk 3, generic webhook route may confuse architecture
**Mitigation:** keep `/api/webhook/payment` for bank-transfer webhook adapters if needed, but create a dedicated `/api/vnpay/*` module for VNPay.

### Risk 4, return/IPN race conditions
**Mitigation:** frontend result page must tolerate pending state and poll/refetch order status.

## 17. Recommended File Placement

### Docs
- this file: `docs/VNPAY_INTEGRATION_PLAN.md`
- optional next: `docs/VNPAY_IMPLEMENTATION_SPEC.md`

### Backend
- `backend/src/controllers/vnpayController.js`
- `backend/src/routes/vnpayRoutes.js`
- `backend/src/services/vnpayService.js`
- `backend/src/utils/vnpay.js`

### Frontend
- `frontend/src/pages/PaymentResult.jsx`
- update `frontend/src/pages/Checkout.jsx`
- update `frontend/src/constants/routes.js`
- update `frontend/src/services/api.js`

## 18. Final Recommendation

Cho dự án này, hướng đúng là:

- giữ `Order` làm thực thể trung tâm
- thêm một integration module VNPay riêng ở backend
- xác nhận thanh toán bằng **IPN đã verify hash**, không dựa vào frontend return
- giữ manual transfer làm fallback ở giai đoạn đầu nếu business cần
- tách secrets VNPay ra `.env`, không đưa vào public config

Nếu Boss muốn, bước tiếp theo tôi có thể viết luôn:
1. **spec triển khai chi tiết hơn**, hoặc
2. **bản patch code đầu tiên cho backend VNPay skeleton**.