import { ThemeProvider, createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';
import { darkTheme, lightTheme } from './theme';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useRecoilValue } from 'recoil';
import { isDarkAtom } from './store/atom';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/Router';
import { auth } from '../firebase';
import { useEffect } from 'react';

const GlobalStyle = createGlobalStyle`
  ${reset}
  * {
    box-sizing: border-box;
    /* outline: 1px dotted red; */
  }
  body {
    background-color: ${(props) => props.theme.bgColor};
    color: ${(props) => props.theme.textColor};
    height: 100%;
  }
  a {
    text-decoration: none;
    color: inherit;
  }
`;

function App() {
  const isDark = useRecoilValue(isDarkAtom);
  const init = async () => {
    await auth.authStateReady();
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <GlobalStyle />
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </ThemeProvider>
  );
}

export default App;
