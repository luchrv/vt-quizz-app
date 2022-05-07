import * as utils from "../utils/constants";
import ResponseIF from "../interfaces/responseIF";
import { Modal, ModalFuncProps } from "antd";
import { closeSession } from "../utils/closeSession";
import UserSessionIF from "../interfaces/userSessionIF";
import { getUserLS } from "../utils/localstorage";
import { getUserSS } from "../utils/sessionstorage";

export const Fetcher = async <T>(
  url: string,
  method: string,
  body?: any
): Promise<ResponseIF<T>> => {
  const user: UserSessionIF = (getUserLS().token.trim().length > 0) ? getUserLS() : getUserSS();
  try {
    const res: Response = await fetch(utils.API_URL + url, {
      method,
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
        Origin: window.location.origin,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(res);
      validateResponse(res.status, data.message);
    }
    return {
      status: res.status,
      ok: res.ok,
      statusText: data.statusText,
      data: data,
    };
  } catch (err) {
    console.log(err);
    Modal.error({
      title: "Error al cargar los datos",
      content: "Error de conexión de red. Por favor, intente más tarde",
    });
    return {
      status: 0,
      statusText: `Error de conexión de red.`,
      ok: false,
    };
  }
};

const validateResponse = (status: number, text: string) => {
  let modalProp: ModalFuncProps = {};
  switch (status) {
    case 401:
      modalProp = {
        title: "Su sesión ha expirado",
        content: "Por favor, inicie sesión nuevamente.",
        onOk() {
          closeSession();
        },
        keyboard: false,
      };
      break;
    case 403:
      modalProp = {
        title: "Error de autorización",
        content: "No tiene permisos para acceder a esta página.",
      };
      break;

    default:
      modalProp = {
        title: 'Error',
        content: text,
      };
      break;
  }
  Modal.error(modalProp);
};

export default Fetcher;
