import { useEffect, useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Text = styled.span`
  font-size: 34px;
  font-weight: bold;
`;

export default function LoadingScreen() {
  const [dots, setDots] = useState('.');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((dots) => (dots.length < 3 ? dots + '.' : '.'));
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <Wrapper>
      <Text>Loading{dots}</Text>
    </Wrapper>
  );
}
