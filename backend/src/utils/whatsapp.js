export function isWhatsAppGroupInvite(value) {
  if (typeof value !== 'string' || !value.trim()) return false;
  try {
    const url = new URL(value.trim());
    return url.protocol === 'https:'
      && url.hostname.toLowerCase() === 'chat.whatsapp.com'
      && url.pathname.split('/').filter(Boolean).length > 0;
  } catch {
    return false;
  }
}
