import { Table, Typography } from "antd";
import { ColumnsType } from "antd/lib/table";
import moment from "moment";
import { MovimentIF } from "../../interfaces/movimentIF";

const { Text } = Typography;

const PayrollDetailsMoviments= (prop: any) => {
  const moviments: MovimentIF[] = prop.moviments;

  const columns: ColumnsType<MovimentIF> | undefined = [
    {
      title: "Fecha",
      key: "mdate_time",
      dataIndex: "mdate_time",
      render: (text: string) => moment(text).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Empleado",
      dataIndex: "employee",
      key: "employee",
    },
    {
      title: "Concepto",
      dataIndex: "mtype",
      key: "mtype",
      render: (mtype: string, moviment: MovimentIF) => {
        const detail =
          moviment.mtype === "in" ? moviment.service : moviment.out_description;
        return detail;
      },
    },
    {
      title: "Monto",
      dataIndex: "employee_payment",
      key: "employee_payment",
      align: "right",
      render: (employee_payment: number, moviment: MovimentIF) => {
        const amount = moviment.employee_payment
          ? moviment.employee_payment
          : -moviment.out_amount;
        return (
          <Text style={{ color: amount < 0 ? "#b22" : "#000" }}>
            {amount.toFixed(2)}
          </Text>
        );
      },
    },
  ];
  return (
    <Table<MovimentIF>
      columns={columns}
      dataSource={moviments}
      bordered={true}
      pagination={false}
      rowKey={(row) => row._id}
      size="small"
    />
  );
};

export default PayrollDetailsMoviments
