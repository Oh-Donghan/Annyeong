import { styled } from 'styled-components';

export const Wrapper = styled.div`
  margin: 100px auto 0;
  /* height: 100%; */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 420px;
  padding: 50px 0px;
`;

export const Title = styled.h1`
  font-weight: bold;
  font-size: 42px;
`;

export const Form = styled.form`
  margin-top: 50px;
  margin-bottom: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

export const Label = styled.label`
  font-size: 14px;
`;

export const Input = styled.input`
  margin-bottom: 5px;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  width: 100%;
  font-size: 16px;
  outline: none;
  background-color: ${props => props.theme.textColor};
  color: ${props => props.theme.bgColor};
  &[type='submit'] {
    margin-top: 10px;
    height: 42px;
    background-color: ${props => props.theme.bgColor};
    color: ${props => props.theme.textColor};
    outline: 2px solid ${props => props.theme.textColor};
    cursor: pointer;
    transition: all 0.2s ease-out;
    &:hover {
      background-color: #dda94b;
      color: #333D79;
      outline: 2px solid #dda94b;
      font-weight: bold;
      opacity: 0.9;
    }
  }
  &::placeholder {
    opacity: 0.9;
  }
`;

export const Error = styled.span`
  font-weight: 600;
  color: red;
`;

export const Switcher = styled.span`
  margin-top: 20px;
  a {
    color: #dda94b;
  }
`;