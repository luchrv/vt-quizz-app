import { Fetcher } from './fetcher';
import PaginateResponseIF, { PaginateRequestParamsIF } from '../interfaces/paginateIF';
import {UserIF, UserRegisterIF, UserShowIF, UserUpdateIf} from '../interfaces/userIF';
import { ResponseDataIF } from '../interfaces/responseIF';

export const UsersPaginateSer = (params: PaginateRequestParamsIF) => {
    return Fetcher<PaginateResponseIF<UserIF>>('/api/users/paginate', 'POST', params);
};

export const UsersShowSer = (userID: UserShowIF) => {
    return Fetcher<UserIF>('/api/users/show', 'POST', userID);
}

export const UsersCreateSer = (user: UserRegisterIF) => {
    return Fetcher<ResponseDataIF<Boolean>>('/api/users/create', 'POST', user);
}

export const UsersUpdateSer = (user: UserUpdateIf) => {
    return Fetcher<ResponseDataIF<Boolean>>('/api/users/update', 'POST', user);
}