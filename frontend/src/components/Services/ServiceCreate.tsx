import { ReactElement, useState } from "react";
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
  Typography,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import ResponseIF, { ResponseDataIF } from "../../interfaces/responseIF";
import { ServicesCreateSer } from "../../services/servicesService";
import { ServiceCreateIF } from "../../interfaces/serviceIF";

const { Title } = Typography;

export const ServiceCreate = (): ReactElement => {
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const [form] = Form.useForm();

  const initialValues = [
    { name: "code", value: "" },
    { name: "service", value: "" },
    { name: "price", value: 0 },
    { name: "discount", value: 0 },
    { name: "employees_percentage", value: 0 },
    { name: "employees_payment", value: 0 },
  ];

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

  const onFinish = (values: ServiceCreateIF) => {
    setLoading(true);

    ServicesCreateSer({
      code: values.code,
      service: values.service,
      price: values.price,
      discount: values.discount,
      employees_percentage: values.employees_percentage,
      employees_payment: values.employees_payment,
    }).then((res: ResponseIF<ResponseDataIF<Boolean>>) => {
      setLoading(false);
      if (res.ok) {
        if (res.data?.data) {
          Modal.success({
            title: "Exelente",
            content: "Registro exitoso",
          });
          navigate("/services");
        } else {
          Modal.error({
            title: "Error",
            content: "El identificador del servicio ya existente",
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
            onFinish={onFinish}
            autoComplete="off"
            fields={initialValues}
            form={form}
          >
            <Title level={3} style={{ marginBottom: "25px" }}>
              Crear nuevo servicio
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
              <InputNumber min={0} addonAfter="$" onBlur={onChangePrice} controls={false} />
            </Form.Item>

            <Form.Item label="Descuento" name="discount">
              <InputNumber min={0} addonAfter="$" onBlur={onChangePrice} controls={false} />
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
};

export default ServiceCreate;
