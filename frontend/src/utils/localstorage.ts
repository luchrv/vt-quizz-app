import UserSessionIF from "../interfaces/userSessionIF";

export const setUserLS = (userSession: UserSessionIF): void => {
    localStorage.setItem('fullname', userSession.fullname);
    localStorage.setItem('token', userSession.token);
    localStorage.setItem('username', userSession.username);
}

export const getUserLS = (): UserSessionIF => {
    return {
        fullname: localStorage.getItem('fullname') || '',
        token: localStorage.getItem('token') || '',
        username: localStorage.getItem('username') || ''
    }
}

export const removeUserLS = (): void => {
    localStorage.removeItem('fullname');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
}