import ResLoginIF from '../interfaces/resLoginIF';
import { Fetcher } from './fetcher';

export const AuthLogin = (identity: string, password: string) => {
    const body = {
        identity,
        password
    }
    return Fetcher<ResLoginIF>(`/auth/login`, 'POST', body);
}
