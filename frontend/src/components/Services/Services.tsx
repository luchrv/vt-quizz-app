import { FC, useEffect, useState } from "react";
import {
  Button,
  Col,
  Input,
  Modal,
  Row,
  Space,
  Table,
  TablePaginationConfig,
  Tag,
} from "antd";
import { EditFilled, ReadOutlined, PlusOutlined } from "@ant-design/icons";
import {ServiceIF} from "../../interfaces/serviceIF";
import PaginateResponseIF, {
  PaginateRequestIF,
  PaginateRequestParamsIF,
} from "../../interfaces/paginateIF";
import { ServicesPaginateSer } from "../../services/servicesService";
import ResponseIF from "../../interfaces/responseIF";
import { Link } from "react-router-dom";
import ServiceDescription from "./ServiceDescription";

const { Search } = Input;

const Services: FC = () => {
  const [datos, setDatos] = useState<PaginateRequestIF<ServiceIF>>({
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

  const columns: any[] = [
    {
      title: "Código",
      key: "code",
      dataIndex: "code",
    },
    {
      title: "Nombre",
      dataIndex: "service",
      key: "service",
    },
    {
      title: "Precio",
      dataIndex: "price",
      key: "price",
      align: "right",
    },
    {
      title: "Pago Empleado",
      dataIndex: "employees_payment",
      key: "employees_payment",
      responsive: ["lg"],
      align: "right",
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
          <Button type="link" size="small" onClick={() => showRegister(record)}>
            <ReadOutlined />
          </Button>
          <Link to={`/services/edit/${record._id}`}>
            <EditFilled />
          </Link>
        </Space>
      ),
    },
  ];

  const showRegister = (service: ServiceIF) => {
    Modal.info({
      width: "80%",
      title: "Informacion del usuario",
      content: (
        <ServiceDescription service={service}/>
      ),
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

    ServicesPaginateSer(params).then(
      (res: ResponseIF<PaginateResponseIF<ServiceIF>>) => {
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

  const onSearch = (value: string): void => {
    requestData(
      {
        filter_value: value,
        page: 1,
        per_page: 10,
        sort_field: "_id",
        sort_type: 1,
      },
      pagination
    );
  };

  return (
    <>
      <h1>Servicios</h1>
      <Row style={{ paddingBottom: 25 }}>
        <Col xs={20} sm={16} md={12} lg={8} xl={6}>
          <Search
            placeholder="Buscar servicio"
            onSearch={onSearch}
            enterButton
          />
        </Col>
        <Col xs={4} sm={8} md={12} lg={16} xl={18} style={{textAlign: "right"}}>
          <Link to="/services/create">
            <Button type="primary" size="middle" icon={<PlusOutlined />}>
              Nuevo servicio
            </Button>
          </Link>
        </Col>
      </Row>

      <Table<ServiceIF>
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

export default Services;
