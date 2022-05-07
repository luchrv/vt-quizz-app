import { Descriptions, Tag } from "antd";
import moment from "moment";
import {UserIF} from "../../interfaces/userIF";

const UserDescription = (prop: any) => {
  const user: UserIF = prop.user;
  const tag: string = user.status === 1 ? "Activo" : "Inactivo";
    const color: string = user.status === 1 ? "green" : "red";   
  return (
    <Descriptions
        bordered
        column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
    >
    <Descriptions.Item label="Usuario">{user.username}</Descriptions.Item>
    <Descriptions.Item label="Nombre">{user.fullname}</Descriptions.Item>
    <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
    <Descriptions.Item label="Creado">{moment(user.created_at).format("DD/MM/YYYY HH:mm a")}</Descriptions.Item>
    <Descriptions.Item label="Actualizado">{moment(user.updated_at).format("DD/MM/YYYY HH:mm a")}</Descriptions.Item>
    <Descriptions.Item label="Estatus"><Tag color={color}>{tag.toUpperCase()}</Tag></Descriptions.Item>
  </Descriptions>
  );
};

export default UserDescription;
