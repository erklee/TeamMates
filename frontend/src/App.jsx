import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { AuthRoute, ProtectedRoute } from './components/Routes/Routes';
import NavBar from './components/NavBar/NavBar';
import MainPage from './components/MainPage/MainPage';
import EventMap from './components/Map/Map';

import { getCurrentUser } from './store/session';

const Layout = () => {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <AuthRoute component={MainPage} />
      },
      {
        path: "events",
        element: <ProtectedRoute component={EventMap} />
      },
      // {
      //   path: "login",
      //   element: <AuthRoute component={LoginForm} />
      // },
      // {
      //   path: "signup",
      //   element: <AuthRoute component={SignupForm} />
      // },
    ],
  },
]);

function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCurrentUser()).finally(() => setLoaded(true));
  }, [dispatch]);
  
  return loaded && <RouterProvider router={router} />;
}

export default App;
