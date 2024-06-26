import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { auth } from '../../../firebase';
import googleLogo from '../../assets/google-logo.svg';

const Button = styled.span`
  display: flex;
  width:80%;
  margin-top: 50px;
  padding: 10px 20px;
  border: 0;
  border-radius: 40px;
  background-color: ${props => props.theme.bgColor};
  outline: 2px solid ${props => props.theme.textColor};
  color:#dda94b;
  font-weight: 500;
  font-size: 18px;
  gap: 8px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`

export default function SocialButton() {
  const navigate = useNavigate();
  const onClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (e) {
      console.log(e);
    }
  }
  
  return (
    <Button onClick={onClick}>
      <img className='h-6' src={googleLogo} />
      계정으로 로그인
    </Button>
  )
}
