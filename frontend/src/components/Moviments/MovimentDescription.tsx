import { Tag } from "antd";
import moment from "moment";
import {MovimentIF} from "../../interfaces/movimentIF";
import ModalDescription from "../ModalDescription";

const MovimentDescription = (prop: any) => {
  const moviment: MovimentIF = prop.moviment;
  const tag: string = moviment.status === 1 ? "Activo" : "Inactivo";
  const color: string = moviment.status === 1 ? "green" : "red";

  const type = moviment.mtype === 'in' ? "Ingreso" : "Egreso";
  const typeColor = moviment.mtype === 'in' ? "blue" : "red";

  const amount = moviment.in_amount ? moviment.in_amount : moviment.out_amount;

  const object: any[] = [
    {label: "Fecha", value: moment(moviment.mdate_time).format("DD/MM/YYYY")},
    {label: "Empleado", value: moviment.employee},
    {label: "Tipo", value: <Tag color={typeColor} key={type}>{type.toUpperCase()}</Tag>},
  ];
  if (moviment.mtype === 'in') {
    object.push({label: "Servicio", value: moviment.service});
    object.push({label: "Porcentaje del empleado", value: `${moviment.employee_percentage.toFixed(2)} %`});
    object.push({label: "Pago del empleado", value: moviment.employee_payment});
  } else {
    object.push({label: "Descripción", value: moviment.out_description});
  }
  object.push({label: "Monto", value: amount.toFixed(2)});
  object.push({label: "Status", value: <Tag color={color} key={tag}>{tag.toUpperCase()}</Tag>});
    
  return (
    <ModalDescription object={object} />
  );
};

export default MovimentDescription;
