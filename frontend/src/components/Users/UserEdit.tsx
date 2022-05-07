import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Spin,
  Switch,
  Tabs,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ResponseIF, { ResponseDataIF } from "../../interfaces/responseIF";
import { UserIF, UserShowIF } from "../../interfaces/userIF";
import { UsersShowSer, UsersUpdateSer } from "../../services/usersService";
import { isEmail, isPassword, isUsername } from "../../utils/validation";

const { Title } = Typography;
const { TabPane } = Tabs;

export default function UserEdit() {
  let routeParams = useParams();
  let navigate = useNavigate();

  interface FormFields {
    name: string;
    value: string;
  }

  interface EditFields {
    _id: string;
    username: string;
    fullname: string;
    email: string;
    old_password: string;
    new_password: string;
    new_password_confirm: string;
    status: boolean;
  }

  const [loading, setLoading] = useState<boolean>(false);
  const [fields, setFields] = useState<FormFields[]>([]);
  const [userStatus, setUserStatus] = useState<boolean>(false);

  const requestData = (): void => {
    setLoading(true);

    const params: UserShowIF = {
      id: routeParams.userId!,
    };

    UsersShowSer(params).then((res: ResponseIF<UserIF>) => {
      setLoading(false);

      if (!res.ok) {
        navigate("/users");
        return;
      }

      if (res.data?.status !== "success") {
        Modal.error({
          title: "Error al buscar el usuario",
          content:
            "Ha ocurrido un error al buscar el usuario, por favor intente nuevamente",
          onOk: () => {
            navigate("/users");
          },
        });
        return;
      }
      setFields([
        { name: "_id", value: res.data!.data!._id },
        { name: "email", value: res.data!.data!.email },
        { name: "fullname", value: res.data!.data!.fullname },
        { name: "username", value: res.data!.data!.username },
      ]);
      setUserStatus(res.data!.data!.status === 1);
    });
  };

  const onFinish = (values: EditFields) => {
    setLoading(true);
    if (!isUsername(values.username)) {
      Modal.error({
        title: "Usuario no valido",
        content: (
          <div>
            <p>Formato del usuario es incorrecto</p>
            <ul>
              <li>Debe tener 8 caracteres mínimo</li>
              <li>No puede contener espacios</li>
              <li>No puede contener caracteres especiales</li>
              <li>Solo se permiten letras y numeros</li>
            </ul>
          </div>
        ),
      });
      setLoading(false);
      return;
    }
    if (!isEmail(values.email)) {
      Modal.error({
        title: "Email no valido",
        content: "Formato del email es incorrecto",
      });
      setLoading(false);
      return;
    }

    if (
      values.old_password?.length > 0 ||
      values.new_password?.length > 0 ||
      values.new_password?.length > 0
    ) {
      if (values.old_password?.length === 0) {
        Modal.error({
          title: "Contraseña no valida",
          content: "La contraseña actual es requerida",
        });
        setLoading(false);
        return;
      }

      if (values.new_password !== values.new_password_confirm) {
        Modal.error({
          title: "Contraseña no coinciden",
          content: "Las contraseñas no coinciden",
        });
        setLoading(false);
        return;
      }

      if (
        !isPassword(values.new_password) ||
        !isPassword(values.old_password)
      ) {
        Modal.error({
          title: "Contraseña no valida",
          content: (
            <div>
              <p>Formato de la contraseña incorrecto</p>
              <ul>
                <li>Debe tener 8 caracteres mínimo</li>
                <li>Al menos una letra Mayúscula</li>
                <li>Al menos una letra Minúscula</li>
                <li>Al menos un número</li>
                <li>
                  Sólo se permiten letras, numero y los caracteres espciales ! @
                  # $ % ^ & * .
                </li>
              </ul>
            </div>
          ),
        });
        setLoading(false);
        return;
      }
    }

    UsersUpdateSer({
      id: values._id,
      username: values.username,
      fullname: values.fullname,
      email: values.email,
      old_password: values.old_password,
      new_password: values.new_password,
      new_password_confirm: values.new_password_confirm,
      status: userStatus ? 1 : 0,
    }).then((res: ResponseIF<ResponseDataIF<Boolean>>) => {
      setLoading(false);
      if (res.ok) {
        if (res.data?.data) {
          Modal.success({
            title: "Actualización exitosa",
            content: "Registro actualizado correctamente",
          });
          navigate("/users");
        } else {
          Modal.error({
            title: "Error",
            content: "No fue posible actualizar el registro",
          });
        }
      }
    });
  };

  useEffect(() => {
    if (
      routeParams.userId === undefined ||
      routeParams.userId === null ||
      routeParams.userId.trim().length === 0
    ) {
      navigate("/users");
    }

    requestData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Row>
      <Col xs={24} sm={20} md={18} lg={14} xl={12}>
        <Spin spinning={loading}>
          <Form
            name="login"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
            fields={fields}
          >
            <Title level={3} style={{ marginBottom: "25px" }}>
              Editar usuario
            </Title>
            <Tabs defaultActiveKey="1">
              <TabPane key="1" tab="Datos">
                <Form.Item
                  label="Usuario"
                  name="username"
                  rules={[
                    {
                      required: true,
                      message:
                        "Por favor ingrese el nombre de usuario de acceso!",
                    },
                  ]}
                >
                  <Input readOnly />
                </Form.Item>

                <Form.Item
                  label="Nombre completo"
                  name="fullname"
                  rules={[
                    {
                      required: true,
                      message:
                        "Por favor ingrese el nombre completo del usuario!",
                    },
                  ]}
                >
                  <Input autoFocus />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Por favor ingrese el correo electrónico!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item label="Estatus" name="status">
                  <Switch
                    checked={userStatus}
                    checkedChildren="ACTIVO"
                    unCheckedChildren="INACTIVO"
                    onClick={() => setUserStatus(!userStatus)}
                  />
                </Form.Item>
              </TabPane>

              <TabPane key="2" tab="Contraseña">
                <Form.Item
                  label="Contraseña anterior"
                  name="old_password"
                  rules={[
                    {
                      // required: true,
                      message: "Por favor ingrese la contraseña!",
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item
                  label="Contraseña nueva"
                  name="new_password"
                  rules={[
                    {
                      // required: true,
                      message: "Por favor ingrese la contraseña!",
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item
                  label="Repetir contraseña"
                  name="new_password_confirm"
                  rules={[
                    {
                      // required: true,
                      message: "Por favor repita la contraseña!",
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>
              </TabPane>
            </Tabs>

            <Form.Item
              name="_id"
              rules={[
                {
                  required: true,
                  message: "Identificador requerido!",
                },
              ]}
            >
              <Input style={{ display: "none" }} />
            </Form.Item>

            <Form.Item
              wrapperCol={{ span: 24 }}
              style={{ textAlign: "center" }}
            >
              <Space>
                <Link to="/users">
                  <Button htmlType="button" danger>
                    CANCELAR
                  </Button>
                </Link>
                <Button type="primary" htmlType="submit">
                  GUARDAR
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Spin>
      </Col>
    </Row>
  );
}
