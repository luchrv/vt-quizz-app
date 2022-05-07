import { FC } from "react";
// Para obtener el estado de la sesion
import { removeUserLS } from "../utils/localstorage";
import { removeUserSS } from "../utils/sessionstorage";
// Para hacer el dispatch del estado
import { bindActionCreators } from "redux";
import { userSessionActionCreator } from "../state";
import { useDispatch } from "react-redux";
//
import { Result, Button } from "antd";
import { CloseCircleTwoTone } from "@ant-design/icons";

const Logout: FC = () => {
  // Obtener el dispatch del estado
  const dispatch = useDispatch();
  const { clearUserSession } = bindActionCreators(
    userSessionActionCreator,
    dispatch
  );

  const handleLogout = (): void => {
    removeUserLS();
    removeUserSS();
    clearUserSession();
    window.location.href = "/";
  };

  return (
    <Result
      icon={<CloseCircleTwoTone />}
      title="Si realmente quiere salir por favor presione el botón."
      extra={
        <Button type="primary" danger onClick={() => handleLogout()}>
          Salir
        </Button>
      }
    />
  );
};

export default Logout;
