import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons/faMagnifyingGlass';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import styled, { keyframes } from 'styled-components';
import { fetchData, CountryData } from '../store/api';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../components/layout/LoadingScreen';
import Alert from '../components/layout/Alert';

const Wrapper = styled.div`
  height: 95vh;
  width: 100%;
  position: relative;
`;

const Title = styled.h1`
  font-size: 3em;
  font-weight: bold;
  text-align: center;
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -20%);
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
  display: none;
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
`;

const glowBorder = keyframes`
  0%, 100% {
    box-shadow: 0 0 3px #dda94b;
  }
  50% {
    box-shadow: 0 0 9px #dda94b;
  }
`;

const Form = styled.form`
  position: relative;
  top: 35%;
  left: 50%;
  transform: translate(-50%, -35%);
  transition: all 0.5s;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  border: 4px solid ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.textColor};
  color: ${(props) => props.theme.bgColor};
  padding: 5px;
  animation: ${glowBorder} 1s infinite alternate;
  &:hover {
    width: 500px;
    cursor: pointer;
    animation: none;
    ${Input} {
      display: block;
    }
    ${StyledFontAwesomeIcon} {
      background-color: ${(props) => props.theme.bgColor};
      color: ${(props) => props.theme.textColor};
    }
  }
`;

const Dropdown = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 50px;
  width: 100%;
  background-color: ${(props) => props.theme.textColor};
  color: ${(props) => props.theme.bgColor};
  border: 1px solid #dda94b;
  border-radius: 8px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 10;

  /* 스크롤바 숨기기 */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

const DropdownList = styled.div`
  padding: 10px 20px;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.bgColor};
    color: ${(props) => props.theme.textColor};
  }
`;

export default function HomeVone() {
  const [inputValue, setInputValue] = useState('');
  const [filteredList, setFilteredList] = useState<CountryData[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  // const navigate = useNavigate();
  const { isLoading, data, error, isError } = useQuery({
    queryKey: ['countryData'],
    queryFn: fetchData,
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
    }
  }, [inputValue, data]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // if (inputValue) {
    //   const selectedCountry = data.find(
    //     (country) => country.country_nm === inputValue
    //   );
    //   if (selectedCountry) {
    //     navigate(`/country/${encodeURIComponent(selectedCountry.country_eng_nm.toLowerCase())}`);
    //   }
    // }
  };

  const onClick = (countryName: string, countryEngName: string) => {
    setInputValue(countryName);
    setFilteredList([]);
    console.log(countryEngName);
    // navigate(`/country/${encodeURIComponent(countryEngName.toLowerCase())}`);
  };

  const onMouseEnter = () => {
    inputRef.current?.focus();
  };

  const onMouseLeave = () => {
    // if (!inputValue || filteredList.length === 0) {
    //   setInputValue('');
    //   setFilteredList([]);
    // }
    setInputValue('');
    setFilteredList([]);
  };

  return (
    <div>
      {isLoading ? (
        <LoadingScreen />
      ) : isError ? (
        <div>Error: {error.message}</div>
      ) : (
        <Wrapper>
          <Title>안전한 여행 계획 - 안녕!</Title>
          <Form
            onSubmit={onSubmit}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            <Input
              onChange={onChange}
              value={inputValue}
              ref={inputRef}
              placeholder='원하는 나라를 검색하세요.'
              required
            />
            <StyledFontAwesomeIcon icon={faMagnifyingGlass} />
            {inputValue && filteredList.length > 0 && (
              <Dropdown>
                {filteredList?.map((country) => (
                  <DropdownList
                    key={country.country_iso_alp2}
                    onClick={() =>
                      onClick(country.country_nm, country.country_eng_nm)
                    }
                  >
                    {country.country_nm} ({country.country_eng_nm})
                  </DropdownList>
                ))}
              </Dropdown>
            )}
          </Form>
          {/* <Alert /> */}
        </Wrapper>
      )}
    </div>
  );
}
