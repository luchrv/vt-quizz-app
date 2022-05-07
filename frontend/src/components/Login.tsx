import { FC, useState } from "react";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Spin,
  Typography,
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { AuthLogin } from "../services/auth";
import { isPassword, isUsername } from "../utils/validation";

import { bindActionCreators } from "redux";
import { userSessionActionCreator } from "../state";
import { useDispatch } from "react-redux";

import { setUserLS } from "../utils/localstorage";
import { setUserSS } from "../utils/sessionstorage";
import UserSessionIF from "../interfaces/userSessionIF";
import { Footer } from "antd/lib/layout/layout";


const { Title } = Typography;

const Login: FC = () => {
  const dispatch = useDispatch();

  const { setUserSession } = bindActionCreators(
    userSessionActionCreator,
    dispatch
  );

  interface FormFields {
    username: string;
    password: string;
    remember: boolean;
  }
  
  const [stateSpin, setStateSpin] = useState({ loading: false });

  const [form] = Form.useForm();

  const year = new Date().getFullYear();
  


  const onFinish = (values: FormFields) => {
    if (!isUsername(values.username)) {
      Modal.error({
        title: "Usuario no valido",
        content: "Formato del usuario es incorrecto",
      });
      form.setFieldsValue({
        password: "",
      });
      return;
    }
    if (!isPassword(values.password)) {
      Modal.error({
        title: "Contraseña no valida",
        content: "Formato de la contraseña incorrecto",
      });
      form.setFieldsValue({
        password: "",
      });
      return;
    }

    setStateSpin({ loading: true });

    AuthLogin(values.username, values.password)
      .then((res) => {
        if (res.ok) {
          if (res.data!.status === "error") {
            Modal.error({
              title: "Error",
              content: res.data!.message,
            });
            form.setFieldsValue({
              password: "",
            });
            setStateSpin({ loading: false });
          }
          if (res.data!.status === "success") {
            Modal.success({
              title: "Bienvenido",
              content: res.data!.message,
            });
  
            const user:UserSessionIF = {
              fullname: res.data!.data!.user.fullname,
              token: res.data!.data!.token,
              username: res.data!.data!.user.username
            }
  
            if (values.remember) {
              setUserLS(user);
            } else {
              setUserSS(user);
            }
  
            setUserSession(user);
          }
        } else {
          setStateSpin({ loading: false });
        }
      })
      .catch((err) => {
        Modal.error({
          title: "Error",
          content: err,
        });
        form.setFieldsValue({
          password: "",
        });
        setStateSpin({ loading: false });
      });
  };

  return (
    <>
      <Row align="middle" justify="center" style={{ minHeight: "100vh" }}>
        <Col xs={20} sm={16} md={12} lg={8} xl={6}>
          <Spin spinning={stateSpin.loading}>
            <Form
              name="login"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              autoComplete="off"
              className="login-form"
              form={form}
            >
              <Title
                level={3}
                style={{ marginBottom: "25px", textAlign: "center" }}
              >
                Bienvenido
              </Title>
              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingrese su nombre de usuario!",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Usuario"
                  autoFocus
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingrese su contraseña!",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder="Contraseña"
                />
              </Form.Item>

              <Form.Item name="remember" valuePropName="checked">
                <Checkbox>Recordarme</Checkbox>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%", height: "40px" }}
                >
                  INGRESAR
                </Button>
              </Form.Item>
            </Form>
          </Spin>
        </Col>
      </Row>
      <Footer className="site-layout-footer">
        Copyright © {year} <Button href="https://luchrv.dev" target="_blank" type="link">{'<luchrv />'}</Button>
      </Footer>
    </>
  );
};

export default Login;
