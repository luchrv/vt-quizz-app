import { FC, useEffect, useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  Modal,
  Row,
  Space,
  Table,
  TablePaginationConfig,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { ReadOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { PayrollIF } from "../../interfaces/payrollIF";
import PaginateResponseIF, {
  PaginateRequestIF,
  PaginateRequestParamsIF,
} from "../../interfaces/paginateIF";
import { PayrollesPaginateSer } from "../../services/payrollesService";
import ResponseIF from "../../interfaces/responseIF";
import { Link } from "react-router-dom";
import moment from "moment";

const { Text } = Typography;

const { RangePicker } = DatePicker;

const dateFormat = "YYYY-MM-DD";

const Payrolles: FC = () => {
  const [datos, setDatos] = useState<PaginateRequestIF<PayrollIF>>({
    total: 0,
    data: null,
  });

  const [loading, setLoading] = useState<boolean>(true);

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number) => `Total ${total} items`,
  });

  const [dates, setDates] = useState<[string, string]>([
    moment().startOf("year").format(dateFormat),
    moment().endOf("month").format(dateFormat),
  ]);

  const columns: any[] = [
    {
      title: "Desde",
      key: "from_date",
      dataIndex: "from_date",
      render: (text: string) => moment(text).utc().format("YYYY-MM-DD"),
    },
    {
      title: "Hasta",
      key: "to_date",
      dataIndex: "to_date",
      render: (text: string) => moment(text).utc().format("YYYY-MM-DD"),
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
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      responsive: ["lg"],
      render: (status: number) => {
        const tag: string = status === 1 ? "Activo" : "Inactivo";
        const color: string = status === 1 ? "green" : "red";
        return (
          <Tag color={color} key={tag}>
            {tag.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Acciones",
      key: "action",
      render: (text: any, record: any) => (
        <Space size="middle">
          <Tooltip placement="left" title="Ver">
            <Link to={`/payrolles/show/${record._id}`}>
              <ReadOutlined />
            </Link>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleTableChange = (
    pag: TablePaginationConfig,
    filters: any,
    sorter: any
  ): void => {
    setPagination({
      ...pagination,
      current: pag.current,
      pageSize: pag.pageSize,
    });

    requestData(
      {
        filter_value: "",
        page: pag.current ?? 1,
        per_page: pag.pageSize ?? 10,
        sort_field: sorter.field ?? "_id",
        sort_type:
          sorter.order === "ascend" || sorter.order === undefined ? 1 : -1,
      },
      pag
    );
  };

  const requestData = (
    params: PaginateRequestParamsIF,
    pag: TablePaginationConfig
  ): void => {
    setLoading(true);

    PayrollesPaginateSer(params).then(
      (res: ResponseIF<PaginateResponseIF<PayrollIF>>) => {
        setLoading(false);
        if (res.ok) {
          if (res.data?.status !== "success") {
            Modal.error({
              title: "Cadena de busqueda no valida",
              content:
                "La cadena de busqueda debe tener al menos 5 caracteres, y solo se permiten letras y numeros",
            });
            return;
          }
          setDatos({
            ...datos,
            data: res.data!.data!,
            total: res.data!.data!.total,
          });
          setPagination({
            ...pagination,
            current: pag.current,
            pageSize: pag.pageSize,
            total: res.data!.data!.total,
          });
        }
      }
    );
  };

  useEffect(() => {
    requestData(
      {
        from: dates[0],
        to: dates[1],
        filter_value: "",
        page: 1,
        per_page: 10,
        sort_field: "_id",
        sort_type: 1,
      },
      {}
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = (): void => {
    requestData(
      {
        from: dates[0],
        to: dates[1],
        filter_value: "",
        page: 1,
        per_page: 10,
        sort_field: "_id",
        sort_type: 1,
      },
      pagination
    );
  };

  const onChangeRange = (valuesDates: any, formatString: [string, string]): void => {
    const from: string  = moment(valuesDates[0], "YYYY-MM").startOf("month").format(dateFormat);
    const to: string = moment(valuesDates[1], "YYYY-MM").endOf("month").format(dateFormat);
    setDates([from, to]);
  };

  return (
    <>
      <h1>Nóminas</h1>
      <Row style={{ paddingBottom: 25 }}>
        <Col xs={20} sm={16} md={12} lg={8} xl={6}>
          <Space style={{width: "100%"}}>
            <RangePicker picker="month"
              defaultValue={[
                moment(moment().startOf("year"), dateFormat),
                moment(moment().endOf("month"), dateFormat),
              ]}
              inputReadOnly
              allowClear={false}
              style={{ width: "100%" }}
              onChange={onChangeRange}
            />
            <Button type="primary" onClick={onSearch} icon={<SearchOutlined />} />
          </Space>
        </Col>
        <Col xs={4} sm={8} md={12} lg={16} xl={18} style={{textAlign: "right"}}>
          <Link to="/payrolles/create">
            <Button type="primary" size="middle" icon={<PlusOutlined />}>
              Generar Nómina
            </Button>
          </Link>
        </Col>
      </Row>

      <Table<PayrollIF>
        columns={columns}
        dataSource={datos.data?.data}
        rowKey={(row) => row._id}
        pagination={pagination}
        onChange={handleTableChange}
        loading={loading}
        size="small"
      />
    </>
  );
};

export default Payrolles;
