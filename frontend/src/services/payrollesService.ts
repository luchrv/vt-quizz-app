import { Fetcher } from "./fetcher";
import PaginateResponseIF, {
  PaginateRequestParamsIF,
} from "../interfaces/paginateIF";
import { ResponseDataIF } from "../interfaces/responseIF";
import { PayrollCreateIF, PayrollIF, PayrollShowIF } from "../interfaces/payrollIF";

export const PayrollesPaginateSer = (params: PaginateRequestParamsIF) => {
  return Fetcher<PaginateResponseIF<PayrollIF>>(
    "/api/payrolles/paginate",
    "POST",
    params
  );
};

export const PayrollesShowSer = (payrollID: PayrollShowIF) => {
  return Fetcher<PayrollIF>("/api/payrolles/show", "POST", payrollID);
};

export const PayrollesCreateSer = (employee: PayrollCreateIF) => {
  return Fetcher<ResponseDataIF<Boolean>>(
    "/api/payrolles/create",
    "POST",
    employee
  );
};

export const PayrollesDisableSer = (payrollID: PayrollShowIF) => {
  return Fetcher<boolean>("/api/payrolles/disable", "POST", payrollID);
};
