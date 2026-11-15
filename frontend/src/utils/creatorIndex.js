export const ALPHABET = ['ALL', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];

export function normalize(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function getCountryName(creator) {
  return creator?.country_of_origin?.name || 'Afrique';
}

export function getPageNumbers(currentPage, totalPages) {
  const delta = 1;
  const range = [];
  const rangeWithDots = [];
  let previous;

  for (let number = 1; number <= totalPages; number += 1) {
    if (number === 1 || number === totalPages || (number >= currentPage - delta && number <= currentPage + delta)) {
      range.push(number);
    }
  }

  range.forEach((number) => {
    if (previous) {
      if (number - previous === 2) {
        rangeWithDots.push(previous + 1);
      } else if (number - previous !== 1) {
        rangeWithDots.push('...');
      }
    }
    rangeWithDots.push(number);
    previous = number;
  });

  return rangeWithDots;
}