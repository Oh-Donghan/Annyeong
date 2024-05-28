import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { isDarkAtom } from '../../store/atom';
import { Outlet } from 'react-router-dom';

const Header = styled.header`
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  align-items: center;
  height: 40px;
  box-sizing: border-box;
  background-color: ${(props) => props.theme.textColor};
`;

const BtnWrapper = styled.div`
  position: relative;
  width: 52px;
  height: 28px;
  border-radius: 20px;
  padding: 0 2px;
  display: flex;
  align-items: center;
  cursor: pointer;
  background-color: ${(props) => props.theme.bgColor};
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1),
    inset 0 -1px 2px rgba(0, 0, 0, 0.1);
`;

interface IIndicator {
  $isDark: boolean;
}

const Indicator = styled.div<IIndicator>`
  position: absolute;
  width: 24px;
  height: 24px;
  background-color: #fff;
  border-radius: 50%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
  transform: ${(props) =>
    props.$isDark ? 'translateX(24px)' : 'translateX(0)'};
`;

const IconContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FaSun = styled(FontAwesomeIcon)`
  color: #dda94b;
  font-size: 20px;
`;
const FaMoon = styled(FontAwesomeIcon)`
  color: #333d79;
  font-size: 20px;
`;

const Log = styled.div`
  color: ${(props) => props.theme.bgColor};
  margin-right: 30px;
`;

export default function Layout() {
  const isDark = useRecoilValue(isDarkAtom);
  const setDarkAtom = useSetRecoilState(isDarkAtom);
  const toggleDarkAtom = () => setDarkAtom((prev) => !prev);

  return (
    <>
      <Header>
        <BtnWrapper onClick={toggleDarkAtom}>
          <Indicator $isDark={isDark}>
            <IconContainer>
              {isDark ? <FaMoon icon={faMoon} /> : <FaSun icon={faSun} />}
            </IconContainer>
          </Indicator>
        </BtnWrapper>
        <Log>LogIn</Log>
      </Header>
      <Outlet />
    </>
  );
}
