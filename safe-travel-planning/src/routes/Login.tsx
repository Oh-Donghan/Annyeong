import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
// import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import SocialButton from '../components/layout/SocialButton';
import { Form, Input, Label, Switcher, Title, Wrapper, Error } from '../components/styles/auth-components';
import { auth } from '../../firebase';


export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (isLoading || email === '' || password === '') return;
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log(e.code);
        setError(e.message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Wrapper>
      <Title>로그인</Title>
      <Form onSubmit={onSubmit}>
        <Label htmlFor='email'>이메일</Label>
        <Input
          id='email'
          onChange={onChange}
          name='email'
          value={email}
          placeholder='이메일 주소를 입력해 주세요.'
          type='email'
          required
        />
        <Label htmlFor='password'>비밀번호</Label>
        <Input
          id='password'
          onChange={onChange}
          name='password'
          value={password}
          placeholder='비밀번호를 입력해 주세요.'
          type='password'
          required
        />
        <Input type='submit' value={isLoading ? 'Loading...' : '로그인'} />
      </Form>
      {error !== '' ? <Error>{error}</Error> : null}
      <Switcher className=' dark:text-my-bg'>
        Don't have an account? &nbsp;&nbsp;
        <Link to='/create-account'>Create one &rarr;</Link>
      </Switcher>
      <SocialButton />
    </Wrapper>
  )
}
