import { atom, selector } from 'recoil';
import { setAuthToken } from '../api/client';

const localStorageKey = 'athenaeum_auth';

function persistEffect(key) {
  return ({ setSelf, onSet }) => {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSelf(parsed);
        if (parsed?.token) setAuthToken(parsed.token);
      } catch (_) {}
    }
    onSet((newValue) => {
      try {
        if (newValue) {
          localStorage.setItem(key, JSON.stringify(newValue));
          if (newValue?.token) setAuthToken(newValue.token);
          else setAuthToken(null);
        } else {
          localStorage.removeItem(key);
          setAuthToken(null);
        }
      } catch (_) {}
    });
  };
}

export const authState = atom({
  key: 'authState',
  default: null, // { token, user: { id, email, name } }
  effects: [persistEffect(localStorageKey)],
});

export const isAuthenticatedSelector = selector({
  key: 'isAuthenticatedSelector',
  get: ({ get }) => Boolean(get(authState)?.token),
});


