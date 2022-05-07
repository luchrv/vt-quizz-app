import { Modal } from "antd";
import exportFromJSON from "export-from-json";
import moment from "moment";
import { MovimentIF } from "../../interfaces/movimentIF";
import ResponseIF from "../../interfaces/responseIF";
import { MovimentsAllSer } from "../../services/movimentsService";

export const movimentToExcel = (from: string, to: string, filter: string) => {

  interface MovimentsExcel {
    Fecha: string;
    Empleado: string;
    Tipo: string;
    Concepto: string;
    Monto: number;
    Estatus: string;
  }

  MovimentsAllSer({
    from,
    to,
    filter_value: filter,
  }).then((res: ResponseIF<[MovimentIF]>) => {
    if (!res.ok) {
      Modal.error({
        title: "Error al buscar los movimientos",
        content:
          "Ha ocurrido un error al buscar los movimientos, por favor intente nuevamente",
      });
      return;
    }

    if (res.data?.status !== "success") {
      Modal.error({
        title: "Error al buscar los movimientos",
        content:
          "Ha ocurrido un error al buscar los movimientos, por favor intente nuevamente",
      });
      return;
    }

    if (!res.data!.data!) {
      Modal.error({
        title: "No se encontraron movimientos",
        content: "No se encontraron movimientos para la fecha seleccionada",
      });
      return;
    }

    const data: MovimentsExcel[] = res.data!.data!.map((mov: MovimentIF) => {
        return {
            Fecha: moment(mov.mdate_time).format("DD/MM/YYYY HH:mm"),
            Empleado: mov.employee,
            Tipo: (mov.mtype === "in") ? "Ingreso" : "Egreso",
            Concepto: (mov.mtype === "in") ? mov.service : mov.out_description,
            Monto: (mov.mtype === "in") ? mov.service_price: -mov.out_amount,
            Estatus: (mov.status === 1) ? "Activo" : "Inactivo",
        };
    });

    const fileName = `Movimientos_${from}_${to}` + (filter ? `_${filter}` : "");
    const exportType = exportFromJSON.types.xls;
    exportFromJSON({ data, fileName, exportType });
  });
};
