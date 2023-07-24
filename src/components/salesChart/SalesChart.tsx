import { getProductsFromReport } from '../../services/report';
import { getCategories } from '../../services/categories';
import { useEffect, useState, ChangeEvent } from 'react';
import type { ChartData, ChartOptions } from 'chart.js';
import { ProductsResponse } from '../../types/types';
import ModalMyProfile from '../../view/myProfile/ModalMyProfile/ModalMyProfile';
import ChartContainer from '../ChartContainer';
import styles from './styles.module.scss';

import theme from './styles.module.scss';
import SellFilter from '../SellFilters';
import dayjs from 'dayjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

const BarChart = () => {
  const orderSortData: any = [
    { label: 'Maiores Vendas', value: 'desc' },
    { label: 'Menores Vendas', value: 'asc' },
  ];

  const orderFieldData: any = [
    { label: 'Ranking mercado', value: 'sale_competitors_month' },
    { label: 'Ranking loja', value: 'sale_pharmacy_month' },
  ];

  const [sessionData, setSessionData] = useState(
    localStorage.getItem('session')
  );
  const [categoriesData, setCategoriesData] = useState<any>();
  const [orderSort, setOrderSort] = useState<ChangeEvent<Element>>(
    orderSortData[0].value
  );
  const [orderField, setOrderField] = useState<ChangeEvent<Element>>(
    orderFieldData[0].value
  );
  const [category, setCategory] = useState<ChangeEvent<Element>>();
  const [yearMonth, setYearMonth] = useState<dayjs.Dayjs | null>(
    dayjs(new Date())
  );

  const [bestSellerContent, setBestSellerContent] =
    useState<ProductsResponse[]>();
  console.log(bestSellerContent);

  useEffect(() => {
    setSessionData(localStorage.getItem('session'));
  }, []);

  useEffect(() => {
    if (sessionData) {
      console.log(JSON.parse(sessionData).cnpj);
      getCategories(JSON.parse(sessionData).cnpj)
        .then((resp) =>
          resp.map((el) => {
            return {
              label: el.category.split('_').join(' '),
              value: el.category,
            };
          })
        )
        .then((result) => {
          return setCategoriesData(result);
        })
        .catch((error) => alert(error));
    }
  }, [sessionData]);

  useEffect(() => {
    setCategory(categoriesData ? categoriesData[0].value : undefined);
  }, [categoriesData]);

  const onChangeOrderSort = (orderSort: any) => {
    setOrderSort(orderSort);
  };

  const onChangeOrderField = (orderField: any) => {
    setOrderField(orderField);
  };

  const onChangeCategories = (category: any) => {
    setCategory(category);
  };

  const onChangeDate = (date: any) => {
    setYearMonth(date);
  };

  useEffect(() => {
    if (sessionData && orderSort && orderField && category && yearMonth)
      getProductsFromReport({
        limit: 10,
        cnpj: JSON.parse(sessionData).cnpj,
        orderSort: orderSort,
        orderField: orderField,
        category: category,
        period: `${yearMonth?.format('YYYY-MM')}-01`,
      })
        .then((res) => res.slice(0, 7))
        .then((res) => setBestSellerContent(res))
        .catch((error) => alert(error));
  }, [orderSort, orderField, category, yearMonth]);
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        align: 'end',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          boxHeight: 5,
          font: {
            family: theme.fontFamily,
            size: 12,
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          font: {
            family: theme.fontFamily,
            weight: '700',
            size: 14,
            lineHeight: 'normal',
          },
          color: '#424242',
        },

        beginAtZero: true,
        grid: {
          tickColor: 'white',
        },

        border: {
          width: 3,
          color: '#9E9E9E',
        },
      },
      x: {
        offset: true,

        border: {
          width: 3,
          color: '#9E9E9E',
        },

        ticks: {
          // callback: function (value, index, ticks) {
          //   return '$' + value;
          // },
          font: {
            family: theme.fontFamily,
            weight: '500',
            size: 13,
            lineHeight: 'normal',
          },
          color: '#424242',
        },
        grid: {
          display: false,
        },
      },
    },
  };

  const labelsInfo = bestSellerContent?.map((item) => {
    const itemArr = item.product_name.split(' ');
    return `${itemArr[0]} ${itemArr[1]}`;
  });

  const info = {
    labels: labelsInfo,
    datasets: [
      {
        Title: 'tesaaaaaaaaa',
        label: 'Vendas Mercado',
        data: bestSellerContent?.map((item) => item.sale_competitors_month),
      },
      {
        label: 'Minhas vendas',
        data: bestSellerContent?.map((item) => item.sale_pharmacy_month),
      },
    ],
  };

  const labels = info.labels;

  const data = {
    labels,
    datasets: [
      {
        label: info.datasets[0].label,
        data: info.datasets[0].data,
        backgroundColor: '#FF7043',
      },
      {
        label: info.datasets[1].label,
        data: info.datasets[1].data,
        backgroundColor: '#26C6DA',
      },
    ],
  };

  const handleModalClose = () => {};

  return (
    <div className={styles.barChart}>
      <ChartContainer
        showDetails={true}
        showInfo={true}
        showFilter={true}
        chartTitle="Vendas"
        chartSubTitle="Top produtos do mercado x minha loja"
        infoText="Gráfico de maiores vendas"
        filter={
          <SellFilter
            onChangeOrderSort={onChangeOrderSort}
            onChangeOrderField={onChangeOrderField}
            onChangeCategories={onChangeCategories}
            onChangeDate={onChangeDate}
            yearMonth={yearMonth}
            orderSort={orderSort}
            orderField={orderField}
            category={category}
            dataCategories={categoriesData}
            dataOrderField={orderFieldData}
            dataOrderSort={orderSortData}
          />
        }
      >
        <div className={styles.chartStyle}>
          <Bar
            aria-label="Gráfico de maiores vendas"
            options={options}
            data={data}
          />
        </div>
        <ModalMyProfile isOpen={true} onClose={handleModalClose}>
          <div className={styles.teste}>
            <Bar
              aria-label="Gráfico de maiores vendas"
              options={options}
              data={data}
            />
          </div>
        </ModalMyProfile>
      </ChartContainer>
    </div>
  );
};

export default BarChart;
