import { Fetcher } from './fetcher';
import PaginateResponseIF, { PaginateRequestParamsIF } from '../interfaces/paginateIF';
import {MovimentIF, MovimentCreateIF, MovimentShowIF, MovimentUpdateIf, MovimentGetAllIF, MovimentsDashbordIF} from '../interfaces/movimentIF';
import { ResponseDataIF } from '../interfaces/responseIF';
import moment from 'moment';

export const MovimentsPaginateSer = (params: PaginateRequestParamsIF) => {
    return Fetcher<PaginateResponseIF<MovimentIF>>('/api/moviments/paginate', 'POST', params);
};

export const MovimentsShowSer = (movimentID: MovimentShowIF) => {
    return Fetcher<MovimentIF>('/api/moviments/show', 'POST', movimentID);
}

export const MovimentsCreateSer = (moviment: MovimentCreateIF) => {
    return Fetcher<ResponseDataIF<Boolean>>('/api/moviments/create', 'POST', moviment);
}

export const MovimentsUpdateSer = (moviment: MovimentUpdateIf) => {
    return Fetcher<ResponseDataIF<Boolean>>('/api/moviments/update', 'POST', moviment);
}

export const MovimentsAllSer = (params: MovimentGetAllIF) => {
  return Fetcher<[MovimentIF]>("/api/moviments/getall", "POST", params);
};

export const MovimentsDashboardSer = () => {
  return Fetcher<[MovimentsDashbordIF]>("/api/moviments/dashboard", "POST", {year: moment().year()});
};