import { Dispatch } from "react";
import { UserSessionAction } from "../actions/userSessionActions";
import { UserSessionActionType } from "../action-types/userSessionActionType";
import UserSessionIF from "../../interfaces/userSessionIF";

export const setUserSession = ( userSession: UserSessionIF) => {
  return (dispatch: Dispatch<UserSessionAction>) => {
    dispatch({
      type: UserSessionActionType.SET_USER_SESSION,
      payload: userSession,
    });
  };
};

export const clearUserSession = () => {
  return (dispatch: Dispatch<UserSessionAction>) => {
    dispatch({
      type: UserSessionActionType.CLEAR_USER_SESSION,
    });
  };
};
