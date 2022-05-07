import { ReactElement, useState} from "react";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Spin,
  Typography,
} from "antd";
import { isEmail, isPassword, isUsername } from "../../utils/validation";
import { Link, useNavigate } from "react-router-dom";
import ResponseIF, { ResponseDataIF } from "../../interfaces/responseIF";
import { UsersCreateSer } from "../../services/usersService";

const { Title } = Typography;

export const UserCreate = (): ReactElement => {
  const [loading, setLoading] = useState<boolean>(false);

  interface FormFields {
    fullname: string;
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
  }

  let navigate = useNavigate();

  const onFinish = (values: FormFields) => {
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

    if (values.password !== values.password_confirmation) {
      Modal.error({
        title: "Contraseña no coinciden",
        content: "Las contraseñas no coinciden",
      });
      setLoading(false);
      return;
    }

    if (!isPassword(values.password)) {
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
              <li>Sólo se permiten letras, numero y los caracteres espciales ! @ # $ % ^ & * .</li>
              </ul>
          </div>
        ),
      });
      setLoading(false);
      return;
    }

    UsersCreateSer({
      fullname: values.fullname,
      username: values.username,
      email: values.email,
      password: values.password,
    }).then((res: ResponseIF<ResponseDataIF<Boolean>>) => {
      setLoading(false);
      if (res.ok) {
        if (res.data?.data) {
          Modal.success({
            title: "Bienvenido",
            content: "Registro exitoso",
          });
          navigate("/users");
        } else {
          Modal.error({
            title: "Error",
            content: "El usuario o el email ya existen",
          });
        }
      }
    });
  };

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
          >
            <Title level={3} style={{ marginBottom: "25px" }}>
              Crear nuevo usuario
            </Title>
            <Form.Item
              label="Nombre completo"
              name="fullname"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese el nombre completo del usuario!",
                },
              ]}
            >
              <Input autoFocus />
            </Form.Item>

            <Form.Item
              label="Usuario"
              name="username"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese el nombre de usuario de acceso!",
                },
              ]}
            >
              <Input />
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

            <Form.Item
              label="Contraseña"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese la contraseña!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="Repetir contraseña"
              name="password_confirmation"
              rules={[
                {
                  required: true,
                  message: "Por favor repita la contraseña!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item wrapperCol={{span:24}} style={{ textAlign: "center" }}>
              <Space>
                <Link to="/users">
                  <Button htmlType="button" danger>CANCELAR</Button>
                </Link>
                <Button
                  type="primary"
                  htmlType="submit"
                >
                  GUARDAR
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Spin>
      </Col>
    </Row>
  );
};

export default UserCreate;