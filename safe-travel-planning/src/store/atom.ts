import { atom } from 'recoil';

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
