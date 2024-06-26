import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Home from './Home';
import Login from './Login';
import CreateAccount from './CreateAccount';
import Plan from './Plan';
import Gmap from '../components/Gmap/Gmap';
import Planner from '../components/planner/Planner';
import ForgetPassword from './ForgetPassword';

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
        path: '/country/:countryId',
        element: <Plan />,
        children: [
          {
            path: 'map',
            element: <Gmap />,
          },
          {
            path: 'planner',
            element: <Planner />,
          }
        ]
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/create-account',
        element: <CreateAccount />,
      },
      {
        path: '/forget-password',
        element: <ForgetPassword />,
      }
    ],
  },
]);
