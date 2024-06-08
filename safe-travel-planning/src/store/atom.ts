import { atom } from 'recoil';
import { UserProps } from '../components/layout/AuthProvider';

export const isDarkAtom = atom({
  key: 'isDark',
  default: false,
  effects_UNSTABLE: [
    ({ setSelf, onSet }) => {
      const savedValue = localStorage.getItem('isDark');
      if (savedValue !== null) {
        setSelf(savedValue === 'true');
      }

      onSet((newValue) => {
        localStorage.setItem('isDark', newValue.toString());
      });
    },
  ],
});

export const authState = atom<UserProps | null>({
  key: 'authState',
  default: null,
});