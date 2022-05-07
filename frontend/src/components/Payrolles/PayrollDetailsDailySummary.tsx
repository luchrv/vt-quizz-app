import { Button, Modal, Table, Typography } from "antd";
import moment from "moment";
import { MovimentIF } from "../../interfaces/movimentIF";
import { DailySummaryIF } from "../../interfaces/payrollIF";
import PayrollDetailsMoviments from "./PayrollDetailsMoviments";

const { Text } = Typography;

const PayrollDetailsDailySummary = (prop: any) => {
  const dailysummary: DailySummaryIF[] = prop.dailysummary;

  const showMoviments = (moviments: MovimentIF[]) => {
    Modal.info({
      width: "80%",
      title: "Movimientos",
      content: <PayrollDetailsMoviments moviments={moviments} />,
    });
  };

  const columns: any[] = [
    {
      title: "Fecha",
      key: "date",
      dataIndex: "date",
      width: "60%",
      render: (text: string, record: DailySummaryIF) => (
        <Button type="link" onClick={() => showMoviments(record.moviments)}>
          {moment(text).utc().format("YYYY-MM-DD")}
        </Button>
      ),
    },
    {
      title: "Ingresos",
      dataIndex: "in_amount",
      key: "in_amount",
      align: "right",
      render: (amount: number) => {
        return (
          <Text style={{ color: amount < 0 ? "#b22" : "#000" }}>
            {amount.toFixed(2)}
          </Text>
        );
      },
    },
    {
      title: "Egresos",
      dataIndex: "out_amount",
      key: "out_amount",
      align: "right",
      render: (amount: number) => {
        amount = -amount;
        return (
          <Text style={{ color: amount < 0 ? "#b22" : "#000" }}>
            {amount.toFixed(2)}
          </Text>
        );
      },
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      align: "right",
      render: (amount: number) => {
        return (
          <Text style={{ color: amount < 0 ? "#b22" : "#000" }}>
            {amount.toFixed(2)}
          </Text>
        );
      },
    },
  ];

  return (
    <Table<DailySummaryIF>
      columns={columns}
      dataSource={dailysummary}
      bordered={true}
      pagination={false}
      rowKey={(row) => row.date}
      size="small"
    />
  );
};

export default PayrollDetailsDailySummary;
