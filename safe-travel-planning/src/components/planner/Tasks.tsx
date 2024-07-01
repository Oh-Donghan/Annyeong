import { collection, deleteDoc, doc, getCountFromServer, getDocs, limit, orderBy, query, startAfter, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { db } from "../../../firebase";
import { useRecoilValue } from "recoil";
import { authState } from "../../store/atom";

interface ITask {
  taskId: string;
  text: string;
  completed: boolean;
  planId: string;
}

interface IProps {
  planId: string;
  countryId: string | undefined;
}

const PAGE_SIZE = 7;
export default function Tasks({ planId, countryId }: IProps) {
  const user = useRecoilValue(authState);
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  // const [isLoading, setIsLoading] = useState(false);

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
      // setIsLoading(true);
      const q = query(collection(db, 'tasks'), where('planId', '==', planId));
      const snapshot = await getCountFromServer(q);
      const totalCount = snapshot.data().count;
      const totalPages = Math.ceil(totalCount / PAGE_SIZE);
      setTotalPages(totalPages);
      fetchTasks(1); // 초기 페이지 로드
    };

    fetchTotalCount();
  }, [planId, user]);

  const fetchTasks = async (page: number) => {
    // setIsLoading(true);
    let q = query(
      collection(db, 'tasks'),
      where('planId', '==', planId),
      orderBy('createdAt', 'asc'),
      limit(PAGE_SIZE * page)
    );

    if (page > 1) {
      const prevPage = (page - 1) * PAGE_SIZE;
      const prevSnapshot = await getDocs(
        query(
          collection(db, 'tasks'),
          where('planId', '==', planId),
          orderBy('createdAt', 'asc'),
          limit(prevPage)
        )
      );
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
    const tasks = snapshot.docs.map((doc) => {
      const { text, completed, planId } = doc.data();
      return {
        taskId: doc.id,
        text,
        completed,
        planId,
      };
    });

    setTasks(tasks);
    // setIsLoading(false);
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

  // if (isLoading) return <div>Loading...</div>;

  return (
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
            <DeleteBtn onClick={() => deleteTask(task.taskId)}>삭제</DeleteBtn>
          </ListItem>
        ))}
      </List>
      <ButtonContainer>
        <PrevButton onClick={handlePrev}>이전</PrevButton>
        <NextButton onClick={handleNext}>다음</NextButton>
      </ButtonContainer>
    </ListContainer>
  );
}

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ButtonContainer = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 10px;
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
`;

const ItemWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const ItemInput = styled.input``;

const DeleteBtn = styled.button``;
