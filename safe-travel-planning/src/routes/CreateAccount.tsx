import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../firebase';
import { FirebaseError } from 'firebase/app';
import {
  Form,
  Input,
  Label,
  Switcher,
  Title,
  Wrapper,
  Error
} from '../components/styles/auth-components';
import SocialButton from '../components/layout/SocialButton';

export default function CreateAccount() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { id, value },
    } = e;
    if (id === 'name') {
      setName(value);
    } else if (id === 'email') {
      setEmail(value);
    } else if (id === 'password') {
      setPassword(value);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (isLoading || name === '' || email === '' || password === '') return;
    try {
      setIsLoading(true);

      const creadentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(creadentials.user, {
        displayName: name,
      });
      navigate('/');
    } catch (e) {
      if (e instanceof FirebaseError) {
        if (e.code === 'auth/email-already-in-use') {
          setError('That email already exists.');
        } else {
          setError(e.message);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>회원가입</Title>
      <Form onSubmit={onSubmit}>
        <Label htmlFor='name'>이름</Label>
        <Input
          className=' dark:bg-my-bg bg-my-text dark:text-my-text text-my-bg'
          onChange={onChange}
          id='name'
          value={name}
          type='text'
          placeholder='이름을 입력해 주세요.'
          required
        />
        <Label htmlFor='name'>이메일</Label>
        <Input
          className=' dark:bg-my-bg bg-my-text dark:text-my-text text-my-bg'
          onChange={onChange}
          id='email'
          value={email}
          type='email'
          placeholder='이메일 주소를 입력해 주세요.'
          required
        />
        <Label htmlFor='name'>비밀번호</Label>
        <Input
          className=' dark:bg-my-bg bg-my-text dark:text-my-text text-my-bg'
          onChange={onChange}
          id='password'
          value={password}
          type='password'
          placeholder='비밀번호를 입력해 주세요.'
          required
        />
        <Input
          className=' bg-my-bg dark:bg-my-text text-my-text dark:text-my-bg dark:my-outline-dark'
          type='submit'
          value={isLoading ? 'Loading...' : '회원가입'}
        />
      </Form>
      {error !== '' ? <Error>{error}</Error> : null}
      <Switcher className=' dark:text-my-bg'>
        이미 계정이 있으신가요? &nbsp;&nbsp;{' '}
        <Link to='/login'>로그인 &rarr;</Link>
      </Switcher>
      <SocialButton />
    </Wrapper>
  );
}
