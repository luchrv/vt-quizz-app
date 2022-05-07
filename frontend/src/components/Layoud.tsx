import { FC } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Button, Layout, Menu, Result } from "antd";
import {
  ContactsOutlined,
  CreditCardOutlined,
  HomeOutlined,
  LogoutOutlined,
  ShopOutlined,
  TeamOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import Logo from "../assets/images/Logo.png";
import Home from "./Home";
import Employees from "./Employees/Employees";
import EmployeeCreate from "./Employees/EmployeeCreate";
import EmployeeEdit from "./Employees/EmployeeEdit";
import Moviments from "./Moviments/Moviments";
import Services from "./Services/Services";
import ServiceCreate from "./Services/ServiceCreate";
import ServiceEdit from "./Services/ServiceEdit";
import Users from "./Users/Users";
import UserCreate from "./Users/UserCreate";
import UserEdit from "./Users/UserEdit";
import Logout from "./Logout";
import MovimentCreate from "./Moviments/MovimentCreate";
import MovimentEdit from "./Moviments/MovimentEdit";
import Payrolles from "./Payrolles/Payrolles";
import PayrollDetails from "./Payrolles/PayrollDetails";
import PayrollCreate from "./Payrolles/PayrollCreate";

const { Header, Content, Footer, Sider } = Layout;

const Layoud: FC = () => {
  const year = new Date().getFullYear();
  let location = useLocation();

  return (
    <Layout id="layout-responsive">
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          // console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          // console.log(collapsed, type);
        }}
        theme="light"
      >
        <div className="logo">
          <img src={Logo} alt="logo" />
        </div>
        <Menu mode="inline" defaultSelectedKeys={[location.pathname]}>
          <Menu.Item key="/" icon={<HomeOutlined />}>
            <span>Inicio</span>
            <Link to="/" />
          </Menu.Item>
          <Menu.Item key="/moviments" icon={<UnorderedListOutlined />}>
            <span>Movimientos</span>
            <Link to="/moviments" />
          </Menu.Item>
          <Menu.Item key="/payrolles" icon={<CreditCardOutlined />}>
            <span>Nómina</span>
            <Link to="/payrolles" />
          </Menu.Item>
          <Menu.Item key="/employees" icon={<ContactsOutlined />}>
            <span>Empleados</span>
            <Link to="/employees" />
          </Menu.Item>
          <Menu.Item key="/services" icon={<ShopOutlined />}>
            <span>Servicios</span>
            <Link to="/services" />
          </Menu.Item>
          <Menu.Item key="/users" icon={<TeamOutlined />}>
            <span>Usuarios</span>
            <Link to="/users" />
          </Menu.Item>
          <Menu.Item key="/logout" icon={<LogoutOutlined />}>
            <span>Salir</span>
            <Link to="/logout" />
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header
          className="site-layout-header"
        />
        <Content className="site-layout-body">
          <div className="site-layout-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/moviments" element={<Moviments />} />
              <Route path="/moviments/create" element={<MovimentCreate />} />
              <Route path="/moviments/edit/:userId" element={<MovimentEdit />} />
              <Route path="/payrolles" element={<Payrolles />} />
              <Route path="/payrolles/create" element={<PayrollCreate />} />
              <Route path="/payrolles/show/:payrollId" element={<PayrollDetails />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/employees/create" element={<EmployeeCreate />} />
              <Route path="/employees/edit/:userId" element={<EmployeeEdit />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/create" element={<ServiceCreate />} />
              <Route path="/services/edit/:userId" element={<ServiceEdit />} />
              <Route path="/users" element={<Users />} />
              <Route path="/users/create" element={<UserCreate />} />
              <Route path="/users/edit/:userId" element={<UserEdit />} />
              <Route path="/logout" element={<Logout />} />
              <Route
                path="*"
                element={
                  <Result
                    status="404"
                    title="404"
                    subTitle="Disculpe la página no existe."
                  />
                }
              />
            </Routes>
          </div>
        </Content>
        <Footer className="site-layout-footer">
          Copyright © {year} <Button href="https://luchrv.dev" target="_blank" type="link">{'<luchrv />'}</Button>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Layoud;
