import { combineReducers } from "redux";
import {UserSessionReducer} from "./userSessionReducer";


const reducers = combineReducers({
    userSession: UserSessionReducer
})

export default reducers

export type RootState = ReturnType<typeof reducers>