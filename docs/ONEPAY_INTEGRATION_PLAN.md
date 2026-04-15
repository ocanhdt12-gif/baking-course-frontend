# OnePay Integration Plan for `/Users/hoangkien/NLV/baking`

## 1. Objective

Bổ sung một kế hoạch tích hợp **OnePay** song song với plan VNPay đã có, để khách hàng có thể so sánh hai cổng thanh toán trước khi đội triển khai code. Ở giai đoạn này, mục tiêu chỉ là:

- nghiên cứu mô hình tích hợp phù hợp với kiến trúc dự án hiện tại
- xác định thay đổi cần thiết ở backend, frontend, schema, và admin
- giữ OnePay như một plan độc lập, không thay thế plan VNPay
- chuẩn bị sẵn để khi khách chọn OnePay thì có thể bắt đầu implementation ngay

## 2. Scope Clarification

Plan này **không hủy hoặc sửa** plan VNPay hiện có.

Tình trạng mong muốn sau bước này:
- `docs/VNPAY_INTEGRATION_PLAN.md` vẫn giữ nguyên
- thêm `docs/ONEPAY_INTEGRATION_PLAN.md`
- sau đó khách sẽ chọn một trong hai cổng, hoặc quyết định hỗ trợ cả hai
- chỉ khi khách chốt lựa chọn thì mới bước vào implementation

## 3. Current Project Architecture

Dự án hiện tại đã có payment flow dạng thủ công đang được xây:

### Frontend
- `frontend/src/pages/Checkout.jsx`
- `frontend/src/components/Admin/AdminOrders.jsx`
- `frontend/src/components/Admin/AdminPaymentConfig.jsx`
- `frontend/src/services/api.js`

### Backend
- `backend/src/controllers/orderController.js`
- `backend/src/controllers/paymentConfigController.js`
- `backend/src/controllers/webhookController.js`
- `backend/src/routes/orderRoutes.js`
- `backend/src/routes/paymentConfigRoutes.js`
- `backend/src/routes/webhookRoutes.js`

### Prisma
- `Order`
- `PaymentConfig`

Hiện trạng:
- payment proof thủ công là luồng chính đang được code
- order management đã xuất hiện
- backend chưa có integration module chuyên dụng cho OnePay

## 4. OnePay Integration Model to Apply

Từ tài liệu và mẫu tích hợp phổ biến của OnePay, mô hình phù hợp cho dự án này gồm 4 phần:

1. **Create purchase / payment redirect URL**
   - backend sinh URL thanh toán OnePay từ order
   - frontend redirect user sang OnePay

2. **Return URL**
   - OnePay redirect user quay về website sau khi giao dịch kết thúc
   - endpoint này chủ yếu để hiển thị kết quả cho user
   - không nên là nơi chốt order như nguồn sự thật duy nhất

3. **IPN / server callback**
   - OnePay callback về backend
   - backend verify tính hợp lệ dữ liệu
   - đây là nơi phù hợp nhất để cập nhật trạng thái order

4. **Transaction query**
   - OnePay hỗ trợ query lại giao dịch theo `MerchTxnRef`
   - rất hữu ích nếu return và callback có race condition hoặc cần reconcile thủ công

Đây là điểm khác đáng giá so với VNPay: OnePay có hướng query transaction khá rõ, nên phù hợp cho chiến lược đối soát khi callback bị trễ hoặc cần điều tra.

## 5. Core OnePay Concepts Relevant Here

Các credential/field quan trọng:

- `MerchantId`
- `AccessCode`
- `SecureSecret`
- `ReturnURL`
- `MerchTxnRef` — mã giao dịch merchant, nên map với order
- `OrderInfo`
- `Amount`
- `TicketNo` — IP của client
- `Locale`
- `AgainLink`
- `Title`
- `TransactionNo`
- `ResponseCode`
- `Message`

Theo mẫu phổ biến:
- `ResponseCode = 0` thường là giao dịch thành công
- callback/return cần verify checksum/hash trước khi tin tưởng dữ liệu

## 6. Recommended Strategy for This Repo

## Recommendation
Với dự án baking này, nên áp dụng chiến lược tương tự VNPay:

