import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons/faMagnifyingGlass';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { fetchData, CountryData } from '../store/api';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../components/layout/LoadingScreen';
import Alert from '../components/layout/Alert';
import Warning from '../components/layout/Warning';

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [warning, setWarning] = useState<number | null>(null);
  const [filteredList, setFilteredList] = useState<CountryData[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { isLoading, data, error, isError } = useQuery({
    queryKey: ['countryData'],
    queryFn: fetchData,
    staleTime: 5 * 60 * 1000, // 5분 동안 데이터가 신선한 상태로 유지
    gcTime: 10 * 60 * 1000, // 10분 동안 캐시 유지
  });

  useEffect(() => {
    if (data) {
      const filtered = data.filter(
        (country: CountryData) =>
          country.country_nm.includes(inputValue) ||
          country.country_eng_nm
            .toLowerCase()
            .includes(inputValue.toLowerCase())
      );
      setFilteredList(filtered);
      inputRef.current?.focus();
    }
  }, [inputValue, data]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue) {
      const selectedCountry = data?.find(
        (country) => country?.country_nm === inputValue
      );

      if (selectedCountry) {
        const { alarm_lvl, country_eng_nm } = selectedCountry;
        if (alarm_lvl === 4) {
          alert('여행 금지 국가입니다');
          return;
        } else if (alarm_lvl === 3) {
          alert('여행 위험 국가입니다');
          navigate(
            `/country/${encodeURIComponent(country_eng_nm.toLowerCase())}`
          );
        } else {
          navigate(
            `/country/${encodeURIComponent(country_eng_nm.toLowerCase())}`
          );
        }
      }
    }
  };

  const onClick = (countryName: string) => {
    setInputValue(countryName);
    // setInputValue('');
    setFilteredList([]);
    // console.log(countryEngName);
    // if (countryAlarm >= 3) {
    //   alert('여행 위험 국가입니다');
    //   return
    // }
    // navigate(`/country/${encodeURIComponent(countryEngName.toLowerCase())}`);
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : isError ? (
        <div>Error: {error.message}</div>
      ) : (
        <Wrapper>
          <Title>안전한 여행 계획 - 안녕!</Title>
          <Form onSubmit={onSubmit}>
            <Input
              onChange={onChange}
              value={inputValue}
              ref={inputRef}
              placeholder='원하는 나라를 검색하세요.'
              required
            />
            <button type='submit'>
              <StyledFontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
            {inputValue && filteredList.length > 0 && (
              <Dropdown>
                {filteredList?.map((country, index) => (
                  <DropdownList
                    key={country.country_iso_alp2}
                    onClick={() => onClick(country.country_nm)}
                    onMouseEnter={() => setWarning(index)}
                    onMouseLeave={() => setWarning(null)}
                  >
                    {country.country_nm} ({country.country_eng_nm}){' '}
                    <AlertMark $alarmLvl={country.alarm_lvl}></AlertMark>
                    {warning === index && (
                      <Warning alarmLvl={country.alarm_lvl} />
                    )}
                  </DropdownList>
                ))}
              </Dropdown>
            )}
          </Form>
          <Alert />
        </Wrapper>
      )}
    </>
  );
}

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
`;

const Title = styled.h1`
  font-size: 48px;
  font-weight: bold;
  text-align: center;
  position: absolute;
  top: 170px;
  left: 50%;
  transform: translate(-50%, -20%);
  white-space: nowrap;
`;

const Input = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 44px;
  line-height: 30px;
  outline: 0;
  border: 0;
  font-size: 1.2em;
  border-radius: 20px;
  padding: 0 20px;
  background-color: ${(props) => props.theme.textColor};
  color: ${(props) => props.theme.bgColor};
  &::placeholder {
    color: ${(props) => props.theme.bgColor};
    opacity: 0.7;
  }
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  padding: 10px;
  width: 22px;
  height: 22px;
  position: absolute;
  top: 0;
  right: 0;
  border-radius: 50%;
  text-align: center;
  font-size: 1.2em;
  transition: all 0.5s;
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.textColor};
`;

const Form = styled.form`
  position: relative;
  top: 380px;
  left: 50%;
  transform: translateX(-50%);
  transition: all 0.5s;
  width: 600px;
  height: 50px;
  border-radius: 25px;
  border: 4px solid ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.textColor};
  color: ${(props) => props.theme.bgColor};
  padding: 5px;
  cursor: pointer;
`;

const Dropdown = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 52px;
  width: 100%;
  background-color: ${(props) => props.theme.textColor};
  color: ${(props) => props.theme.bgColor};
  border: 1px solid ${(props) => props.theme.textColor};
  border-radius: 8px;
  max-height: 300px;
  overflow-y: auto;
  /* 스크롤바 숨기기 */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

const DropdownList = styled.div`
  position: relative;
  padding: 12px 20px;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.bgColor};
    color: ${(props) => props.theme.textColor};
  }
`;

interface IAlarm {
  $alarmLvl: number | null;
}

const AlertMark = styled.span<IAlarm>`
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-left: 10px;
  border-radius: 50%;
  background-color: ${({ $alarmLvl }) => {
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
