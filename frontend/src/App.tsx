import { FC } from "react";
// CSS
import "./App.scss";
// Importamos la librería para manejar las rutas
import { BrowserRouter as Router } from "react-router-dom";
// Para obtener el estado de la sesion
import { useSelector } from "react-redux";
import { RootState } from "./state/reducers";
import { getUserLS } from "./utils/localstorage";
import { getUserSS } from "./utils/sessionstorage";
// Para hacer el dispatch del estado
import { bindActionCreators } from "redux";
import { userSessionActionCreator } from "./state";
import { useDispatch } from "react-redux";
// Interfaces
import UserSessionIF from "./interfaces/userSessionIF";
// Componentes
import Login from "./components/Login";
import Layoud from "./components/Layoud";


const App: FC = () => {
  // Obtener el estado de la sesion
  const state = useSelector((state: RootState) => state.userSession);

  // Obtener el dispatch del estado
  const dispatch = useDispatch();
  const { setUserSession } = bindActionCreators(
    userSessionActionCreator,
    dispatch
  );

  const { token } = state;

  if (token.trim().length === 0) {
    const user: UserSessionIF = (getUserLS().token.trim().length > 0) ? getUserLS() : getUserSS();
    if (user.token.trim().length > 0) {
      setUserSession(user);
    }
  }

  return (
    <>
      <Router>
        {token.trim().length === 0 ? <Login /> : <Layoud />}
      </Router>
    </>
  );
};

export default App;
