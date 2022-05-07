import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
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
  ServiceIF,
  ServiceShowIF,
  ServiceUpdateIf,
} from "../../interfaces/serviceIF";
import {
  ServicesShowSer,
  ServicesUpdateSer,
} from "../../services/servicesService";

const { Title } = Typography;

export default function ServiceEdit() {
  let routeParams = useParams();
  let navigate = useNavigate();

  const [form] = Form.useForm();

  interface FormFields {
    name: string;
    value: string | number;
  }

  const [loading, setLoading] = useState<boolean>(false);
  const [fields, setFields] = useState<FormFields[]>([]);
  const [userStatus, setUserStatus] = useState<boolean>(false);

  const recalculate = (action: string): void => {
    let price: number = Number(form.getFieldValue("price"));
    let discount: number = Number(form.getFieldValue("discount"));
    let employees_percentage: number = Number(
      form.getFieldValue("employees_percentage")
    );
    let employees_payment: number = Number(
      form.getFieldValue("employees_payment")
    );

    if (price > 0) {
      if (discount > price) {
        discount = price;
        form.setFieldsValue({
          discount: discount,
        });
      }

      let total = price - discount;

      if (employees_payment > total) {
        employees_payment = total;
        form.setFieldsValue({
          employees_payment: employees_payment,
          employees_percentage: 100,
        });
        return;
      }

      if (employees_percentage > 0 && action === "price") {
        employees_payment = (employees_percentage * total) / 100;
        form.setFieldsValue({
          employees_payment: employees_payment,
        });
        return;
      } else if (employees_payment > 0 && action === "payment") {
        employees_percentage = (employees_payment * 100) / total;
        form.setFieldsValue({
          employees_percentage: employees_percentage,
        });
        return;
      }
    } else {
      form.setFieldsValue({
        discount: 0,
        employees_payment: 0,
        employees_percentage: 0,
      });
    }
  };

  const onChangePrice = () => {
    recalculate("price");
  };

  const onChangePayment = () => {
    recalculate("payment");
  };

  const requestData = (): void => {
    setLoading(true);

    const params: ServiceShowIF = {
      id: routeParams.userId!,
    };

    ServicesShowSer(params).then((res: ResponseIF<ServiceIF>) => {
      setLoading(false);

      if (!res.ok) {
        navigate("/services");
        return;
      }

      if (res.data?.status !== "success") {
        Modal.error({
          title: "Error al buscar el empleado",
          content:
            "Ha ocurrido un error al buscar el empleado, por favor intente nuevamente",
          onOk: () => {
            navigate("/services");
          },
        });
        return;
      }
      setFields([
        { name: "_id", value: res.data!.data!._id },
        { name: "code", value: res.data!.data!.code },
        { name: "service", value: res.data!.data!.service },
        { name: "price", value: res.data!.data!.price },
        { name: "discount", value: res.data!.data!.discount },
        {
          name: "employees_percentage",
          value: res.data!.data!.employees_percentage,
        },
        { name: "employees_payment", value: res.data!.data!.employees_payment },
      ]);
      setUserStatus(res.data!.data!.status === 1);
    });
  };

  const onFinish = (values: ServiceUpdateIf) => {
    setLoading(true);

    ServicesUpdateSer({
      _id: values._id,
      code: values.code,
      service: values.service,
      price: values.price,
      discount: values.discount,
      employees_percentage: values.employees_percentage,
      employees_payment: values.employees_payment,
      status: userStatus ? 1 : 0,
    }).then((res: ResponseIF<ResponseDataIF<Boolean>>) => {
      setLoading(false);
      if (res.ok) {
        if (res.data?.data) {
          Modal.success({
            title: "Actualización exitosa",
            content: "Registro actualizado correctamente",
          });
          navigate("/services");
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
      navigate("/services");
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
            onFinish={onFinish}
            autoComplete="off"
            fields={fields}
            form={form}
          >
            <Title level={3} style={{ marginBottom: "25px" }}>
              Editar empleado
            </Title>

            <Form.Item
              label="Código"
              name="code"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese el codigo del servicio!",
                },
              ]}
            >
              <Input autoFocus />
            </Form.Item>

            <Form.Item
              label="Nombre"
              name="service"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese el nombre del servicio!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Precio"
              name="price"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese el precio del servicio!",
                },
              ]}
            >
              <InputNumber min={0} addonAfter="$" onBlur={onChangePrice} controls={false}/>
            </Form.Item>

            <Form.Item label="Descuento" name="discount">
              <InputNumber min={0} addonAfter="$" onBlur={onChangePrice} controls={false}/>
            </Form.Item>

            <Form.Item
              label="Porcentaje de empleados"
              name="employees_percentage"
              rules={[
                {
                  required: true,
                  message:
                    "Por favor ingrese el porcentaje del servicio para el empleado!",
                },
              ]}
            >
              <InputNumber
                min={0}
                max={100}
                addonAfter="%"
                onBlur={onChangePrice}
                controls={false}
              />
            </Form.Item>

            <Form.Item
              label="Pago de empleados"
              name="employees_payment"
              rules={[
                {
                  required: true,
                  message:
                    "Por favor ingrese el pago del servicio para el empleado!",
                },
              ]}
            >
              <InputNumber min={0} addonAfter="$" onBlur={onChangePayment} controls={false} />
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
                <Link to="/services">
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
