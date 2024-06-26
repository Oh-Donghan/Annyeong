import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { IPlans } from './Planner';
import {
  DocumentData,
  addDoc,
  collection,
  deleteDoc,
  doc,
  endBefore,
  getDocs,
  limit,
  limitToLast,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../../../firebase';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authState } from '../../store/atom';

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
  const [inputTask, setInputTask] = useState<string>('');
  const [tasks, setTasks] = useState<ITask[]>([]);
  const { countryId } = useParams();
  const currentUser = useRecoilValue(authState);

  const [lastTaskVisible, setLastTaskVisible] = useState<DocumentData | null>(
    null
  );
  const [firstTaskVisible, setFirstTaskVisible] = useState<DocumentData | null>(
    null
  );
  const [isNext, setIsNext] = useState(true);
  const [isPrev, setIsPrev] = useState(false);

  // Task 불러오기
  const fetchTasks = (direction: 'next' | 'prev' | null = null) => {
    if (!currentUser || !countryId || !projectId) return;

    let taskQuery;

    const taskDocRef = collection(
      db,
      'users',
      currentUser.uid,
      'countries',
      countryId,
      'plans',
      projectId,
      'tasks'
    );

    if (direction === 'next' && lastTaskVisible) {
      taskQuery = query(
        taskDocRef,
        orderBy('createdAt'),
        startAfter(lastTaskVisible),
        limit(5)
      );
    } else if (direction === 'prev' && firstTaskVisible) {
      taskQuery = query(
        taskDocRef,
        orderBy('createdAt'),
        endBefore(firstTaskVisible),
        limitToLast(5)
      );
    } else {
      taskQuery = query(taskDocRef, orderBy('createdAt'), limit(5));
    }

    const unsubscribeTasks = onSnapshot(taskQuery, async (snapshot) => {
      if (!snapshot.empty) {
        const loadedTasks: ITask[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          text: doc.data().text,
          completed: doc.data().completed,
        }));
        setTasks(loadedTasks);
        setFirstTaskVisible(snapshot.docs[0]);
        setLastTaskVisible(snapshot.docs[snapshot.docs.length - 1]);

        if (direction === 'next') {
          setIsPrev(true);
          const nextTaskQuery = query(
            taskDocRef,
            orderBy('createdAt'),
            startAfter(snapshot.docs[snapshot.docs.length - 1]),
            limit(1)
          );
          const nextSnapshot = await getDocs(nextTaskQuery);
          setIsNext(!nextSnapshot.empty);
        } else if (direction === 'prev') {
          const prevTaskQuery = query(
            taskDocRef,
            orderBy('createdAt'),
            endBefore(snapshot.docs[0]),
            limitToLast(1)
          );
          const prevSnapshot = await getDocs(prevTaskQuery);
          setIsPrev(!prevSnapshot.empty);
          setIsNext(true);
        } else {
          const nextTaskQuery = query(
            taskDocRef,
            orderBy('createdAt'),
            startAfter(snapshot.docs[snapshot.docs.length - 1]),
            limit(1)
          );
          const prevTaskQuery = query(
            taskDocRef,
            orderBy('createdAt'),
            endBefore(snapshot.docs[0]),
            limitToLast(1)
          );
          const [nextSnapshot, prevSnapshot] = await Promise.all([
            getDocs(nextTaskQuery),
            getDocs(prevTaskQuery),
          ]);
          setIsNext(!nextSnapshot.empty);
          setIsPrev(!prevSnapshot.empty);
        }
      } else {
        setIsNext(false);
        setIsPrev(false);
      }
    });

    return unsubscribeTasks;
  };

  useEffect(() => {
    if (!currentUser || !countryId || !projectId) return;

    const docRef = doc(
      db,
      'users',
      currentUser.uid,
      'countries',
      countryId,
      'plans',
      projectId
    );

    // onSnapshot으로 문서의 변경사항을 실시간으로 수신
    const unsubscribePlan = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setPlan({
          id: doc.id,
          title: doc.data().title,
          createdAt: doc.data().createdAt,
          userId: doc.data().userId,
          description: doc.data().description,
          username: doc.data().username,
        });
      } else {
        console.log('No such document!');
      }
    });

    // 할일 목록 불러오기
    // const tasksQuery = query(
    //   collection(docRef, 'tasks'),
    //   orderBy('createdAt'),
    //   limit(5)
    // );
    // const unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
    //   const loadedTasks: ITask[] = snapshot.docs.map((doc) => ({
    //     id: doc.id,
    //     text: doc.data().text,
    //     completed: doc.data().completed,
    //   }));
    //   setTasks(loadedTasks);
    // });

    // 초기 할일 목록 불러오기
    const unsubscribeTasks = fetchTasks();

    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      unsubscribePlan();
      if (unsubscribeTasks) unsubscribeTasks();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, countryId, projectId]);

  const toggleCompleted = async (taskId: string, isCompleted: boolean) => {
    if (!currentUser || !countryId) return;

    const taskDocRef = doc(
      db,
      'users',
      currentUser.uid,
      'countries',
      countryId,
      'plans',
      projectId,
      'tasks',
      taskId
    );
    await updateDoc(taskDocRef, { completed: !isCompleted });
  };

  const deletePlan = async () => {
    if (!currentUser || !countryId) return;

    const docRef = doc(
      db,
      'users',
      currentUser.uid,
      'countries',
      countryId,
      'plans',
      projectId
    );
    try {
      await deleteDoc(docRef);
      onResetView();
    } catch (e) {
      console.error('Error deleting document', e);
    }
  };

  const addTask = async () => {
    if (inputTask.trim() === '' || !currentUser || !countryId) return;

    const tasksCol = collection(
      db,
      'users',
      currentUser.uid,
      'countries',
      countryId,
      'plans',
      projectId,
      'tasks'
    );
    await addDoc(tasksCol, {
      createdAt: Date.now(),
      text: inputTask,
      completed: false,
    });
    setInputTask('');
  };

  const deleteTask = async (taskId: string) => {
    // const ok = confirm('할일을 삭제 하시겠습니까?');
    // if (!ok || !currentUser || !countryId) return;
    if (!currentUser || !countryId) return;

    const taskDocRef = doc(
      db,
      'users',
      currentUser.uid,
      'countries',
      countryId,
      'plans',
      projectId,
      'tasks',
      taskId
    );
    await deleteDoc(taskDocRef);
    if (tasks.length === 1 && isPrev) {
      fetchTasks('prev');
    } else if (tasks.length === 1 && !isPrev) {
      fetchTasks(null);
    } else {
      fetchTasks
    }
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
          value={inputTask}
          onChange={(e) => setInputTask(e.target.value)}
        />
        <AddBtn onClick={addTask}>추가</AddBtn>
      </NewPlan>
      <ListContainer>
        <List>
          {tasks.map((task) => (
            <ListItem key={task.id}>
              <ItemWrapper>
                <ItemInput
                  type='checkbox'
                  checked={task.completed}
                  onChange={() => toggleCompleted(task.id, task.completed)}
                />
                <span
                  style={{
                    textDecoration: task.completed ? 'line-through' : 'none',
                  }}
                >
                  {task.text}
                </span>
              </ItemWrapper>
              <DeleteBtn onClick={() => deleteTask(task.id)}>삭제</DeleteBtn>
            </ListItem>
          ))}
        </List>
        <ButtonContainer>
          <PrevButton onClick={() => fetchTasks('prev')} disabled={!isPrev}>
            이전
          </PrevButton>
          <NextButton onClick={() => fetchTasks('next')} disabled={!isNext}>
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

const PrevButton = styled.button``;

const NextButton = styled.button``;

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
