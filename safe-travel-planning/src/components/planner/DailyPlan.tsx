import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { IPlans } from './Planner';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
} from 'firebase/firestore';
import { db } from '../../../firebase';

const Wrapper = styled.div`
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

const List = styled.ul`
  padding: 1rem;
  margin-top: 2rem;
  border-radius: 5px;
`;

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  margin: 1rem 0;
  /* background-color: ${(props) => props.theme.bgColor}; */
  /* color: ${(props) => props.theme.textColor}; */
`;

const DeleteBtn = styled.button``;

interface IDailyProps {
  projectId: string;
  onResetView: () => void;
}

interface ITask {
  id: string;
  text: string;
  completed: boolean;
}

export default function DailyPlan({ projectId, onResetView }: IDailyProps) {
  const [plan, setPlan] = useState<IPlans | null>(null);
  const [task, setTask] = useState<string>('');
  const [tasks, setTasks] = useState<ITask[]>([]);

  useEffect(() => {
    const docRef = doc(db, 'plan', projectId);

    // onSnapshot으로 문서의 변경사항을 실시간으로 수신
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setPlan({
          title: doc.data().title,
          createdAt: doc.data().createdAt,
          userId: doc.data().userId,
          id: doc.id,
          description: doc.data().description,
          username: doc.data().username,
        });
      } else {
        console.log('No such document!');
      }
    });

    // 할일 목록 불러오기
    const tasksQuery = query(collection(docRef, 'tasks'));
    const unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
      const loadedTasks: ITask[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        text: doc.data().text,
        completed: doc.data().completed,
      }));
      setTasks(loadedTasks);
    });

    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      unsubscribe();
      unsubscribeTasks();
    };
  }, [projectId]);

  const addTask = async () => {
    if (task.trim() === '') return;

    const docRef = doc(db, 'plan', projectId);
    const tasksCol = collection(docRef, 'tasks');
    await addDoc(tasksCol, { text: task, completed: false });
    setTask('');
  };

  const deletePlan = async () => {
    const docRef = doc(db, 'plan', projectId);
    try {
      await deleteDoc(docRef);
      onResetView();
    } catch (e) {
      console.error('Error deleting document', e);
    }
  };

  const deleteTest = async (taskId: string) => {
    const taskDocRef = doc(db, 'plan', projectId, 'tasks', taskId);
    await deleteDoc(taskDocRef);
  };

  const formattedDate = plan?.createdAt
    ? new Date(plan?.createdAt).toLocaleDateString('ko-kr', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Invalid date';

  return (
    <Wrapper>
      <Header>
        <HeaderContainer>
          <Title>{plan?.title}</Title>
          <DeleteBtn onClick={deletePlan}>삭제</DeleteBtn>
        </HeaderContainer>
        <Year>{formattedDate}</Year>
        <Description>{plan?.description}</Description>
      </Header>
      <Todo>할일</Todo>
      <NewPlan>
        <Input
          type='text'
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <AddBtn onClick={addTask}>추가</AddBtn>
      </NewPlan>
      <List>
        {tasks.map((task) => (
          <ListItem key={task.id}>
            <span>{task.text}</span>
            <DeleteBtn onClick={() => deleteTest(task.id)}>삭제</DeleteBtn>
          </ListItem>
        ))}
      </List>
    </Wrapper>
  );
}
