import { Table, Typography } from "antd";
import { PaySheetIF } from "../../interfaces/payrollIF";
import PayrollDetailsDailySummary from "./PayrollDetailsDailySummary";

const { Text } = Typography;

const PayrollDetailsPaysheets = (prop: any) => {
  const paysheets: PaySheetIF[] = prop.paysheets;

  const columns: any[] = [
    {
      title: "Empleado",
      key: "employee",
      dataIndex: "employee",
      width: "50%",
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
    <Table<PaySheetIF>
      columns={columns}
      dataSource={paysheets}
      bordered={true}
      pagination={false}
      rowKey={(row) => row.employee_id}
      size="small"
      expandable={{
        expandedRowRender: (record) => (
          <div style={{margin: "10px"}}>
            <PayrollDetailsDailySummary dailysummary={record.daily_summary} />
          </div>
        ),
        rowExpandable: (record) => record.daily_summary.length !== 0,
      }}
    />
  );
};

export default PayrollDetailsPaysheets;
