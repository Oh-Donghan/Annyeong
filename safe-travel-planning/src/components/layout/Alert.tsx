import { useQuery } from '@tanstack/react-query';
import styled, { keyframes } from 'styled-components';
import { fetchData } from '../../store/api';
import AlertTable from './AlertTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

const Wrapper = styled.div`
  position: absolute;
  top: 300px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const Info = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 7px;
`;

const Title = styled.h1`
  font-size: 16px;
`;

const InfoBtn = styled(FontAwesomeIcon)`
  font-size: 18px;
  cursor: pointer;
`;

const FlowBox = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
`;

const FlowWrap = styled.div`
  display: flex;
  align-items: center;
  width: 300px;
  white-space: nowrap;
`;

const flowing = keyframes`
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(-50%, 0, 0);
  }
`;

const Flow = styled.div`
  animation: ${flowing} 60s linear infinite;
`;

interface IAlarm {
  $alarmLvl: number | null;
}

const AlarmItem = styled.span<IAlarm>`
  color: ${({ $alarmLvl }) => {
    switch ($alarmLvl) {
      case null:
        return 'green';
      case 1:
        return '#5C7D9F';
      case 2:
        return '#D6B656 ';
      case 3:
        return '#ee413b ';
      case 4:
        return '#211f1fb4';
      default:
        return 'white';
    }
  }};
  font-size: 16px;
  display: inline-block;
  font-weight: 600;
  padding: 0 12px;
`;

export default function Alert() {
  const [mouseOver, setMouseOver] = useState(false);
  const { data } = useQuery({
    queryKey: ['countryData'],
    queryFn: fetchData,
    staleTime: 5 * 60 * 1000, // 5분 동안 데이터가 신선한 상태로 유지
    gcTime: 10 * 60 * 1000, // 10분 동안 캐시 유지
  });

  const onMouseEnter = () => {
    setMouseOver(true);
  };

  const onMouseLeave = () => {
    setMouseOver(false);
  };

  return (
    <Wrapper>
      <Container>
        <Info onMouseLeave={onMouseLeave}>
          <Title>여행 경보 지역</Title>
          <InfoBtn onMouseEnter={onMouseEnter} icon={faCircleInfo} />
          {mouseOver && <AlertTable />}
        </Info>

        <FlowBox>
          <FlowWrap>
            <Flow>
              {data &&
                data
                  .filter((item) => item.alarm_lvl >= 3)
                  .map((item) => (
                    <AlarmItem
                      key={item.country_iso_alp2}
                      $alarmLvl={item.alarm_lvl}
                    >
                      {item.country_nm} ({item.country_eng_nm})
                    </AlarmItem>
                  ))}
            </Flow>
          </FlowWrap>
        </FlowBox>
      </Container>
    </Wrapper>
  );
}
