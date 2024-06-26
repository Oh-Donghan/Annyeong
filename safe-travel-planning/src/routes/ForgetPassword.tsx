import styled from 'styled-components';
import {
  Form,
  Input,
  Title,
  Wrapper,
} from '../components/styles/auth-components';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Text = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  p {
    padding: 10px;
  }
`;

export default function ForgetPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setEmail(value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await sendPasswordResetEmail(auth, email);
      alert('비밀번호 재설정 메일이 발송되었습니다');
      navigate('/login');
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>비밀번호 찾기</Title>
      <Text>
        <p>이메일 계정으로 찾기</p>
        <p>이메일 계정의 주소로 비밀번호 재설정 메일이 발송됩니다.</p>
      </Text>
      <Form onSubmit={onSubmit}>
        <Input onChange={onChange} value={email} placeholder='이메일 입력' />
        <Input type='submit' value={isLoading ? '발송중..' : '발송'} />
      </Form>
    </Wrapper>
  );
}
