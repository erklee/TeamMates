import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchUsers } from "../../store/users";
import UserItem from "./UserItem/UserItem";


const UserIndexPage = () => {
    const dispatch = useDispatch();
    const users = useSelector(state => state.users.all)

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch])
    return (
        <div>
          <h1>Users</h1>
          <ul>
          {Object.values(users).map(user => (
                <UserItem key={user._id} user={user} />
            ))}
          </ul>
        </div>
      );
    };
    
    export default UserIndexPage;