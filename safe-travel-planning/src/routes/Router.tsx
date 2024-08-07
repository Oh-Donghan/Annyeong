import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Home from './Home';
import Login from './Login';
import CreateAccount from './CreateAccount';
import Plan from './Plan';
import Planner from '../components/planner/Planner';
import ForgetPassword from './ForgetPassword';
import Profile from './Profile';
import Gmap from "../components/Gmap/Gmap";

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
        path: '/profile',
        element: <Profile />,
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
          },
        ],
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
      },
    ],
  },
]);
