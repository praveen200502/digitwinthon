export function truncateText(text: string, length: number): string {
  return text.length > length ? text.slice(0, length) + '...' : text;
}

export function capitalizeWords(text: string): string {
  return text
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function generateId(prefix?: string): string {
  const id = Math.random().toString(36).substring(2, 11);
  return prefix ? `${prefix}-${id}` : id;
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
