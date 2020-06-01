import React, { useState, useEffect } from 'react';
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

const CategoryIcons = {
  Car: <FiTruck />,
  Food: <FiCoffee />,
  House: <FiHome />,
  Health: <FiActivity />,
  Other: <FiDollarSign />,
};

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

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);
  const [valueOrder, setValueOrder] = useState(false);
  const [titleOrder, setTitleOrder] = useState(false);
  const [categoryOrder, setCategoryOrder] = useState(false);
  const [dateOrder, setDateOrder] = useState(true);

  function handleTableOrder(order: Filter, newColumnState: boolean): void {
    let sortedTransactions: Transaction[];

    setTitleOrder(false);
    setValueOrder(false);
    setCategoryOrder(false);
    setDateOrder(false);

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
        sortedTransactions = transactions.sort((a, b) =>
          a.formattedDate.localeCompare(b.formattedDate),
        );
        if (!newColumnState) {
          sortedTransactions = sortedTransactions.reverse();
        }

        setDateOrder(newColumnState);

        break;
      default:
        return;
    }
    setTransactions([...sortedTransactions]);
  }

  function handleCategoryIcons(categoryName: string): JSX.Element {
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
  }

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const [transactionsAndBalance] = await Promise.all([
        api.get<TransactionAndBalance>('/transactions'),
      ]);
      const currentTransactions = transactionsAndBalance.data.transactions;
      const currentBalance = transactionsAndBalance.data.balance;

      const transacitonsFormatted = currentTransactions.map(transaction => ({
        ...transaction,
        formattedDate: formatDate(transaction.created_at),
        formattedValue: formatValue(transaction.value),
      }));

      setTransactions([...transacitonsFormatted]);
      setBalance(currentBalance);
    }

    loadTransactions();
  }, [transactions.length]);

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
          <Card total>
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
                    <p>Título</p>
                    {titleOrder ? (
                      <FiChevronUp color="#FF872C" size="16" />
                    ) : (
                      <FiChevronDown color="#969cb3" size="16" />
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
                    <p>Preço</p>
                    {valueOrder ? (
                      <FiChevronUp color="#FF872C" size="16" />
                    ) : (
                      <FiChevronDown color="#969cb3" size="16" />
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
                    <p>Categoria</p>
                    {categoryOrder ? (
                      <FiChevronUp color="#FF872C" size="16" />
                    ) : (
                      <FiChevronDown color="#969cb3" size="16" />
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
                    <p>Data</p>
                    {dateOrder ? (
                      <FiChevronUp color="#FF872C" size="16" />
                    ) : (
                      <FiChevronDown color="#969cb3" size="16" />
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
      </Container>
    </>
  );
};

export default Dashboard;
