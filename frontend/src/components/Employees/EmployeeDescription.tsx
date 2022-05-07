import { Descriptions, Tag } from "antd";
import moment from "moment";
import {EmployeeIF} from "../../interfaces/employeeIF";

const EmployeeDescription = (prop: any) => {
  const employee: EmployeeIF = prop.employee;
  const tag: string = employee.status === 1 ? "Activo" : "Inactivo";
    const color: string = employee.status === 1 ? "green" : "red";   
  return (
    <Descriptions
        bordered
        column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
    >
    <Descriptions.Item label="Identificación">{employee.identity}</Descriptions.Item>
    <Descriptions.Item label="Nombres">{employee.first_name}</Descriptions.Item>
    <Descriptions.Item label="Apellidos">{employee.last_name}</Descriptions.Item>
    <Descriptions.Item label="Cumpleaños">{moment(employee.birthday).format("DD/MM/YYYY")}</Descriptions.Item>
    <Descriptions.Item label="Dirección">{employee.address}</Descriptions.Item>
    <Descriptions.Item label="Email">{employee.email}</Descriptions.Item>
    <Descriptions.Item label="Teléfono">{employee.phone}</Descriptions.Item>
    <Descriptions.Item label="Cargo">{employee.work_position}</Descriptions.Item>
    <Descriptions.Item label="Creado">{moment(employee.created_at).format("DD/MM/YYYY HH:mm a")}</Descriptions.Item>
    <Descriptions.Item label="Actualizado">{moment(employee.updated_at).format("DD/MM/YYYY HH:mm a")}</Descriptions.Item>
    <Descriptions.Item label="Estatus"><Tag color={color}>{tag.toUpperCase()}</Tag></Descriptions.Item>
  </Descriptions>
  );
};

export default EmployeeDescription;
