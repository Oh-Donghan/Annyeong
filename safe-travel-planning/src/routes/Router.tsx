import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Home from './Home';
import HomeVone from './HomeVone';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout />
    ),
    children: [
      {
        path: '',
        element: <Home />,
        // element: <HomeVone />,
      },
    ]
  }
])