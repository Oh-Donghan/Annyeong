import { useQuery } from '@tanstack/react-query';
import {
  Link,
  Outlet,
  useMatch,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { styled } from 'styled-components';
import { CountryData, fetchData } from '../store/api';
import { useEffect, useState } from 'react';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  margin: 30px 0 20px;
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

const ButtonSection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 15px 0;
  gap: 10px;
`;

const SectionButton = styled.span<{ $isActive: boolean }>`
  width: 120px;
  /* padding: 8px 0; */
  text-align: center;
  font-weight: bold;
  color: ${(props) =>
    props.$isActive ? props.theme.pointColor : props.theme.bgColor};
  /* color: ${props => props.theme.bgColor}; */
  background-color: ${(props) => props.theme.textColor};
  border-radius: 5px;
  a {
    display: block;
    padding: 8px 16px;
    /* opacity: ${props => props.$isActive ? 1 : 0.7}; */
  }
`;

export default function Plan() {
  const [title, setTitle] = useState('');
  const { countryId } = useParams();
  const mapMatch = useMatch('/country/:id/map');
  const planMatch = useMatch('/country/:id/planner');
  const navigate = useNavigate();
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
          country.country_eng_nm.toLowerCase() === countryId
      );
      if (filtered) {
        setTitle(filtered.country_nm);
      } else {
        console.log('none');
      }
    }
  }, [data, countryId]);

  // 첫 렌더링 시 지도 페이지로 리디렉션
  useEffect(() => {
    if (!mapMatch && !planMatch) {
      navigate(`/country/${countryId}/map`);
    }
  }, [countryId, mapMatch, planMatch, navigate]);

  return (
    <Wrapper>
      <Title>{title}</Title>
      <ButtonSection>
        <SectionButton $isActive={mapMatch !== null}>
          <Link to={`/country/${countryId}/map`}>지도 버튼</Link>
        </SectionButton>
        <SectionButton $isActive={planMatch !== null}>
          <Link to={`/country/${countryId}/planner`}>계획 버튼</Link>
        </SectionButton>
      </ButtonSection>
      <Section>
        <Outlet context={{ countryId }} />
      </Section>
    </Wrapper>
  );
}
