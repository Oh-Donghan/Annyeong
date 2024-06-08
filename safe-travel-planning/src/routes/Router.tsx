import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Home from './Home';
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
