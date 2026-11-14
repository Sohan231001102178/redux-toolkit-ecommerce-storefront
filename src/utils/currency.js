/**
 * Indian Rupee (INR) currency formatting helper
 * Uses standard Indian numbering system (Lakhs and Crores e.g. ₹1,29,999.00)
 */

export const formatINR = (amount) => {
  const numeric = typeof amount === 'number' ? amount : Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numeric);
};

export default formatINR;
