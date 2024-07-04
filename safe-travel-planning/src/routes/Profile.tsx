import styled from 'styled-components';
import { auth, db, storage } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import React, { useCallback, useEffect, useState } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';

interface IPlans {
  id: string;
  countryId: string;
  createdAt: string;
  date: string;
  title: string;
  username: string;
}
export default function Profile() {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [plans, setPlans] = useState<IPlans[]>([]);
  const navigate = useNavigate();

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!user) return;
    if (files && files.length === 1) {
      const file = files[0];
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(result.ref);
      setAvatar(avatarUrl);
      await updateProfile(user, {
        photoURL: avatarUrl,
      });
    }
  };

  const fetchPlan = useCallback(async () => {
    const planQuery = query(
      collection(db, 'plans'),
      where('userId', '==', user?.uid),
      orderBy('countryId', 'desc'),
      orderBy('date', 'desc')
    );
    const snapshot = await getDocs(planQuery);
    const plans = snapshot.docs.map((doc) => {
      const { countryId, createdAt, date, title, username } = doc.data();
      return {
        id: doc.id,
        countryId,
        createdAt,
        date,
        title,
        username,
      };
    });
    setPlans(plans);
  }, [user?.uid]);

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  const onLogOut = async () => {
    const ok = confirm('로그아웃 하시겠습니까?');
    if (ok) {
      await auth.signOut();
      navigate('/');
    }
  };

  const onMovePlanner = (countryId: string) => {
    navigate(`/country/${countryId}/planner`);
  }

  return (
    <Wrapper>
      <AvatarUpload htmlFor='avatar'>
        {!avatar ? (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='currentColor'
            className='w-6 h-6'
          >
            <path
              fillRule='evenodd'
              d='M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z'
              clipRule='evenodd'
            />
          </svg>
        ) : (
          <AvatarImg src={avatar} />
        )}
      </AvatarUpload>
      <AvatarInput
        onChange={onAvatarChange}
        id='avatar'
        type='file'
        accept='image/*'
      />
      <Name>{user?.displayName ?? 'Anonymous'}</Name>
      <Email>{user?.email}</Email>
      <LogoutButton onClick={onLogOut}>로그아웃</LogoutButton>
      <PlanTitle>내가 작성한 일정</PlanTitle>
      <Plans>
        {plans.map((plan) => (
          <Plan key={plan.id} onClick={() => onMovePlanner(plan.countryId)}>
            <Title>{plan.title}</Title>
            <CountryName>{plan.countryId}</CountryName>
            <PlanDate>
              {plan.date
                ? new Date(plan.date).toLocaleDateString('ko-kr', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : 'Invalid date'}
            </PlanDate>
          </Plan>
        ))}
      </Plans>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 10px;
`;

const AvatarUpload = styled.label`
  width: 80px;
  height: 80px;
  overflow: hidden;
  margin-top: 50px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: #ccc;
  svg {
    width: 50px;
    height: 50px;
    /* color: #fff; */
  }
`;

const AvatarImg = styled.img`
  width: 100%;
`;

const AvatarInput = styled.input`
  display: none;
`;

const Name = styled.span`
  font-size: 22px;
`;

const Email = styled.span`
  font-size: 16px;
  font-weight: lighter;
`;

const LogoutButton = styled.div`
  padding:  6px 10px;
  border: 1px solid ${props => props.theme.textColor};
  border-radius: 5px;
  font-size: 15px;
  cursor: pointer;
`

const PlanTitle = styled.h3`
  margin-top: 50px;
  font-size: 20px;
`;

const Plans = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
`;

const Plan = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  gap: 10px;
  padding: 10px;
  border: 1px solid ${props => props.theme.textColor};
  border-radius: 4px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
  transition: border 0.3s ease-in-out;
  &:hover {
    border: 1px solid ${props => props.theme.pointColor}
  }
`;

const CountryName = styled.span`
  font-size: 16px;
`

const Title = styled.h3`
  font-size: 16px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const PlanDate = styled.span`
  font-size: 12px;
  font-weight: lighter;
`