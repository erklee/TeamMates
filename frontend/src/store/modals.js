const SHOW_MODAL = 'modal/showModal';
const HIDE_MODAL = 'modal/hideModal';

export const showModal = (modalType) => ({
  type: SHOW_MODAL,
  modalType,
});

export const hideModal = (modalType) => ({
  type: HIDE_MODAL,
  modalType,
});


// function modalsReducer(state = {}, action) {
//   let newState = {...state};
//   switch (action.type) {
//   case SHOW_MODAL: {
//     newState[action.modalType] = action.modalType;
//     return newState;
//   }
//   case HIDE_MODAL:
//     // newState[action.modalType] = false;
//     newState = {};
//     return newState;
//   default:
//     return state;
//   }
// }

const modalsReducer = (state = {}, action) => {
  switch (action.type) {
  case SHOW_MODAL:
    return { ...state, [action.modalType]: true };
  case HIDE_MODAL:
    return {};
  default:
    return state;
  }
};


export default modalsReducer;