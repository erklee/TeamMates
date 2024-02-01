import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { AuthRoute, ProtectedRoute } from './components/Routes/Routes';
import NavBar from './components/NavBar/NavBar';
import MainPage from './components/MainPage/MainPage';
import EventMap from './components/Map/Map';
import { getCurrentUser } from './store/session';
import Edit from './components/Events/EventEditForm';
import EventCreateForm from './components/Events/EventCreateForm';
import EventShowPage from './components/Events/EventShow';

const Layout = () => {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};

const eventLoader = async({request , params}) => {
  const res =await fetch(`/api/events/${params.eventId}`)
  if(res.ok){
    const data = await res.json()
    return data
  }
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <MainPage />
      },
      {
        path: "events",
        element: <EventMap />,
      },
      {
        path: "events/:eventId",
        element: <EventShowPage />
      },
      {
        path: `edit/:eventId`,
        loader: eventLoader,
        element: <ProtectedRoute component={Edit} />,
      },
      {
        path: 'new',
        element: <EventCreateForm />
      }
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
