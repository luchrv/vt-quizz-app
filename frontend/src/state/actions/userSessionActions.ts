import UserSessionIF from "../../interfaces/userSessionIF";
import { UserSessionActionType } from "../action-types/userSessionActionType"

interface SetUserSessionAction {
    type: UserSessionActionType.SET_USER_SESSION,
    payload: UserSessionIF
}

interface ClearUserSessionAction {
    type: UserSessionActionType.CLEAR_USER_SESSION,
}

export type UserSessionAction = SetUserSessionAction | ClearUserSessionAction;