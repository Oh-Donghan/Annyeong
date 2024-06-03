import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Home from './Home';
import HomeVone from './HomeVone';
import Login from './Login';
import CreateAccount from './CreateAccount';
import Plan from './Plan';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Home />,
        // element: <HomeVone />,
      },
      {
        path: '/country/:id',
        element: <Plan />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/create-account',
        element: <CreateAccount />,
      },
    ],
  },
]);
