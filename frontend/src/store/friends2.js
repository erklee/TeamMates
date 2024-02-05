import friendReducer from "./friends";
import jwtFetch from "./jwt";

const RECEIVE_IN_REQS = "friends/RECEIVE_IN_REQS";
const RECEIVE_OUT_REQS = "friends/RECEIVE_OUT_REQS";
const RECEIVE_CONFIRMED = "friends/RECEIVE_CONFIRMED";

const ADD_IN_REQ = "friends/ADD_IN_REQ";
const ADD_IN_REQS = "friends/ADD_IN_REQS";
const ADD_OUT_REQ = "friends/ADD_OUT_REQ";
const ADD_OUT_REQS = "friends/ADD_OUT_REQS";
const ADD_CONFIRMED = "friends/ADD_CONFIRMED";

const REMOVE_IN_REQ = "friends/REMOVE_IN_REQ";
const REMOVE_IN_REQS = "friends/REMOVE_IN_REQS";
const REMOVE_OUT_REQ = "friends/REMOVE_OUT_REQ";
const REMOVE_OUT_REQS = "friends/REMOVE_OUT_REQS";
const REMOVE_ONE_CONFIRMED = "friends/REMOVE_ONE_CONFIRMED";
const REMOVE_SOME_CONFIRMED = "friends/REMOVE_SOME_CONFIRMED";
const REMOVE_ALL_CONFIRMED = "friends/REMOVE_ALL_CONFIRMED";

const initialState = {
    pendingIn: [],
    pendingOut: [],
    confirmed: []
}

const receiveInReqsAction = requestIds => ({
    type: RECEIVE_IN_REQS,
    requestIds
})

const receiveOutReqsAction = requestIds => ({
    type: RECEIVE_OUT_REQS,
    requestIds
})

const receiveConfirmedAction = friendIds => ({
    type: RECEIVE_CONFIRMED,
    friendIds
})

export const refreshFriendsState = () => async dispatch => {
    try {
        
        const youUserRes = await jwtFetch('api/users/current');
        const reqsFromYouRes = (await jwtFetch('api/users/requests'));

        const youUser = await youUserRes.json();
        const reqsFromYou = await reqsFromYouRes.json();

        dispatch(receiveInReqsAction(youUser.requestIds));
        dispatch(receiveOutReqsAction(reqsFromYou));
        dispatch(receiveConfirmedAction(youUser.friendIds));
    }
    catch(err) {
        throw(err);
    }

}

export default friendReducer = (state = initialState, action) => {
    switch(action.type) {
        case RECEIVE_IN_REQS:
            return { ...state,
                pendingIn: action.requestIds
            }
        case RECEIVE_OUT_REQS:
            return { ...state,
                pendingOut: action.requestIds
            }
        case RECEIVE_CONFIRMED:
            return { ...state,
                confirmed: action.friendIds
            }
        default:
            return state;
    }
}