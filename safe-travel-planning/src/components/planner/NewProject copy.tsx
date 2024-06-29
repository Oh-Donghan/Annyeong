import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { authState } from '../../store/atom';
import { addDoc, collection, doc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useParams } from 'react-router-dom';

const Form = styled.form`
  width: 70%;
  height: 100%;
  margin-top: 4rem;
`;

const ButtonBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 15px;
  font-weight: bold;
`;

const CancelBtn = styled.button``;

const SaveBtn = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.textColor};
`;

const InputBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const Field = styled.p`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 16px 0;
`;

const Label = styled.label`
  font-size: 14px;
  line-height: 20px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.25rem;
  background-color: #fff;
  border-bottom-width: 2px;
  border-radius: 0.125rem;
  border-color: #d1d5db;
  color: #000;
  &:focus {
    outline: none;
    border-color: #4b5563;
  }
  /* For webkit browsers (Chrome, Safari, Edge) */
  &::-webkit-datetime-edit {
    color: #4b5563; /* 텍스트 컬러 변경 */
  }

  /* For Firefox */
  &::-moz-datetime-edit {
    color: #4b5563; /* 텍스트 컬러 변경 */
  }

  /* For Microsoft Edge */
  &::-ms-datetime-edit {
    color: #4b5563; /* 텍스트 컬러 변경 */
  }
`;

const TextArea = styled(Input).attrs({ as: 'textarea' })``;

interface IProjectProps {
  onResetView: () => void;
}

export default function NewProject({ onResetView }: IProjectProps) {
  const user = useRecoilValue(authState);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { countryId } = useParams();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user || title === '' || description === '' || date === '') return;
    if (!user.uid) {
      console.error('User UID is undefined');
      return;
    }
    if (!countryId) {
      console.error('Country name is undefined');
      return;
    }

    try {
      setIsLoading(true);
      const countryDocRef = doc(db, 'users', user.uid, 'countries', countryId);
      const plansColRef = collection(countryDocRef, 'plans');
      await addDoc(plansColRef, {
        title,
        description,
        createdAt: date,
        username: user.displayName || 'Anonymous',
        userId: user.uid,
      });
      setTitle('');
      setDescription('');
      setDate('');
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <ButtonBox>
        <CancelBtn onClick={onResetView}>취소</CancelBtn>
        <SaveBtn type='submit'>{isLoading ? '저장중..' : '저장'}</SaveBtn>
      </ButtonBox>
      <InputBox>
        <Field>
          <Label>제목</Label>
          <Input
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Field>
        <Field>
          <Label>설명</Label>
          <TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>
        <Field>
          <Label>날짜</Label>
          <Input
            type='date'
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Field>
      </InputBox>
    </Form>
  );
}
