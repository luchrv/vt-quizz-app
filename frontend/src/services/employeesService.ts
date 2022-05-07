import { Fetcher } from "./fetcher";
import PaginateResponseIF, {
  PaginateRequestParamsIF,
} from "../interfaces/paginateIF";
import {
  EmployeeIF,
  EmployeeCreateIF,
  EmployeeShowIF,
  EmployeeUpdateIf,
  EmployeeGetAllIF,
} from "../interfaces/employeeIF";
import { ResponseDataIF } from "../interfaces/responseIF";

export const EmployeesPaginateSer = (params: PaginateRequestParamsIF) => {
  return Fetcher<PaginateResponseIF<EmployeeIF>>(
    "/api/employees/paginate",
    "POST",
    params
  );
};

export const EmployeesShowSer = (employeeID: EmployeeShowIF) => {
  return Fetcher<EmployeeIF>("/api/employees/show", "POST", employeeID);
};

export const EmployeesCreateSer = (employee: EmployeeCreateIF) => {
  return Fetcher<ResponseDataIF<Boolean>>(
    "/api/employees/create",
    "POST",
    employee
  );
};

export const EmployeesUpdateSer = (employee: EmployeeUpdateIf) => {
  return Fetcher<ResponseDataIF<Boolean>>(
    "/api/employees/update",
    "POST",
    employee
  );
};

export const EmployeesAllSer = (params: EmployeeGetAllIF) => {
  return Fetcher<[EmployeeIF]>("/api/employees/getall", "POST", params);
};
