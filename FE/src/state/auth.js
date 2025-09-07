import { atom, selector } from 'recoil';
import { setAuthToken } from '../api/client';

const KEY = 'auth_v1';

const persist = ({ setSelf, onSet }) => {
  const saved = localStorage.getItem(KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      setSelf(parsed);
      if (parsed?.token) setAuthToken(parsed.token);
    } catch (_) {}
  }
  onSet((v) => {
    if (v) localStorage.setItem(KEY, JSON.stringify(v)); else localStorage.removeItem(KEY);
    setAuthToken(v?.token || null);
  });
};

export const authState = atom({
  key: 'authState',
  default: null,
  effects: [persist],
});

export const isAuthedSelector = selector({
  key: 'isAuthedSelector',
  get: ({ get }) => Boolean(get(authState)?.token),
});


