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
  Switch,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ResponseIF, { ResponseDataIF } from "../../interfaces/responseIF";
import {
  EmployeeIF,
  EmployeeShowIF,
  EmployeeUpdateIf,
} from "../../interfaces/employeeIF";
import {
  EmployeesShowSer,
  EmployeesUpdateSer,
} from "../../services/employeesService";
import { isEmail } from "../../utils/validation";
import moment from "moment";

const { Title } = Typography;

export default function EmployeeEdit() {
  let routeParams = useParams();
  let navigate = useNavigate();

  interface FormFields {
    name: string;
    value: string | moment.Moment;
  }

  const [loading, setLoading] = useState<boolean>(false);
  const [fields, setFields] = useState<FormFields[]>([]);
  const [userStatus, setUserStatus] = useState<boolean>(false);
  const [birthday, setBirthday] = useState<string>(moment().format("YYYY-MM-DD"));

  const onChangeBirthday = (
    dateObj: moment.Moment | null,
    dateString: string
  ): void => {
    setBirthday(dateString);
  };

  const requestData = (): void => {
    setLoading(true);

    const params: EmployeeShowIF = {
      id: routeParams.userId!,
    };

    EmployeesShowSer(params).then((res: ResponseIF<EmployeeIF>) => {
      setLoading(false);

      if (!res.ok) {
        navigate("/employees");
        return;
      }

      if (res.data?.status !== "success") {
        Modal.error({
          title: "Error al buscar el empleado",
          content:
            "Ha ocurrido un error al buscar el empleado, por favor intente nuevamente",
          onOk: () => {
            navigate("/employees");
          },
        });
        return;
      }
      setFields([
        { name: "_id", value: res.data!.data!._id },
        { name: "identity", value: res.data!.data!.identity },
        { name: "first_name", value: res.data!.data!.first_name },
        { name: "last_name", value: res.data!.data!.last_name },
        { name: "email", value: res.data!.data!.email },
        { name: "phone", value: res.data!.data!.phone },
        { name: "address", value: res.data!.data!.address },
        { name: "birthday", value: moment(res.data!.data!.birthday).utc() },
        { name: "work_position", value: res.data!.data!.work_position },
      ]);
      setBirthday(moment(res.data!.data!.birthday).format("YYYY-MM-DD"));
      setUserStatus(res.data!.data!.status === 1);
    });
  };

  const onFinish = (values: EmployeeUpdateIf) => {
    setLoading(true);
    if (!isEmail(values.email)) {
      Modal.error({
        title: "Email no valido",
        content: "Formato del email es incorrecto",
      });
      setLoading(false);
      return;
    }

    EmployeesUpdateSer({
      _id: values._id,
      identity: values.identity,
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      phone: values.phone,
      address: values.address,
      birthday: birthday,
      work_position: values.work_position,
      status: userStatus ? 1 : 0,
    }).then((res: ResponseIF<ResponseDataIF<Boolean>>) => {
      setLoading(false);
      if (res.ok) {
        if (res.data?.data) {
          Modal.success({
            title: "Actualización exitosa",
            content: "Registro actualizado correctamente",
          });
          navigate("/employees");
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
      navigate("/employees");
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
              Editar empleado
            </Title>

            <Form.Item
              label="Identificación"
              name="identity"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese el identificador del empleado!",
                },
              ]}
            >
              <Input readOnly />
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
              <Input autoFocus />
            </Form.Item>

            <Form.Item
              label="Apellido"
              name="last_name"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese el apellido del empleado!",
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
              <Input autoFocus />
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
                style={{ width: "100%" }}
                disabledDate={(d) =>
                  !d ||
                  d.isAfter(moment().subtract(14, "years")) ||
                  d.isSameOrBefore(moment().subtract(80, "years"))
                }
              />
            </Form.Item>

            <Form.Item
              label="Dirección"
              name="address"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese la dirección del empleado!",
                },
              ]}
            >
              <Input autoFocus />
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
              <Input autoFocus />
            </Form.Item>

            <Form.Item label="Estatus" name="status">
              <Switch
                checked={userStatus}
                checkedChildren="ACTIVO"
                unCheckedChildren="INACTIVO"
                onClick={() => setUserStatus(!userStatus)}
              />
            </Form.Item>

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
}
