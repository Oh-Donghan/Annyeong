import { useEffect, useState } from 'react';
import styled from 'styled-components';
import NewProject from './NewProject';
import { Unsubscribe } from 'firebase/auth';
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../../firebase';
import DailyPlan from './DailyPlan';
import { useRecoilValue } from 'recoil';
import { authState } from '../../store/atom';
import { useParams } from 'react-router-dom';

const PlanSection = styled.div`
  width: 90%;
  height: 600px;
`;

const Wrapper = styled.div`
  position: relative;
  height: 100%;
  color: ${(props) => props.theme.bgColor};
  background-color: ${(props) => props.theme.textColor};
  border: 3px solid ${(props) => props.theme.textColor};
  border-radius: 10px;
  overflow: hidden;
`;

const Overlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 36px;
  background: rgba(45, 45, 45, 0.647); /* 반투명 검정색 배경 */
  z-index: 999; /* 다른 요소들보다 앞에 배치 */
`;

const Title = styled.h1`
  color: ${(props) => props.theme.textColor};
  padding: 35px 0 0 25px;
  font-size: 25px;
`;

const Button = styled.button`
  background-color: ${(props) => props.theme.textColor};
  font-size: 15px;
  margin: 35px 0 35px 25px;
  padding: 10px;
  border-radius: 5px;
  font-weight: bold;
`;

const Sidebar = styled.div`
  position: absolute;
  width: 250px;
  height: 95%;
  bottom: 0;
  border-top-right-radius: 15px;
  background-color: ${(props) => props.theme.bgColor};
`;

const Main = styled.div`
  margin-left: 250px;
  width: calc(100% - 250px);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  ${Title} {
    color: ${(props) => props.theme.bgColor};
    font-weight: bold;
    padding: 0;
  }
  ${Button} {
    background-color: ${(props) => props.theme.bgColor};
    color: ${(props) => props.theme.textColor};
  }
`;

const List = styled.ul`
  list-style: none;
  padding: 20px;
`;

const ListItem = styled.li<{ $isSelected: boolean }>`
  padding: 15px 10px 5px;
  border-bottom: 1px solid #ccc;
  color: ${(props) => (props.$isSelected ? '#dda94b' : props.theme.textColor)};
  border-bottom: 1px solid
    ${(props) => (props.$isSelected ? '#dda94b' : '#ccc')};
  transition: all 0.2s ease-in-out;
  &:hover {
    border-bottom: 1px solid #dda94b;
    color: #dda94b;
    cursor: pointer;
  }
`;

export interface IPlans {
  title: string;
  createdAt: string;
  userId: string;
  id: string;
  description: string;
  username: string;
}

export default function Planner() {
  const [showNewPlan, setShowNewPlan] = useState<
    'newProject' | 'dailyPlan' | null
  >(null);
  const [selectedPlan, setSelectedPlan] = useState<IPlans | null>(null);
  const [plans, setPlans] = useState<IPlans[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const currentUser = useRecoilValue(authState);
  const {countryId} = useParams();

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    if (currentUser && countryId) {
      const countryDocRef = doc(db, 'users', currentUser.uid, 'countries', countryId);
      const plansQuery = query(collection(countryDocRef, 'plans'), orderBy('createdAt', 'desc'));

      unsubscribe = onSnapshot(plansQuery, (snapshot) => {
        const fetchedPlans = snapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          createdAt: doc.data().createdAt,
          userId: doc.data().userId,
          description: doc.data().description,
          username: doc.data().username,
        }));
        setPlans(fetchedPlans);
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [currentUser, countryId]);

  const onCancel = () => {
    setShowNewPlan(null);
    setSelectedPlan(null);
  };

  const onClickPlan = (project: IPlans) => {
    setSelectedPlan(project);
    setSelectedId(project.id);
    setShowNewPlan('dailyPlan');
  };

  const onClickNewPlan = () => {
    setShowNewPlan('newProject');
  };

  const resetView = () => {
    setShowNewPlan(null);
    setSelectedPlan(null);
  };

  return (
    <PlanSection>
      <Wrapper>
        {!currentUser && (
          <Overlay>
            <div>로그인 시 이용가능</div>
          </Overlay>
        )}
        <Sidebar>
          <Title>내 여행계획</Title>
          <Button onClick={onClickNewPlan}>계획 세우기</Button>
          <List>
            {plans.map((plan) => (
              <ListItem
                key={plan.id}
                onClick={() => onClickPlan(plan)}
                $isSelected={selectedId === plan.id}
              >
                {plan.title}
              </ListItem>
            ))}
          </List>
        </Sidebar>
        <Main>
          {showNewPlan === 'newProject' && <NewProject onCancel={onCancel} />}
          {showNewPlan === 'dailyPlan' && selectedPlan && (
            <DailyPlan projectId={selectedPlan.id} onResetView={resetView} />
          )}
          {showNewPlan === null && <Title>아직 계획이 없습니다.</Title>}
        </Main>
      </Wrapper>
    </PlanSection>
  );
}