- giữ `Order` là bản ghi giao dịch trung tâm
- tạo module OnePay riêng ở backend
- dùng **IPN làm nơi chốt trạng thái chính**
- dùng **return URL cho UI**
- dùng **query transaction** làm fallback đối soát nếu cần

### Why this is a good fit
Kiến trúc hiện tại đã có `Order`, `Checkout`, `AdminOrders`, nên OnePay có thể gắn vào cùng xương sống mà không phải thay luồng nghiệp vụ cốt lõi.

## 7. Data Model Changes

Để OnePay và VNPay cùng có thể cắm vào một mô hình chung, khuyến nghị giữ hướng mở rộng `Order` giống plan VNPay.

### Recommended `Order` additions
- `paymentMethod String?` — ví dụ `MANUAL_BANK`, `ONEPAY`, `VNPAY`
- `paymentProvider String?` — `ONEPAY`
- `paymentUrl String?`
- `paymentInitiatedAt DateTime?`
- `paymentExpiresAt DateTime?`
- `gatewayTxnRef String?` — map với `MerchTxnRef`
- `gatewayTransactionNo String?` — map với `TransactionNo`
- `gatewayResponseCode String?`
- `gatewayMessage String?`
- `paidAt DateTime?`
- `rawGatewayPayload Json?`

### Why align with VNPay plan
Nếu sau này khách chọn OnePay thay vì VNPay, hoặc muốn hỗ trợ cả hai, thì ta tránh việc schema bị chia đôi theo từng gateway.

## 8. Secrets and Configuration

Khuyến nghị để OnePay secrets trong `.env`, không đưa vào public API hoặc frontend.

### ENV đề xuất
- `ONEPAY_MERCHANT_ID`
- `ONEPAY_ACCESS_CODE`
- `ONEPAY_SECURE_SECRET`
- `ONEPAY_PAYMENT_URL`
- `ONEPAY_RETURN_URL`
- `ONEPAY_IPN_URL`
- `ONEPAY_QUERY_DR_URL`
- `ONEPAY_LOCALE=vn`
- `ONEPAY_VERSION` nếu OnePay contract yêu cầu

### Do not store in frontend/admin UI
- `SecureSecret`
- full signing config

Nếu cần admin chỉnh cấu hình runtime, chỉ nên cho phép chọn provider, bật/tắt provider, hoặc nhập non-secret display metadata. Secret vẫn phải nằm server-side.

## 9. Backend Architecture Plan

### Files to add
- `backend/src/controllers/onepayController.js`
- `backend/src/routes/onepayRoutes.js`
- `backend/src/services/onepayService.js`
- `backend/src/utils/onepay.js`

### Route design

#### Authenticated route for payment creation
- `POST /api/onepay/create-payment-url`
  - auth required
  - input: `{ orderId }`
  - output: `{ paymentUrl }`

#### Public return route
- `GET /api/onepay/return`
  - verify secure response from OnePay
  - map to order by `MerchTxnRef`
  - redirect frontend result page or return JSON in dev

#### Public IPN route
- `POST /api/onepay/ipn` or `GET /api/onepay/ipn`
  - exact method depends on OnePay contract provisioned for merchant
  - verify signature/hash
  - update order if valid and successful
  - return provider-compatible acknowledgment

#### Internal/admin reconcile route, optional
- `POST /api/onepay/query-transaction`
  - admin only
  - input: `{ orderId }`
  - backend queries OnePay by `MerchTxnRef`
  - useful for payment dispute, callback loss, or manual reconciliation

## 10. Service Responsibilities

### `onepayService.js`
- build payment request params
- sign outgoing request
- verify return/IPN payloads
- normalize OnePay response fields into internal format
- query transaction by `MerchTxnRef`

### `onepayController.js`
- create payment URL for a given order
- handle return flow for browser UX
- handle IPN for source-of-truth order updates
- optionally support query/reconcile action

## 11. Order Lifecycle Mapping

### Existing statuses
- `PENDING`
- `AWAITING_CONFIRM`
- `CONFIRMED`
- `REJECTED`
- `CANCELLED`

