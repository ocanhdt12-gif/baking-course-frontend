/**
 * Format price from cents (Int) to display string
 * @param {number} priceInCents - Price in cents (e.g. 55000 = $550.00)
 * @returns {string} Formatted price string (e.g. "$550.00")
 */
export const formatPrice = (priceInCents) => {
  if (priceInCents == null || priceInCents === 0) return 'Miễn phí';
  return `${priceInCents.toLocaleString('vi-VN')}đ`;
};

/**
 * Format price for input fields (returns just the number in dollars)
 * @param {number} priceInCents - Price in cents
 * @returns {string} Price in dollars as plain number string
 */
export const priceToDollars = (priceInCents) => {
  if (priceInCents == null) return '';
  return priceInCents.toString();
};

/**
 * Convert dollar amount to cents for storage
 * @param {string|number} dollars - Dollar amount (e.g. "550" or 550)
 * @returns {number} Price in cents
 */
export const dollarsToCents = (dollars) => {
  const num = parseFloat(dollars);
  if (isNaN(num)) return 0;
  return Math.round(num);
};

/**
 * Get order status badge configuration
 * @param {string} status - Order status
 * @returns {{ label: string, className: string }}
 */
export const getOrderStatusBadge = (status) => {
  switch (status) {
    case 'PENDING':
      return { label: 'Chờ thanh toán', className: 'badge-warning bg-warning text-dark' };
    case 'AWAITING_CONFIRM':
      return { label: 'Chờ đối soát', className: 'badge-info bg-info text-white' };
    case 'CONFIRMED':
      return { label: 'Đã duyệt', className: 'badge-success bg-success text-white' };
    case 'REJECTED':
      return { label: 'Từ chối', className: 'badge-danger bg-danger text-white' };
    case 'CANCELLED':
      return { label: 'Đã hủy', className: 'badge-secondary bg-secondary text-white' };
    default:
      return { label: status || 'Không rõ', className: 'badge-secondary bg-secondary' };
  }
};
