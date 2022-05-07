import { ReactElement, useEffect, useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Typography,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import ResponseIF, { ResponseDataIF } from "../../interfaces/responseIF";
import { MovimentsCreateSer } from "../../services/movimentsService";
import { MovimentCreateIF } from "../../interfaces/movimentIF";
import moment from "moment";
import { EmployeeIF } from "../../interfaces/employeeIF";
import { EmployeesAllSer } from "../../services/employeesService";
import { ServiceIF } from "../../interfaces/serviceIF";
import { ServicesAllSer } from "../../services/servicesService";

const { Title } = Typography;
const { Option } = Select;

const objServices: Array<ServiceIF> = [];

export const MovimentCreate = (): ReactElement => {
  const [loading, setLoading] = useState<boolean>(false);
  const [employees, setEmployees] = useState<Array<EmployeeIF>>([]);
  const [services, setServices] = useState<Array<ServiceIF>>([]);
  const [mtype, setMtype] = useState<string>("in");

  let navigate = useNavigate();

  const [form] = Form.useForm();

  const initialValues = [
    { name: "mdate_time", value: moment() },
    { name: "employee_id", value: "" },
    { name: "mtype", value: mtype },
    { name: "service_id", value: "" },
    { name: "service_price", value: 0 },
    { name: "service_discount", value: 0 },
    { name: "employee_percentage", value: 0 },
    { name: "employee_payment", value: 0 },
    { name: "out_description", value: "" },
    { name: "out_amount", value: 0 },
  ];

    const onFinish = (values: MovimentCreateIF) => {
    setLoading(true);

    const mdate: string = values.mdate_time;

    if (mdate.length <= 0) {
      Modal.error({
        title: "Fecha del movimiento no valida",
        content: "La fecha del movimiento no puede estar vacia",
      });
      setLoading(false);
      return;
    }

    MovimentsCreateSer({
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
    }).then((res: ResponseIF<ResponseDataIF<Boolean>>) => {
      setLoading(false);
      if (res.ok) {
        if (res.data?.data) {
          Modal.success({
            title: "Exelente",
            content: "Registro exitoso",
          });
          navigate("/moviments");
        } else {
          Modal.error({
            title: "Error",
            content: "El identificador del movimiento ya existente",
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
    setLoading(true);
    requestEmployees();
    requestServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Row>
      <Col xs={24} sm={20} md={18} lg={14} xl={12}>
        <Spin spinning={loading}>
          <Form
            name="MovimentCreate"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={onFinish}
            autoComplete="off"
            form={form}
            fields={initialValues}
          >
            <Title level={3} style={{ marginBottom: "25px" }}>
              Crear nuevo movimiento
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
              <Select 
                onChange={handlerMtype} 
                style={{ width: "100%" }}
              >
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
                    {`${employee.first_name} ${employee.last_name}`}
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
                <InputNumber min={0} addonAfter="$" onBlur={onChangePrice} controls={false}/>
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
                <InputNumber min={0} addonAfter="$" onBlur={onChangePrice} controls={false}/>
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
                <InputNumber min={0} addonAfter="$" onBlur={onChangePayment} controls={false} />
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
};

export default MovimentCreate;
