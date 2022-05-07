import { removeUserLS } from './localstorage';
import { removeUserSS } from './sessionstorage';

export const closeSession = ():void => {
    removeUserLS();
    removeUserSS();
    window.location.href = '/';
}
