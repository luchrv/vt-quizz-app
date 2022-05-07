import UserSessionIF from "../../interfaces/userSessionIF";
import { UserSessionActionType } from "../action-types/userSessionActionType";
import { UserSessionAction } from "../actions/userSessionActions";

const initialState: UserSessionIF = {
  fullname: "",
  token: "",
  username: "",
};

export const UserSessionReducer = (
  state: UserSessionIF = initialState,
  action: UserSessionAction
) => {
  switch (action.type) {
    case UserSessionActionType.SET_USER_SESSION:
      return { ...state, ...action.payload };

    case UserSessionActionType.CLEAR_USER_SESSION:
      return { ...state, ...initialState };

    default:
      return state;
  }
};
