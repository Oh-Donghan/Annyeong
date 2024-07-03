import { useState } from 'react';
import styled from 'styled-components';
import { addDoc, collection, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authState } from '../../store/atom';
import Tasks from './Tasks';

interface IDailyProps {
  planId: string;
  onResetView: () => void;
  title: string;
  date: string;
  description: string;
}

export default function DailyPlan({
  planId,
  onResetView,
  title,
  description,
  date,
}: IDailyProps) {
  const [inputTask, setInputTask] = useState<string>('');

  const { countryId } = useParams();
  const user = useRecoilValue(authState);

  // Plan 삭제
  const deletePlan = async () => {
    try {
      await deleteDoc(doc(db, 'plans', planId));
      console.log('Plan deleted');
      onResetView();
    } catch (e) {
      console.error('Error deleting document', e);
    }
  };

  // Tasks 추가
  const addTask = async () => {
    if (inputTask.trim() === '' || !user || !countryId) return;

    await addDoc(collection(db, 'tasks'), {
      createdAt: Date.now(),
      text: inputTask,
      completed: false,
      planId: planId,
    });
    setInputTask('');
  };

  // Date 포멧
  const formattedDate = date
    ? new Date(date).toLocaleDateString('ko-kr', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Invalid date';

  return (
    <Wrapper>
      <Header>
        <HeaderContainer>
          <Title>{title}</Title>
          <DeleteBtn onClick={deletePlan}>삭제</DeleteBtn>
        </HeaderContainer>
        <Year>{formattedDate}</Year>
        <Description>{description}</Description>
      </Header>
      <Todo>할일</Todo>
      <NewPlan>
        <Input
          id='task'
          type='text'
          value={inputTask}
          onChange={(e) => setInputTask(e.target.value)}
        />
        <AddBtn onClick={addTask}>추가</AddBtn>
      </NewPlan>
      <Tasks planId={planId} countryId={countryId} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  width: 80%;
  height: 100%;
  margin-top: 4rem;
`;

const Header = styled.header`
  padding-bottom: 1rem;
  margin-bottom: 1.2rem;
  border-bottom: 1.5px solid ${(props) => props.theme.bgColor};
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h1`
  margin-bottom: 1rem;
  font-size: 30px;
  font-weight: bold;
  color: ${(props) => props.theme.bgColor};
  /* overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis; */
  /* width: 200px; */
`;

const Year = styled.p`
  margin-bottom: 1.2rem;
  opacity: 0.6;
`;

const Description = styled.p`
  opacity: 0.9;
`;

const Todo = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const NewPlan = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Input = styled.input`
  width: 16rem;
  padding: 0.25rem 0.5rem;
  outline: none;
  border-radius: 5px;
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.textColor};
`;

const AddBtn = styled.button``;

const DeleteBtn = styled.button`
  width: 60px;
`;
