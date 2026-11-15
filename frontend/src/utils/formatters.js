// src/utils/formatters.js

export function formatPrice(price, currency = 'EUR', locale = 'fr-FR') {
  if (price == null) return '';
  const n = Number(price);
  if (Number.isNaN(n)) return '';
  
  try {
    return new Intl.NumberFormat(locale, { 
      style: 'currency', 
      currency: currency || 'EUR' 
    }).format(n);
  } catch {
    return `${n} ${currency}`;
  }
}

export function formatDate(value, locale = 'fr-FR') {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatLocation({ city, country } = {}) {
  return [city, country].filter(Boolean).join(', ');
}

export function pluralize(count, singular, plural = `${singular}s`) {
  return count > 1 ? plural : singular;
}