import { useSetRecoilState } from 'recoil';
import { authState } from '../../store/atom';
import { ReactNode, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../firebase';

interface AuthProps {
  children: ReactNode;
}

export interface UserProps {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export default function AuthProvider({ children }: AuthProps) {
  const setAuthState = useSetRecoilState<UserProps | null>(authState);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthState({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        });
      } else {
        setAuthState(null);
      }
    });

    return () => unsubscribe();
  }, [setAuthState]);

  return <>{children}</>;
}
