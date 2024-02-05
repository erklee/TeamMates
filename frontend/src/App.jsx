import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { ProtectedRoute } from './components/Routes/Routes';
import NavBar from './components/NavBar/NavBar';
import MainPage from './components/MainPage/MainPage';
import EventMap from './components/Map/Map';
import { getCurrentUser } from './store/session';
import Edit from './components/Events/EventEditForm';
import EventCreateForm from './components/Events/EventCreateForm';
import ProfilePage from './components/Profile/ProfilePage';
import EventShowPage from "./components/Events/EventShow";
import UserIndexPage from './components/UserIndexPage/UserIndex';
import FriendsPage from './components/FriendsPage/FriendsPage';

const Layout = () => {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};

const eventLoader = async({ params}) => {
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
        path: `/events/edit/:eventId`,
        loader: eventLoader,
        element: <ProtectedRoute component={Edit} />,
      },
      {
        path: 'events/new',
        element: <ProtectedRoute component={EventCreateForm} />,
        // element: <EventCreateForm />
      },
      {
        path: 'profile/:id',
        element: <ProfilePage />
      },
      { path: "users", element: <UserIndexPage /> },
      {
        path: "friends", element: <FriendsPage />
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

// function App() {
//   const [loaded, setLoaded] = useState(false);
  
//   const dispatch = useDispatch();
//   useEffect(() => {
//     dispatch(getCurrentUser()).finally(() => setLoaded(true));
//   }, [dispatch]);
  
//   return loaded && <RouterProvider router={router} />;
// }

function App() {
  const [loaded, setLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // State to hold user data
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentUser())
      .then((user) => setCurrentUser(user))
      .finally(() => setLoaded(true));
  }, [dispatch]);

  return loaded && <RouterProvider router={router}>
    <Layout currentUser={currentUser} />
  </RouterProvider>;
}

export default App;
