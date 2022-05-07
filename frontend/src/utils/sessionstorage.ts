import UserSessionIF from "../interfaces/userSessionIF";

export const setUserSS = (userSession: UserSessionIF): void => {
    sessionStorage.setItem('fullname', userSession.fullname);
    sessionStorage.setItem('token', userSession.token);
    sessionStorage.setItem('username', userSession.username);
}

export const getUserSS = (): UserSessionIF => {
    return {
        fullname: sessionStorage.getItem('fullname') || '',
        token: sessionStorage.getItem('token') || '',
        username: sessionStorage.getItem('username') || ''
    }
}

export const removeUserSS = (): void => {
    sessionStorage.removeItem('fullname');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
}