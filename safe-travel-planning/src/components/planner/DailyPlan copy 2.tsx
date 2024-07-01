import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  DocumentData,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  startAt,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../../../firebase';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authState } from '../../store/atom';

interface IDailyProps {
  planId: string;
  onResetView: () => void;
  title: string;
  date: string;
  description: string;
}

interface ITask {
  taskId: string;
  text: string;
  completed: boolean;
  planId: string;
}

const PAGE_SIZE = 7;

export default function DailyPlan({
  planId,
  onResetView,
  title,
  description,
  date,
}: IDailyProps) {
  const [inputTask, setInputTask] = useState<string>('');
  const [tasks, setTasks] = useState<ITask[]>([]);
  const { countryId } = useParams();
  const user = useRecoilValue(authState);

  const [lastTaskVisible, setLastTaskVisible] = useState<DocumentData | null>(
    null
  );
  const [firstTaskVisible, setFirstTaskVisible] = useState<DocumentData | null>(
    null
  );
  const [allTasks, setAllTasks] = useState<ITask[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isNext, setIsNext] = useState(false);
  const [isPrev, setIsPrev] = useState(false);

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

  // Tasks 삭제
  const deleteTask = async (taskId: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      console.log('Task deleted');
    } catch (e) {
      console.log('Error deleting task: ', e);
    }
  };

  // Completed Check
  const toggleCompleted = async (taskId: string, isCompleted: boolean) => {
    if (!user || !countryId) return;

    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, { completed: !isCompleted });
  };

  // Tasks 불러오기
  useEffect(() => {
    if (!planId || !user) return;

    const fetchTotalCount = async () => {
      setIsLoading(true);
      const q = query(
        collection(db, 'tasks'),
        where('planId', '==', planId)
      );
      const snapshot = await getCountFromServer(q);
      const totalCount = snapshot.data().count;
      const totalPages = Math.ceil(totalCount / PAGE_SIZE);
      setTotalPages(totalPages);
      fetchTasks(1); // 초기 페이지 로드
    };

    fetchTotalCount();
  }, [planId, user]);

  const fetchTasks = async (page: number) => {
    setIsLoading(true);
    let q = query(
      collection(db, 'tasks'),
      where('planId', '==', planId),
      orderBy('createdAt', 'asc'),
      limit(PAGE_SIZE)
    );

    if (page > 1) {
      const prevPage = (page - 1) * PAGE_SIZE;
      const prevSnapshot = await getDocs(query(
        collection(db, 'tasks'),
        where('planId', '==', planId),
        orderBy('createdAt', 'asc'),
        limit(prevPage)
      ));
      const lastVisible = prevSnapshot.docs[prevSnapshot.docs.length - 1];
      q = query(
        collection(db, 'tasks'),
        where('planId', '==', planId),
        orderBy('createdAt', 'asc'),
        startAfter(lastVisible),
        limit(PAGE_SIZE)
      );
    }

    const snapshot = await getDocs(q);
    const tasks = snapshot.docs.map(doc => {
      const { text, completed, planId } = doc.data();
      return {
        taskId: doc.id,
        text,
        completed,
        planId,
      }
    });

    setTasks(tasks);
    setIsLoading(false);
    setCurrentPage(page);
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      fetchTasks(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      fetchTasks(currentPage - 1);
    }
  };

  if (isLoading) return <div>Loading...</div>;

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
      <ListContainer>
        <List>
          {tasks.map((task) => (
            <ListItem key={task.taskId}>
              <ItemWrapper>
                <ItemInput
                  type='checkbox'
                  checked={task.completed}
                  id={task.taskId}
                  onChange={() => toggleCompleted(task.taskId, task.completed)}
                />
                <span
                  style={{
                    textDecoration: task.completed ? 'line-through' : 'none',
                  }}
                >
                  {task.text}
                </span>
              </ItemWrapper>
              <DeleteBtn onClick={() => deleteTask(task.taskId)}>
                삭제
              </DeleteBtn>
            </ListItem>
          ))}
        </List>
        <ButtonContainer>
          <PrevButton onClick={handlePrev}>
            이전
          </PrevButton>
          <NextButton onClick={handleNext}>
            다음
          </NextButton>
        </ButtonContainer>
      </ListContainer>
    </Wrapper>
  );
}

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

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

const PrevButton = styled.button`
  &:disabled {
    opacity: 0.6;
  }
`;

const NextButton = styled.button`
  &:disabled {
    opacity: 0.6;
  }
`;

const List = styled.ul`
  padding: 1rem;
  margin-top: 1rem;
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

const ItemWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const ItemInput = styled.input``;
