import { createBrowserRouter } from 'react-router-dom';
import { Private } from './routes/private';

import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Admin } from './pages/Admin'

import { Layout } from './components/layout'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/admin',
        element: <Private><Admin /></Private>
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
])

export { router };