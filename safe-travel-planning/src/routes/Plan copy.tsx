import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { styled } from 'styled-components';
import { CountryData, fetchData } from '../store/api';
import { useEffect, useState } from 'react';
import Planner from '../components/planner/Planner';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  margin: 30px 0;
  text-align: center;
  font-size: 30px;
`;

const Section = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 1280px;
`;

const GmapSection = styled.div`
  width: 90%;
  height: 500px;
  background-color: #059418;
`;

const PlanSection = styled.div`
  width: 90%;
  height: 600px;
`;

const SelectBtn = styled.div`
  display: flex;
  margin-bottom: 20px;
  height: 30px;
  gap: 15px;
  font-weight: bold;
`;

const MapBtn = styled.button`
  width: 120px;
  color: ${(props) => props.theme.bgColor};
  background-color: ${(props) => props.theme.textColor};
  border-radius: 5px;
`;

const PlanBtn = styled.button`
  width: 120px;
  color: ${(props) => props.theme.bgColor};
  background-color: ${(props) => props.theme.textColor};
  border-radius: 5px;
`;

type ISection = 'map' | 'plan';

export default function Plan() {
  const [title, setTitle] = useState('');
  const [section, setSection] = useState<ISection>('map');
  const params = useParams();
  const { data } = useQuery({
    queryKey: ['countryData'],
    queryFn: fetchData,
    staleTime: 5 * 60 * 1000, // 5분 동안 데이터가 신선한 상태로 유지
    gcTime: 10 * 60 * 1000, // 10분 동안 캐시 유지
  });

  useEffect(() => {
    if (data) {
      const filtered = data.find(
        (country: CountryData) =>
          country.country_eng_nm.toLowerCase() === params.id
      );
      if (filtered) {
        setTitle(filtered.country_nm);
      } else {
        console.log('none');
      }
    }
  }, [data, params.id]);

  return (
    <Wrapper>
      <Title>{title}</Title>
      <SelectBtn>
        <MapBtn onClick={() => setSection('map')}>지도 버튼</MapBtn>
        <PlanBtn onClick={() => setSection('plan')}>계획 버튼</PlanBtn>
      </SelectBtn>
      <Section>
        <GmapSection
          style={{ display: section === 'map' ? 'block' : 'none' }}
        ></GmapSection>
        <PlanSection style={{ display: section === 'plan' ? 'block' : 'none' }}>
          <Planner />
        </PlanSection>
      </Section>
    </Wrapper>
  );
}
