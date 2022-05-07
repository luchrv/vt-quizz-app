import { ReactElement, useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Spin,
  Typography,
} from "antd";
import { isEmail } from "../../utils/validation";
import { Link, useNavigate } from "react-router-dom";
import ResponseIF, { ResponseDataIF } from "../../interfaces/responseIF";
import { EmployeesCreateSer } from "../../services/employeesService";
import { EmployeeCreateIF } from "../../interfaces/employeeIF";
import moment from "moment";

const { Title } = Typography;

export const EmployeeCreate = (): ReactElement => {
  const [loading, setLoading] = useState<boolean>(false);
  const [birthday, setBirthday] = useState<string>("");

  let navigate = useNavigate();

  const onChangeBirthday = (dateObj: moment.Moment | null, dateString: string): void => {
    setBirthday(dateString);
  };

  const onFinish = (values: EmployeeCreateIF) => {
    setLoading(true);
    if (!isEmail(values.email)) {
      Modal.error({
        title: "Email no valido",
        content: "Formato del email es incorrecto",
      });
      setLoading(false);
      return;
    }

    if (birthday.length <= 0) {
      Modal.error({
        title: "Fecha de nacimiento no valida",
        content: "La fecha de nacimiento no puede estar vacia",
      });
      setLoading(false);
      return;
    }

    EmployeesCreateSer({
      identity: values.identity,
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      phone: values.phone,
      birthday: birthday,
      address: values.address,
      work_position: values.work_position,
    }).then((res: ResponseIF<ResponseDataIF<Boolean>>) => {
      setLoading(false);
      if (res.ok) {
        if (res.data?.data) {
          Modal.success({
            title: "Exelente",
            content: "Registro exitoso",
          });
          navigate("/employees");
        } else {
          Modal.error({
            title: "Error",
            content: "El identificador del empleado ya existente",
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
              Crear nuevo empleado
            </Title>
            <Form.Item
              label="Identificación"
              name="identity"
              rules={[
                {
                  required: true,
                  message:
                    "Por favor ingrese el numero de identificación del empleado!",
                },
              ]}
            >
              <Input autoFocus />
            </Form.Item>

            <Form.Item
              label="Nombres"
              name="first_name"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese el nombre del empleado!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Apellidos"
              name="last_name"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese los apellidos del empleado!",
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
                  message:
                    "Por favor ingrese el correo electrónico del empleado!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Teléfono"
              name="phone"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese el teléfono del empleado!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Feha de nacimiento"
              name="birthday"
              rules={[
                {
                  required: true,
                  message:
                    "Por favor ingrese la fecha de nacimiento del empleado!",
                },
              ]}
            >
              <DatePicker 
                onChange={onChangeBirthday} 
                inputReadOnly 
                style={{width: "100%"}} 
                disabledDate={d => !d || d.isAfter(moment().subtract(14, 'years')) || d.isSameOrBefore(moment().subtract(80, 'years')) }
              />
            </Form.Item>

            <Form.Item
              label="Cargo"
              name="work_position"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese el cargo del empleado!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              wrapperCol={{ span: 24 }}
              style={{ textAlign: "center" }}
            >
              <Space>
                <Link to="/employees">
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
};

export default EmployeeCreate;
