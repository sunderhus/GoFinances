import React, { useState, useEffect, useCallback } from 'react';
import {
  FiChevronDown,
  FiChevronUp,
  FiDollarSign,
  FiHome,
  FiCoffee,
  FiActivity,
  FiTruck,
} from 'react-icons/fi';

import incomeIcon from '../../assets/income.svg';
import outcomeIcon from '../../assets/outcome.svg';
import totalIcon from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';
import formatDate from '../../utils/formatDate';

import {
  Container,
  CardContainer,
  Card,
  TableContainer,
  Category,
  Pagination,
} from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionAndBalance {
  transactions: Transaction[];
  balance: Balance;
}
interface Filter {
  columnName: 'title' | 'value' | 'category' | 'date';
}

const CategoryIcons = {
  Car: <FiTruck />,
  Food: <FiCoffee />,
  House: <FiHome />,
  Health: <FiActivity />,
  Other: <FiDollarSign />,
};

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [valueOrder, setValueOrder] = useState(false);
  const [titleOrder, setTitleOrder] = useState(false);
  const [categoryOrder, setCategoryOrder] = useState(false);
  const [dateOrder, setDateOrder] = useState(true);

  const handleResetFilterStates = useCallback((): void => {
    setTitleOrder(false);
    setValueOrder(false);
    setCategoryOrder(false);
    setDateOrder(false);
  }, []);

  const handleTableOrder = useCallback(
    (order: Filter, newColumnState: boolean): void => {
      let sortedTransactions: Transaction[];

      handleResetFilterStates();

      switch (order.columnName) {
        case 'value':
          if (newColumnState) {
            sortedTransactions = transactions.sort((a, b) => a.value - b.value);
          } else {
            sortedTransactions = transactions.sort((a, b) => b.value - a.value);
          }

          setValueOrder(newColumnState);

          break;
        case 'title':
          sortedTransactions = transactions.sort((a, b) =>
            a.title.localeCompare(b.title),
          );
          if (!newColumnState) {
            sortedTransactions = sortedTransactions.reverse();
          }

          setTitleOrder(newColumnState);

          break;
        case 'category':
          sortedTransactions = transactions.sort((a, b) =>
            a.category.title.localeCompare(b.category.title),
          );
          if (!newColumnState) {
            sortedTransactions = sortedTransactions.reverse();
          }

          setCategoryOrder(newColumnState);

          break;
        case 'date':
          sortedTransactions = transactions.sort((a, b) => {
            const dateA = new Date(a.created_at);
            const dateB = new Date(b.created_at);
            // eslint-disable-next-line no-nested-ternary
            return dateA < dateB ? 1 : dateB < dateA ? -1 : 0;
          });
          if (!newColumnState) {
            sortedTransactions = sortedTransactions.reverse();
          }

          setDateOrder(newColumnState);

          break;
        default:
          return;
      }

      setTransactions([...sortedTransactions]);
    },
    [transactions, handleResetFilterStates],
  );

  const handleCategoryIcons = useCallback(
    (categoryName: string): JSX.Element => {
      switch (categoryName) {
        case 'Food':
          return CategoryIcons.Food;
        case 'House':
          return CategoryIcons.House;
        case 'Car':
          return CategoryIcons.Car;
        case 'Health':
          return CategoryIcons.Health;
        default:
          return CategoryIcons.Other;
      }
    },
    [],
  );

  const loadTransactions = useCallback(async (): Promise<void> => {
    if (loading) return;

    if (total > 0 && transactions.length >= total) return;

    setLoading(true);
    try {
      const [transactionsAndBalance] = await Promise.all([
        api.get<TransactionAndBalance>('/transactions', { params: { page } }),
      ]);

      const currentTransactions = transactionsAndBalance.data.transactions;
      const currentBalance = transactionsAndBalance.data.balance;
      const currentTotal = Number(
        transactionsAndBalance.headers['x-total-count'],
      );

      const transacitonsFormatted = currentTransactions.map(transaction => ({
        ...transaction,
        formattedDate: formatDate(transaction.created_at),
        formattedValue: formatValue(transaction.value),
      }));

      setTransactions([...transactions, ...transacitonsFormatted.reverse()]);
      setBalance(currentBalance);
      setTotal(currentTotal);
      setPage(page + 1);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, [loading, page, total, transactions]);

  useEffect(() => {
    loadTransactions();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header />

      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={incomeIcon} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{formatValue(balance.income)}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcomeIcon} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">
              {formatValue(balance.outcome)}
            </h1>
          </Card>
          <Card total={balance.total > 0}>
            <header>
              <p>Total</p>
              <img src={totalIcon} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{formatValue(balance.total)}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>
                  <button
                    type="button"
                    onClick={() => {
                      handleTableOrder({ columnName: 'title' }, !titleOrder);
                    }}
                  >
                    {titleOrder ? (
                      <>
                        <p style={{ color: '#131b4c' }}>Título</p>
                        <FiChevronUp color="#29da88" size="16" />
                      </>
                    ) : (
                      <>
                        <p>Título</p>
                        <FiChevronDown color="#969cb3" size="16" />
                      </>
                    )}
                  </button>
                </th>
                <th>
                  <button
                    type="button"
                    onClick={() => {
                      handleTableOrder({ columnName: 'value' }, !valueOrder);
                    }}
                  >
                    {valueOrder ? (
                      <>
                        <p style={{ color: '#131b4c' }}>Preço</p>
                        <FiChevronUp color="#29da88" size="16" />
                      </>
                    ) : (
                      <>
                        <p>Preço</p>
                        <FiChevronDown color="#969cb3" size="16" />
                      </>
                    )}
                  </button>
                </th>
                <th>
                  <button
                    type="button"
                    onClick={() => {
                      handleTableOrder(
                        { columnName: 'category' },
                        !categoryOrder,
                      );
                    }}
                  >
                    {categoryOrder ? (
                      <>
                        <p style={{ color: '#131b4c' }}>Categoria</p>
                        <FiChevronUp color="#29da88" size="16" />
                      </>
                    ) : (
                      <>
                        <p>Categoria</p>
                        <FiChevronDown color="#969cb3" size="16" />
                      </>
                    )}
                  </button>
                </th>
                <th>
                  <button
                    type="button"
                    onClick={() => {
                      handleTableOrder({ columnName: 'date' }, !dateOrder);
                    }}
                  >
                    {dateOrder ? (
                      <>
                        <p style={{ color: '#131b4c' }}>Data</p>
                        <FiChevronUp color="#29da88" size="16" />
                      </>
                    ) : (
                      <>
                        <p>Data</p>
                        <FiChevronDown color="#969cb3" size="16" />
                      </>
                    )}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td className="title">{transaction.title}</td>
                  <td className={transaction.type}>
                    {transaction.type === 'income'
                      ? transaction.formattedValue
                      : `- ${transaction.formattedValue}`}
                  </td>

                  <td>
                    <Category>
                      {handleCategoryIcons(transaction.category.title)}
                      <span>{transaction.category.title}</span>
                    </Category>
                  </td>
                  <td>{transaction.formattedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
        <Pagination>
          <button
            disabled={transactions.length >= total}
            onClick={loadTransactions}
            type="button"
          >
            {loading ? 'Carregando' : 'Carregar mais'}
          </button>
        </Pagination>
      </Container>
    </>
  );
};

export default Dashboard;