### Recommended OnePay mapping
- create order → `PENDING`
- create OnePay payment URL → still `PENDING`
- user pays on OnePay → wait for verified callback
- successful verified IPN → `CONFIRMED`
- failed transaction → stay `PENDING` or move to a failed-visible state if business wants
- user abandons payment → still `PENDING`, then timeout/cancel policy applies
- admin reconcile via query confirms payment → `CONFIRMED` only if reconcile result proves success

### Important rule
`AWAITING_CONFIRM` nên tiếp tục dành cho proof thủ công, không dùng cho luồng OnePay auto-confirm, trừ khi business cố tình muốn có khâu review tay.

## 12. Frontend Integration Plan

## Checkout changes
`Checkout.jsx` hiện thiên về bank transfer thủ công. Nếu triển khai OnePay, nên đổi thành flow đa phương thức:

1. Order Summary
2. Payment Method
3. Redirect to OnePay or Manual Transfer
4. Payment Result

### Frontend tasks
- thêm lựa chọn `OnePay`
- nếu user chọn OnePay:
  - gọi `POST /api/onepay/create-payment-url`
  - redirect browser sang `paymentUrl`
- thêm result page, ví dụ:
  - `frontend/src/pages/PaymentResult.jsx`
- thêm route kiểu:
  - `/payment/onepay-return`

### Result page behavior
- đọc query params OnePay trả về
- hiển thị success / failed / pending
- refetch order detail từ backend
- nếu callback chưa xử lý xong, hiển thị “Đang xác nhận thanh toán”

## 13. Admin Panel Changes

### `AdminOrders.jsx`
Cần hiển thị thêm:
- `paymentProvider`
- `paymentMethod`
- `gatewayTxnRef`
- `gatewayTransactionNo`
- `gatewayResponseCode`
- `gatewayMessage`
- `paidAt`
- trạng thái reconcile nếu có

### Admin actions
Với order OnePay thành công:
- ưu tiên read-only hoặc limited override
- không cần confirm proof kiểu thủ công

### Nice-to-have
Thêm nút:
- `Re-query provider`

Nút này sẽ gọi backend query lại giao dịch từ OnePay bằng `MerchTxnRef`, rất hữu ích khi khách báo đã trả tiền nhưng callback chưa cập nhật.

## 14. Security Requirements

### Always do
- chỉ build request và ký request ở backend
- verify callback/return signature trước khi dùng dữ liệu
- map `MerchTxnRef` tới đúng 1 order
- so khớp amount với order hiện tại
- xử lý idempotency cho callback lặp lại
- không log `SecureSecret`
- dùng query transaction như một lớp đối soát phụ trợ, không phải thay thế hoàn toàn callback

### Ask first
- có hỗ trợ cả OnePay nội địa và quốc tế không
- có cần multiple payment channels ngay từ đầu không
- có cho admin manual override với order OnePay không
- có cần refund workflow trong phase đầu không

### Never do
- không lưu `SecureSecret` ở frontend
- không để frontend tự verify hash
- không tin dữ liệu return/callback nếu chưa verify
- không update confirmed state dựa trên UI-only signal

## 15. Comparison Notes, OnePay vs Current Project Needs

### Strengths of OnePay for this project
- phù hợp với mô hình redirect payment gateway truyền thống
- có transaction query, tốt cho reconcile
- có thể hỗ trợ nội địa/quốc tế tùy gói merchant

### Costs / complexity
- cần thêm service query transaction nếu muốn tận dụng hết ưu thế
- callback contract có thể khác theo package nội địa/quốc tế, cần xác nhận lúc ký hợp đồng
- nếu khách chỉ muốn một cổng đơn giản cho VND nội địa, có thể phải cân nhắc so với VNPay về effort và business fit

## 16. Detailed Implementation Tasks

## Task 1, confirm merchant package assumptions
- xác định OnePay nội địa, quốc tế, hay cả hai
- xác định callback method và endpoint contract
- acceptance: có bảng config chính xác từ merchant account

## Task 2, extend Prisma schema
- thêm các field gateway/payment chung vào `Order`
- acceptance: schema dùng được cho OnePay và cả gateway khác

## Task 3, build OnePay signing/verification layer
- build outgoing request params
- verify return payload
- verify IPN payload
- acceptance: có fixture test cho sign/verify

