import React from 'react';
import ReactDOM from 'react-dom';
import { ConfigProvider } from 'antd';
import esES from 'antd/es/locale/es_ES';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './state';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
    <ConfigProvider locale={esES}>
      <App />
    </ConfigProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
