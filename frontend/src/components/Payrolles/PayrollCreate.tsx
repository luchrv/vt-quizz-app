import { ReactElement, useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Modal,
  Row,
  Space,
  Spin,
  Typography,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import ResponseIF, { ResponseDataIF } from "../../interfaces/responseIF";
import { PayrollesCreateSer } from "../../services/payrollesService";
import { PayrollCreateIF } from "../../interfaces/payrollIF";
import moment from "moment";

const { Title } = Typography;

const { RangePicker } = DatePicker;

const dateFormat = "YYYY-MM-DD";

export const PayrollCreate = (): ReactElement => {
  const [loading, setLoading] = useState<boolean>(false);
  const [dates, setDates] = useState<[string, string]>([
    moment().startOf("month").format(dateFormat),
    moment().endOf("month").format(dateFormat),
  ]);

  let navigate = useNavigate();

  const onChangeRange = (valuesDates: any, formatString: [string, string]): void => {
    const from: string  = moment(valuesDates[0], "YYYY-MM").startOf("month").format(dateFormat);
    const to: string = moment(valuesDates[1], "YYYY-MM").endOf("month").format(dateFormat);
    setDates([from, to]);
  };

  const onFinish = (values: PayrollCreateIF) => {
    setLoading(true);

    PayrollesCreateSer({
      from_date: dates[0],
      to_date: dates[1],
    }).then((res: ResponseIF<ResponseDataIF<Boolean>>) => {
      setLoading(false);
      if (res.ok) {
        if (res.data!.data) {
          Modal.success({
            title: "Exelente",
            content: "Nómina creada con éxito",
          });
          navigate("/payrolles");
        } else {
          Modal.error({
            title: "Error",
            content: res.data!.message,
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
              Generar nueva nómina
            </Title>

            <Form.Item
              label="Rango de fecha"
              name="dates_range"
            >
              <RangePicker
                defaultValue={[
                  moment(moment().startOf("month"), dateFormat),
                  moment(moment().endOf("month"), dateFormat),
                ]}
                inputReadOnly
                allowClear={false}
                style={{ width: "100%" }}
                onChange={onChangeRange}
              />
            </Form.Item>

            <Form.Item
              wrapperCol={{ span: 24 }}
              style={{ textAlign: "center" }}
            >
              <Space>
                <Link to="/payrolles">
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

export default PayrollCreate;
