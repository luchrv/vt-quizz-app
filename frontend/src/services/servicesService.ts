import { Fetcher } from "./fetcher";
import PaginateResponseIF, {
  PaginateRequestParamsIF,
} from "../interfaces/paginateIF";
import {
  ServiceIF,
  ServiceCreateIF,
  ServiceShowIF,
  ServiceUpdateIf,
  ServiceGetAllIF,
} from "../interfaces/serviceIF";
import { ResponseDataIF } from "../interfaces/responseIF";

export const ServicesPaginateSer = (params: PaginateRequestParamsIF) => {
  return Fetcher<PaginateResponseIF<ServiceIF>>(
    "/api/services/paginate",
    "POST",
    params
  );
};

export const ServicesShowSer = (serviceID: ServiceShowIF) => {
  return Fetcher<ServiceIF>("/api/services/show", "POST", serviceID);
};

export const ServicesCreateSer = (service: ServiceCreateIF) => {
  return Fetcher<ResponseDataIF<Boolean>>(
    "/api/services/create",
    "POST",
    service
  );
};

export const ServicesUpdateSer = (service: ServiceUpdateIf) => {
  return Fetcher<ResponseDataIF<Boolean>>(
    "/api/services/update",
    "POST",
    service
  );
};

export const ServicesAllSer = (params: ServiceGetAllIF) => {
  return Fetcher<[ServiceIF]>("/api/services/getall", "POST", params);
};