## Task 4, implement OnePay backend routes
- create-payment-url
- return
- ipn
- optional query-transaction
- acceptance: xử lý đúng success/failure/idempotent/reconcile

## Task 5, adapt checkout frontend
- thêm payment method switch
- gọi OnePay create-payment-url
- redirect đúng flow
- acceptance: user đi từ checkout sang OnePay được

## Task 6, implement result page
- render trạng thái dựa trên query + backend order
- acceptance: UX rõ ràng trong cả success, fail, pending

## Task 7, update admin panel
- thêm metadata và reconcile action
- acceptance: admin thấy rõ order đến từ OnePay và có thể query lại giao dịch

## Task 8, verification
- test success callback
- test failed payment
- test duplicate callback
- test invalid signature
- test mismatch amount
- test return-before-ipn race
- test query transaction for reconciliation

## 17. Example Contract Draft

### Create payment URL
`POST /api/onepay/create-payment-url`

Request:
```json
{
  "orderId": "uuid"
}
```

Response:
```json
{
  "paymentUrl": "https://...onepay..."
}
```

### Return endpoint
`GET /api/onepay/return?...`

Behavior:
- verify request
- map `MerchTxnRef`
- redirect frontend page like:
  - `/payment/onepay-return?orderId=...&status=success`
  - `/payment/onepay-return?orderId=...&status=failed`
  - `/payment/onepay-return?orderId=...&status=pending`

### IPN endpoint
`POST /api/onepay/ipn` or `GET /api/onepay/ipn`

Behavior:
- verify request
- validate amount and order state
- update DB
- return provider-compatible ack

### Query endpoint
`POST /api/onepay/query-transaction`

Request:
```json
{
  "orderId": "uuid"
}
```

Behavior:
- fetch order
- call OnePay query API by `MerchTxnRef`
- return normalized status summary

## 18. Testing Strategy

## Unit tests
- sign request params
- verify response payload
- normalize response codes
- parse query result

## Integration tests
- create payment URL for valid order
- reject create payment URL for invalid order state
- valid IPN updates order to `CONFIRMED`
- duplicate IPN has no duplicate side effect
- invalid signature rejected
- query transaction returns normalized result

## Manual / sandbox tests
- successful card payment
- cancelled payment
- payment success but browser never returns
- return URL hit before IPN
- query transaction recovers final state

## 19. Risks and Mitigations

### Risk 1, package-specific differences in OnePay contract
**Mitigation:** before implementation, confirm exact merchant package, domestic vs international, callback method, and sandbox endpoints.

### Risk 2, current codebase is manual-transfer-first
**Mitigation:** keep `Order` as neutral payment entity and isolate OnePay inside its own module.

### Risk 3, callback loss or delayed callback
**Mitigation:** leverage query transaction endpoint for reconciliation.

### Risk 4, secrets leakage through admin UI
**Mitigation:** keep all OnePay signing credentials in server env only.

## 20. Recommended File Placement

### Docs
- `docs/ONEPAY_INTEGRATION_PLAN.md`
- keep `docs/VNPAY_INTEGRATION_PLAN.md` as-is

### Backend
- `backend/src/controllers/onepayController.js`
- `backend/src/routes/onepayRoutes.js`
- `backend/src/services/onepayService.js`
- `backend/src/utils/onepay.js`

### Frontend
- `frontend/src/pages/PaymentResult.jsx`
- update `frontend/src/pages/Checkout.jsx`
- update `frontend/src/constants/routes.js`
- update `frontend/src/services/api.js`

## 21. Final Recommendation

Ở thời điểm hiện tại, hướng đúng là:

- giữ nguyên plan VNPay
- thêm plan OnePay như một tài liệu lựa chọn thay thế
- chưa code ngay cho OnePay khi khách chưa chốt
- nếu sau này khách chọn OnePay, triển khai theo mô hình:
  - backend module riêng
  - IPN làm nguồn chốt trạng thái
  - query transaction làm công cụ đối soát
  - frontend chỉ lo redirect và hiển thị kết quả

Nếu Boss muốn, bước tiếp theo tôi có thể làm thêm một file thứ ba:
- **bảng so sánh VNPay vs OnePay cho riêng dự án baking này**, để khách nhìn vào là chọn nhanh hơn.