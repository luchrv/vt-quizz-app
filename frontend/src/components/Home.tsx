import { FC, useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { Bar,  } from 'react-chartjs-2';
import { Modal, Spin } from 'antd';
import { MovimentsDashboardSer } from '../services/movimentsService';
import ResponseIF from '../interfaces/responseIF';
import { MovimentsDashbordIF } from '../interfaces/movimentIF';
import moment from 'moment';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  plugins: {
    title: {
      display: true,
      text: `Balance ${moment().format('YYYY')}`,
    },
  },
  responsive: true,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

/* export const options = {
  indexAxis: 'y' as const,
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: 'right' as const,
    },
    title: {
      display: true,
      text: `Balance ${moment().format('YYYY')}`,
    },
  },
}; */

const labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const Home: FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<ChartData<"bar", number[], unknown>>({
    labels: labels,
    datasets: []
  });

  const requestData = (): void => {
    setLoading(true);

    MovimentsDashboardSer().then((res: ResponseIF<[MovimentsDashbordIF]>) => {
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
        setData({
          labels,
          datasets: [
            {
              label: 'Egresos',
              data: res.data!.data!.map((item: MovimentsDashbordIF) => -item.out_amount),
              backgroundColor: 'rgba(255, 77, 79, 0.75)',

            },
            {
              label: 'Ingresos',
              data: res.data!.data!.map((item: MovimentsDashbordIF) => item.in_amount),
              backgroundColor: 'rgba(24, 114, 255, 0.75)',
            },
          ],
        });
      }
    });
  };

  useEffect(() => {
    requestData();
  }, [])
  
  return (
    <Spin spinning={loading}>
      <Bar options={options} data={data} />
    </Spin>
  );
}

export default Home;