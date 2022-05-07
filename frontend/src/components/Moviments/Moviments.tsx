import { FC, useEffect, useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  Descriptions,
  Input,
  Modal,
  Row,
  Space,
  Spin,
  Table,
  TablePaginationConfig,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import {
  EditFilled,
  FileExcelOutlined,
  ReadOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { MovimentIF } from "../../interfaces/movimentIF";
import PaginateResponseMovimentsIF, {
  PaginateRequestIF,
  PaginateRequestParamsIF,
} from "../../interfaces/paginateIF";
import { MovimentsPaginateSer } from "../../services/movimentsService";
import ResponseIF from "../../interfaces/responseIF";
import { Link } from "react-router-dom";
import MovimentDescription from "./MovimentDescription";
import moment from "moment";
import { movimentToExcel } from "./MovimentExcel";

const { Search } = Input;

const { Text } = Typography;

const { RangePicker } = DatePicker;

const dateFormat = "YYYY-MM-DD";

const Moviments: FC = () => {
  const [datos, setDatos] = useState<PaginateRequestIF<MovimentIF>>({
    total: 0,
    data: null,
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [dates, setDates] = useState<[string, string]>([
    moment().startOf("month").format(dateFormat),
    moment().endOf("month").format(dateFormat),
  ]);

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number) => `Total ${total} items`,
  });

  const columns: any[] = [
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
      dataIndex: "service_price",
      key: "service_price",
      align: "right",
      render: (service_price: number, moviment: MovimentIF) => {
        const amount = moviment.service_price
          ? moviment.service_price
          : -moviment.out_amount;
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
            <Button type="link" size="small" onClick={() => showRegister(record)}>
              <ReadOutlined />
            </Button>
          </Tooltip>
          <Tooltip placement="right" title="Editar">
            <Link to={`/moviments/edit/${record._id}`}>
              <EditFilled />
            </Link>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const showRegister = (moviment: MovimentIF) => {
    Modal.info({
      width: "80%",
      title: "Informacion del usuario",
      content: <MovimentDescription moviment={moviment} />,
    });
  };

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
        from: dates[0],
        to: dates[1],
        filter_value: search,
        page: pag.current ?? 1,
        per_page: pag.pageSize ?? 10,
        sort_field: sorter.field ?? "mdate_time",
        sort_type: -1,
      },
      pag
    );
  };

  const requestData = (
    params: PaginateRequestParamsIF,
    pag: TablePaginationConfig
  ): void => {
    setLoading(true);

    MovimentsPaginateSer(params).then(
      (res: ResponseIF<PaginateResponseMovimentsIF<MovimentIF>>) => {
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
        filter_value: search,
        page: 1,
        per_page: 10,
        sort_field: "mdate_time",
        sort_type: -1,
      },
      {}
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, dates]);

  const onSearch = (value: string): void => {
    if (value.length < 4 && value.length > 0) {
      Modal.error({
        title: "Cadena de busqueda no valida",
        content:
          "La cadena de busqueda debe tener al menos 4 caracteres, y solo se permiten letras y numeros",
      });
      return;
    }
    setSearch(value);
  };

  const onRange = (values: any, formatString: [string, string]): void => {
    setDates(formatString);
  };

  const btnRefresh = (): void => {
    requestData(
      {
        from: dates[0],
        to: dates[1],
        filter_value: search,
        page: 1,
        per_page: 10,
        sort_field: "mdate_time",
        sort_type: -1,
      },
      {}
    );
  };

  return (
    <>
      <h1>Movimientos</h1>
      <Row style={{ paddingBottom: 25 }}>
        <Col style={{ paddingBottom: 5 }} xs={24} sm={12} md={12} lg={8} xl={8}>
          <RangePicker
            defaultValue={[
              moment(moment().startOf("month"), dateFormat),
              moment(moment().endOf("month"), dateFormat),
            ]}
            inputReadOnly
            allowClear={false}
            style={{ width: "100%" }}
            onChange={onRange}
          />
        </Col>
        <Col style={{ paddingBottom: 5 }} xs={24} sm={12} md={12} lg={8} xl={8}>
          <Search
            allowClear
            placeholder="Buscar movimiento"
            onSearch={onSearch}
            enterButton
          />
        </Col>
        <Col
          xs={24} sm={24} md={24} lg={8} xl={8}
          style={{ textAlign: "right" }}
        >
          <Link to="/moviments/create">
            <Button type="primary" size="middle" icon={<PlusOutlined />}>
              Nuevo movimiento
            </Button>
          </Link>
        </Col>
      </Row>

      <Spin spinning={loading}>
        <Descriptions
          bordered
          size="small"
          column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
          style={{ marginBottom: 25 }}
          extra={
            <Space>
              <Tooltip placement="top" title="Exportar Excel">
                <Button 
                  icon={<FileExcelOutlined />} 
                  type="default"
                  onClick={() => movimentToExcel(dates[0], dates[1], search)}
                ></Button>
              </Tooltip>
              <Tooltip placement="top" title="Recargar">
                <Button
                  icon={<ReloadOutlined />}
                  onClick={btnRefresh}
                  type="default"
                ></Button>
              </Tooltip>
            </Space>
          }
        >
          <Descriptions.Item label="Desde">{dates[0]}</Descriptions.Item>
          <Descriptions.Item label="Hasta">{dates[1]}</Descriptions.Item>
          <Descriptions.Item label="Filtro" span={2}>
            {search}
          </Descriptions.Item>
        </Descriptions>

        <Table<MovimentIF>
          columns={columns}
          dataSource={datos.data?.data}
          rowKey={(row) => row._id}
          pagination={pagination}
          onChange={handleTableChange}
          size="small"
        />

        <Descriptions
          bordered
          size="small"
          column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
        >
          <Descriptions.Item
            contentStyle={{ textAlign: "right" }}
            label="Ingresos"
          >
            {datos.data?.summary.in_amount?.toFixed(2)}
          </Descriptions.Item>
          <Descriptions.Item
            contentStyle={{ textAlign: "right", color: "#b22" }}
            label="Egresos"
          >
            {datos.data?.summary.out_amount?.toFixed(2)}
          </Descriptions.Item>
          <Descriptions.Item
            contentStyle={{ textAlign: "right" }}
            label="Saldo"
          >
            {datos.data?.summary.total_amount?.toFixed(2)}
          </Descriptions.Item>
        </Descriptions>
      </Spin>
    </>
  );
};

export default Moviments;
