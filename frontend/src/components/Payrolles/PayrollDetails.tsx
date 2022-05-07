import { Alert, Button, Col, Descriptions, Modal, Row, Space, Spin } from "antd";
import moment from "moment";
import { FC, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PayrollIF, PayrollShowIF } from "../../interfaces/payrollIF";
import ResponseIF from "../../interfaces/responseIF";
import { PayrollesDisableSer, PayrollesShowSer } from "../../services/payrollesService";
import PayrollDetailsPaysheets from "./PayrollDetailsPaysheets";

const PayrollDetails: FC = () => {
  let routeParams = useParams();
  let navigate = useNavigate();

  const initPayrolles: PayrollIF = {
    _id: "",
    from_date: "",
    to_date: "",
    in_amount: 0,
    out_amount: 0,
    total: 0,
    pay_sheets: [],
    status: 1,
    created_at: "",
    updated_at: "",
  };

  const [payrolles, setPayrolles] = useState<PayrollIF>(initPayrolles);

  const [loading, setLoading] = useState<boolean>(true);

  const requestData = (): void => {
    setLoading(true);

    const params: PayrollShowIF = {
      id: routeParams.payrollId!,
    };

    PayrollesShowSer(params).then((res: ResponseIF<PayrollIF>) => {
      setLoading(false);

      if (!res.ok) {
        navigate("/payrolles");
        return;
      }

      if (res.data?.status !== "success") {
        Modal.error({
          title: "Error al buscar la nómina",
          content:
            "Ha ocurrido un error al buscar la nómina, por favor intente nuevamente",
          onOk: () => {
            navigate("/payrolles");
          },
        });
        return;
      }
      setPayrolles(res.data!.data!);
    });
  };

  const requestDelete = (): void => {
    setLoading(true);

    const params: PayrollShowIF = {
      id: routeParams.payrollId!,
    };

    PayrollesDisableSer(params).then((res: ResponseIF<boolean>) => {
      setLoading(false);

      if (!res.ok) {
        navigate("/payrolles");
        return;
      }

      if (res.data?.status !== "success") {
        Modal.error({
          title: "Error al deshabilitar la nómina",
          content:
            "Ha ocurrido un error al deshabilitar la nómina, por favor intente nuevamente",
          onOk: () => {
            navigate("/payrolles");
          },
        });
        return;
      }
      Modal.success({
        title: "Nómina deshabilitada",
        content: "La nómina ha sido deshabilitada correctamente",
        onOk: () => {
          navigate("/payrolles");
        }
      });
    });
  };

  const deletePayroll = (): void => {
    setLoading(true);
    Modal.confirm({
      title: "¿Estás seguro?",
      content:
        "No podrá habilitar nuevamente esta nómina, pero podrá generar otra con el mismo rango de fecha. ¿Estás seguro que deseas eliminar la nómina?",
      okText: "Si",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        setLoading(false);
        requestDelete();
      },
      onCancel: () => {
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    requestData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {payrolles.status === 0 && (
        <Alert
          message="Registro deshabilitado"
          description="Esta nómina fue deshabilitada por un administrador, no es válida para realizar pagos." 
          type="warning"
          showIcon
        />
      )}
      <Row style={{ marginBottom: "20px" }}>
        <Col span={24}>
          <Spin spinning={loading}>
            <Space direction="vertical" size={20} style={{ width: "100%" }}>
              <Descriptions
                bordered
                size="small"
                column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
                title="Nómina"
              >
                <Descriptions.Item
                  label="Desde"
                  labelStyle={{ width: "25%" }}
                  contentStyle={{ width: "25%" }}
                >
                  {moment(payrolles.from_date).utc().format("YYYY-MM-DD")}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Hasta"
                  labelStyle={{ width: "25%" }}
                  contentStyle={{ width: "25%" }}
                >
                  {moment(payrolles.to_date).utc().format("YYYY-MM-DD")}
                </Descriptions.Item>
              </Descriptions>

              <PayrollDetailsPaysheets paysheets={payrolles.pay_sheets} />

              <Descriptions
                bordered
                size="small"
                column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
              >
                <Descriptions.Item
                  labelStyle={{ width: "25%" }}
                  contentStyle={{ textAlign: "right", width: "25%" }}
                  label="Ingresos"
                >
                  {payrolles.in_amount?.toFixed(2)}
                </Descriptions.Item>
                <Descriptions.Item
                  labelStyle={{ width: "25%" }}
                  contentStyle={{
                    textAlign: "right",
                    color: "#b22",
                    width: "25%",
                  }}
                  label="Egresos"
                >
                  {payrolles.out_amount?.toFixed(2)}
                </Descriptions.Item>
                <Descriptions.Item
                  labelStyle={{ width: "25%" }}
                  contentStyle={{ textAlign: "right", width: "25%" }}
                  label="Saldo"
                >
                  {payrolles.total?.toFixed(2)}
                </Descriptions.Item>
              </Descriptions>
            </Space>
          </Spin>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          {payrolles.status === 1 && (
            <Button onClick={() => deletePayroll()} htmlType="button" danger>
              Deshabilitar
            </Button>
          )}
        </Col>
        <Col span={12} style={{ textAlign: "right" }}>
          <Link to="/payrolles">
            <Button htmlType="button" type="primary">
              Aceptar
            </Button>
          </Link>
        </Col>
      </Row>
    </>
  );
};

export default PayrollDetails;
