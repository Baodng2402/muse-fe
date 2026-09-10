/**
 * "0901234567" -> "090•• ••• 567" — how a guest sees the number.
 */
export function maskPhone(phone: string): string {
  if (!phone || phone.length < 6) return '090•• ••• •••';
  return `${phone.slice(0, 3)}•• ••• ${phone.slice(-3)}`;
}

/**
 * "0901234567" -> "090 123 4567" — how a signed-in user sees the number.
 */
export function formatPhone(phone: string): string {
  if (!phone || phone.length < 10) return phone || '';
  return `${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`;
}
