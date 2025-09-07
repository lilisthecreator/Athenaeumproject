import { atom, selector } from 'recoil';

export const scannedIsbnState = atom({
  key: 'scannedIsbnState',
  default: '',
});

export const bookByIsbnState = atom({
  key: 'bookByIsbnState',
  default: {}, // map isbn -> book
});

export const selectedBookSelector = selector({
  key: 'selectedBookSelector',
  get: ({ get }) => {
    const isbn = get(scannedIsbnState);
    const map = get(bookByIsbnState);
    return isbn && map[isbn] ? map[isbn] : null;
  },
});


