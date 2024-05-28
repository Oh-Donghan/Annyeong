import styled from 'styled-components';

interface IAlarm {
  $alarmLvl: number | null;
}

const WarningText = styled.span<IAlarm>`
  display: inline-block;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  white-space: nowrap;
  padding: 5px 0 5px 15px;
  font-size: 12px;
  color: ${({ $alarmLvl }) => {
    switch ($alarmLvl) {
      case null:
        return 'green';
      case 1:
        return '#2e6398';
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
`;

const Warning: React.FC<{ alarmLvl: number | null }> = ({ alarmLvl }) => {
  let warning = '';

  switch (alarmLvl) {
    case null:
      warning = '안전';
      break;
    case 1:
      warning = '1단계 경보';
      break;
    case 2:
      warning = '2단계 경보';
      break;
    case 3:
      warning = '3단계 경보';
      break;
    case 4:
      warning = '여행 금지 지역';
      break;
  }

  return <WarningText $alarmLvl={alarmLvl}>{warning}</WarningText>;
};

export default Warning;
