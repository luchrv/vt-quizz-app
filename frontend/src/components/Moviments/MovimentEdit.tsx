import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Space,
  Spin,
  Select,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ResponseIF, { ResponseDataIF } from "../../interfaces/responseIF";
import {
  MovimentIF,
  MovimentShowIF,
  MovimentUpdateIf,
} from "../../interfaces/movimentIF";
import {
  MovimentsShowSer,
  MovimentsUpdateSer,
} from "../../services/movimentsService";
import moment from "moment";
import { EmployeesAllSer } from "../../services/employeesService";
import { EmployeeIF } from "../../interfaces/employeeIF";
import { ServicesAllSer } from "../../services/servicesService";
import { ServiceIF } from "../../interfaces/serviceIF";

const { Title } = Typography;
const { Option } = Select;

const objServices: Array<ServiceIF> = [];

export default function MovimentEdit() {
  let routeParams = useParams();
  let navigate = useNavigate();

  const [form] = Form.useForm();

  interface FormFields {
    name: string;
    value: string | number | moment.Moment;
  }

  const [loading, setLoading] = useState<boolean>(false);
  const [fields, setFields] = useState<FormFields[]>([]);
  const [userStatus, setUserStatus] = useState<boolean>(false);
  const [mtype, setMtype] = useState<string>("in");
  const [employees, setEmployees] = useState<Array<EmployeeIF>>([]);
  const [services, setServices] = useState<Array<ServiceIF>>([]);

  const requestData = (): void => {
    setLoading(true);

    const params: MovimentShowIF = {
      id: routeParams.userId!,
    };

    MovimentsShowSer(params).then((res: ResponseIF<MovimentIF>) => {
      setLoading(false);

      if (!res.ok) {
        navigate("/moviments");
        return;
      }

      if (res.data?.status !== "success") {
        Modal.error({
          title: "Error al buscar el empleado",
          content:
            "Ha ocurrido un error al buscar el empleado, por favor intente nuevamente",
          onOk: () => {
            navigate("/moviments");
          },
        });
        return;
      }
      setFields([
        { name: "_id", value: res.data!.data!._id },
        { name: "mdate_time", value: moment(res.data!.data!.mdate_time) },
        { name: "employee_id", value: res.data!.data!.employee_id },
        { name: "mtype", value: res.data!.data!.mtype },
        { name: "service_id", value: res.data!.data!.service_id },
        { name: "service_price", value: res.data!.data!.service_price ?? 0 },
        {
          name: "service_discount",
          value: res.data!.data!.service_discount ?? 0,
        },
        {
          name: "employee_percentage",
          value: res.data!.data!.employee_percentage ?? 0,
        },
        {
          name: "employee_payment",
          value: res.data!.data!.employee_payment ?? 0,
        },
        { name: "out_description", value: res.data!.data!.out_description },
        { name: "out_amount", value: res.data!.data!.out_amount ?? 0 },
      ]);
      setMtype(res.data!.data!.mtype);
      setUserStatus(res.data!.data!.status === 1);
    });
  };

  const onFinish = (values: MovimentUpdateIf) => {
    setLoading(true);
    const mdate: string = values.mdate_time;
    if (mdate.length <= 0) {
      Modal.error({
        title: "Fecha de nacimiento no valida",
        content: "La fecha de nacimiento no puede estar vacia",
      });
      setLoading(false);
      return;
    }

    MovimentsUpdateSer({
      _id: values._id,
      mdate_time: moment(values.mdate_time).format("YYYY-MM-DDTHH:mm:ssZ"),
      mtype: values.mtype,
      employee_id: values.employee_id,
      service_id: values.service_id,
      service_price: values.service_price,
      service_discount: values.service_discount,
      employee_percentage: values.employee_percentage,
      employee_payment: values.employee_payment,
      out_description: values.out_description,
      out_amount: values.out_amount,
      status: userStatus ? 1 : 0,
    }).then((res: ResponseIF<ResponseDataIF<Boolean>>) => {
      setLoading(false);
      if (res.ok) {
        if (res.data?.data) {
          Modal.success({
            title: "Actualización exitosa",
            content: "Registro actualizado correctamente",
          });
          navigate("/moviments");
        } else {
          Modal.error({
            title: "Error",
            content: "No fue posible actualizar el registro",
          });
        }
      }
    });
  };

  const requestEmployees = (): void => {
    setLoading(true);

    EmployeesAllSer({ filter_value: "" }).then(
      (res: ResponseIF<[EmployeeIF]>) => {
        setLoading(false);

        if (!res.ok) {
          navigate("/moviments");
          return;
        }

        if (res.data?.status !== "success") {
          Modal.error({
            title: "Error al buscar los empleados",
            content:
              "Ha ocurrido un error al buscar los empleados, por favor intente nuevamente",
            onOk: () => {
              navigate("/moviments");
            },
          });
          return;
        }
        setEmployees(res.data!.data!);
      }
    );
  };

  const requestServices = (): void => {
    setLoading(true);

    ServicesAllSer({ filter_value: "" }).then(
      (res: ResponseIF<[ServiceIF]>) => {
        setLoading(false);

        if (!res.ok) {
          navigate("/moviments");
          return;
        }

        if (res.data?.status !== "success") {
          Modal.error({
            title: "Error al buscar los empleados",
            content:
              "Ha ocurrido un error al buscar los empleados, por favor intente nuevamente",
            onOk: () => {
              navigate("/moviments");
            },
          });
          return;
        }
        objServices.push(...res.data!.data!);
        setServices(res.data!.data!);
      }
    );
  };

  const handlerMtype = (value: string): void => {
    setMtype(value);
  };

  const handlerService = (value: string): void => {
    let objSer = objServices.find((service) => service._id === value);
    form.setFieldsValue({
      service_price: objSer?.price ?? 0,
      service_discount: objSer?.discount ?? 0,
      employee_percentage: objSer?.employees_percentage ?? 0,
      employee_payment: objSer?.employees_payment ?? 0,
    });
  };

  const recalculate = (action: string): void => {
    let price: number = Number(form.getFieldValue("service_price"));
    let discount: number = Number(form.getFieldValue("service_discount"));
    let employee_percentage: number = Number(
      form.getFieldValue("employee_percentage")
    );
    let employee_payment: number = Number(
      form.getFieldValue("employee_payment")
    );

    if (price > 0) {
      if (discount > price) {
        discount = price;
        form.setFieldsValue({
          service_discount: discount,
        });
      }

      let total = price - discount;

      if (employee_payment > total) {
        employee_payment = total;
        form.setFieldsValue({
          employee_payment: employee_payment,
          employee_percentage: 100,
        });
        return;
      }

      if (employee_percentage > 0 && action === "price") {
        employee_payment = (employee_percentage * total) / 100;
        form.setFieldsValue({
          employee_payment: employee_payment,
        });
        return;
      } else if (employee_payment > 0 && action === "payment") {
        employee_percentage = (employee_payment * 100) / total;
        form.setFieldsValue({
          employee_percentage: employee_percentage,
        });
        return;
      }
    } else {
      form.setFieldsValue({
        service_discount: 0,
        employee_payment: 0,
        employee_percentage: 0,
      });
    }
  };

  const onChangePrice = () => {
    recalculate("price");
  };

  const onChangePayment = () => {
    recalculate("payment");
  };

  useEffect(() => {
    if (
      routeParams.userId === undefined ||
      routeParams.userId === null ||
      routeParams.userId.trim().length === 0
    ) {
      navigate("/moviments");
    }

    setLoading(true);
    requestEmployees();
    requestServices();

    requestData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Row>
      <Col xs={24} sm={20} md={18} lg={14} xl={12}>
        <Spin spinning={loading}>
          <Form
            name="MovimentEdit"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
            fields={fields}
            form={form}
          >
            <Title level={3} style={{ marginBottom: "25px" }}>
              Editar empleado
            </Title>

            <Form.Item
              label="Fecha"
              name="mdate_time"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese la fecha y hora del movimiento",
                },
              ]}
            >
              <DatePicker
                inputReadOnly
                allowClear={false}
                showTime
                style={{ width: "100%" }}
                disabledDate={(d) => !d || d.isAfter(moment())}
              />
            </Form.Item>

            <Form.Item
              label="Tipo"
              name="mtype"
              rules={[
                {
                  required: true,
                  message: "Por favor seleccione el tipo de movimiento!",
                },
              ]}
            >
              <Select onChange={handlerMtype} style={{ width: "100%" }}>
                <Option value="out">Egreso</Option>
                <Option value="in">Ingreso</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Empleado"
              name="employee_id"
              rules={[
                {
                  required: true,
                  message: "Por favor seleccione el empleado!",
                },
              ]}
            >
              <Select 
                showSearch 
                style={{ width: "100%" }}
                optionFilterProp="children"
                filterOption={ (input, option: any | undefined) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 }
              >
                {employees.map((employee: EmployeeIF) => (
                  <Option key={employee._id} value={employee._id}>
                    {employee.first_name} {employee.last_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <div style={{ display: mtype !== "in" ? "none" : "" }}>
              <Form.Item
                label="Servicio"
                name="service_id"
                rules={[
                  {
                    required: mtype === "in" ? true : false,
                    message: "Por favor seleccione el servicio!",
                  },
                ]}
              >
                <Select 
                  showSearch 
                  onChange={handlerService} 
                  style={{ width: "100%" }}
                  optionFilterProp="children"
                  filterOption={ (input, option: any | undefined) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 }
                >
                  {services.map((service: ServiceIF) => (
                    <Option key={service._id} value={service._id}>
                      {service.service}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Precio"
                name="service_price"
                rules={[
                  {
                    required: mtype === "in" ? true : false,
                    message: "Por favor ingrese el precio del servicio!",
                  },
                ]}
              >
                <InputNumber min={0} addonAfter="$" onBlur={onChangePrice} controls={false} />
              </Form.Item>

              <Form.Item
                label="Descuento"
                name="service_discount"
                rules={[
                  {
                    required: mtype === "in" ? true : false,
                    message:
                      "Por favor ingrese el monto de descuento del servicio!",
                  },
                ]}
              >
                <InputNumber min={0} addonAfter="$" onBlur={onChangePrice} controls={false} />
              </Form.Item>

              <Form.Item
                label="Porcentaje del empleado"
                name="employee_percentage"
                rules={[
                  {
                    required: mtype === "in" ? true : false,
                    message: "Por favor ingrese el porcentaje del empleado!",
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
                label="Pago del empleado"
                name="employee_payment"
                rules={[
                  {
                    required: mtype === "in" ? true : false,
                    message: "Por favor ingrese el monto a pagar al empleado!",
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  addonAfter="$"
                  onBlur={onChangePayment}
                  controls={false}
                />
              </Form.Item>
            </div>

            <div style={{ display: mtype === "in" ? "none" : "" }}>
              <Form.Item
                label="Motivo"
                name="out_description"
                rules={[
                  {
                    required: mtype !== "in" ? true : false,
                    message: "Por favor ingrese el motivo del egreso!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Cantidad"
                name="out_amount"
                rules={[
                  {
                    required: mtype !== "in" ? true : false,
                    message: "Por favor ingrese el monto!",
                  },
                ]}
              >
                <InputNumber min={0} />
              </Form.Item>
            </div>

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
                <Link to="/moviments">
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
