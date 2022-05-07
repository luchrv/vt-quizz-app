import { Descriptions, Tag } from "antd";
import moment from "moment";
import {ServiceIF} from "../../interfaces/serviceIF";

const ServiceDescription = (prop: any) => {
  const service: ServiceIF = prop.service;
  const tag: string = service.status === 1 ? "Activo" : "Inactivo";
    const color: string = service.status === 1 ? "green" : "red";   
  return (
    <Descriptions
        bordered
        column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
    >
    <Descriptions.Item label="Código">{service.code}</Descriptions.Item>
    <Descriptions.Item label="Servicio">{service.service}</Descriptions.Item>
    <Descriptions.Item label="Precio">{service.price}</Descriptions.Item>
    <Descriptions.Item label="Descuento">{service.discount}</Descriptions.Item>
    <Descriptions.Item label="Porcentaje del empleado">{service.employees_percentage}</Descriptions.Item>
    <Descriptions.Item label="Pagar al empleado">{service.employees_payment}</Descriptions.Item>
    <Descriptions.Item label="Creado">{moment(service.created_at).format("DD/MM/YYYY HH:mm a")}</Descriptions.Item>
    <Descriptions.Item label="Actualizado">{moment(service.updated_at).format("DD/MM/YYYY HH:mm a")}</Descriptions.Item>
    <Descriptions.Item label="Estatus"><Tag color={color}>{tag.toUpperCase()}</Tag></Descriptions.Item>
  </Descriptions>
  );
};

export default ServiceDescription;
