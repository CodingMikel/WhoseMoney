import React, { useEffect, useState } from 'react';
import { money } from '~/utils';
import { getDateLeftInCurrentMonth } from '~/utils/time';
import axiosClient from '~/axios';
import { FaEye, FaEdit } from 'react-icons/fa';
import { Button, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import ExpenseManagementDeleteAlert from '~/features/Expense/ExpenseManagementDeleteAlert';
import usePayingMoneyStore from '~/store/usePayingMoneyStore';
import Fallback from '~/components/Fallback';
import PayingMoneyModal from '~/features/PayingMoney/PayingMoneyModal';
import useCategoryStore from '~/store/useCategoryStore';
import ExpenseManagementModal from '~/features/ExpenseManagementModal/ExpenseManagementModal';
import ExpensesDetailModal from '../features/Expense/ExpensesDetailModal';

const dummyExpenses = [
  {
    id: 1,
    name: 'Expense 1',
    category: 'Category 1',
    amount: 1000,
    date: new Date(),
  },
  {
    id: 2,
    name: 'Expense 2',
    category: 'Category 2',
    amount: 2000,
    date: new Date(),
  },
  // Add more dummy expenses as needed
];

const ExpenseManagement = () => {
  const [payingMoney, fetchingPayingMoney, fetchPayingMoney] =
    usePayingMoneyStore((state) => [
      state.payingMoney,
      state.fetchingPayingMoney,
      state.fetchPayingMoney,
    ]);

  const [expenseDetailModalOpen, setExpenseDetailModalOpen] = useState(false);
  const [fetchingCategories, fetchCategories] = useCategoryStore((state) => [
    state.fetchingCategories,
    state.fetchCategories,
  ]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [expenses, setExpenses] = useState([]);
  const [filteredExpeneses, setFilteredExpenses] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchSubmit = () => {
    const results = expenses.filter((item) =>
      item.name.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredExpenses(results);
  };
  // Edit | Add
  const [modalOpen, setModalOpen] = useState({
    state: false,
    type: 'add',
    selectedPayingMoney: null,
  });

  useEffect(() => {
    fetchPayingMoney();
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Use the dummy data
  useEffect(() => {
    setExpenses(dummyExpenses);
  }, [dummyExpenses]);

  useEffect(() => {
    const newFilteredExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        (selectedMonth ? expenseDate.getMonth() + 1 === selectedMonth : true) &&
        (selectedYear ? expenseDate.getFullYear() === selectedYear : true)
      );
    });
    setFilteredExpenses(newFilteredExpenses);
  }, [expenses, selectedMonth, selectedYear]);

  const deleteExpense = (expenseToDelete) => {
    setExpenses((prevExpenses) =>
      prevExpenses.filter((expense) => expense.id !== expenseToDelete.id)
    );
    toast.success('Xóa khoản chi thành công.', {
      autoClose: 1500,
    });
  };

  const calculateTotalAmount = () => {
    return filteredExpeneses.reduce((acc, expense) => {
      const amount = expense.amount;
      return acc + amount;
    }, 0);
  };

  if (fetchingPayingMoney || fetchingCategories) return <Fallback />;

  return (
    <div className="mt-8 overflow-hidden container mx-auto p-4 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">
        Quản lý khoản chi
      </h2>
      <div className="flex container justify-between mb-3">
        <p className="">
          Tổng tiền đã chi:{' '}
          {money.formatVietnameseCurrency(calculateTotalAmount())}
        </p>
        <p className="">
          Số ngày còn lại trong tháng: {getDateLeftInCurrentMonth()}
        </p>
      </div>

      <div className="flex items-center justify-between mb-2">
        <div>
          <form>
            <Input
              className="border border-solid mr-2 focus:border focus:border-solid border-gray-300 rounded w-full p-1"
              type="text"
              placeholder="Tìm kiếm khoản chi..."
              value={searchInput}
              onChange={handleSearchInput}
              style={{ width: 300 }}
            />
            <Button onClick={handleSearchSubmit} className="text-blue-500">
              <SearchOutlined className="align-baseline	" />
            </Button>
          </form>
        </div>
        <div className="flex items-center">
          <p className="align-middle mr-2">Lọc theo tháng: </p>
          <select
            className="border border-gray-300 bg-white rounded mr-2 p-2"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          >
            <option value="">Tháng</option>
            {[...Array(12).keys()].map((_, i) => (
              <option key={i} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <select
            className="border border-gray-300 bg-white rounded p-2"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            <option className="bg-white" value="">
              Năm
            </option>
            {[...Array(10).keys()].map((_, i) => (
              <option key={i} value={new Date().getFullYear() - i}>
                {new Date().getFullYear() - i}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-4 overflow-x-auto mb-4">
        <table className="w-full">
          <thead className="bg-gray-200 text-left text-gray-600">
            <tr>
              <th className="p-4">Tên khoản chi</th>
              <th className="p-4">Danh mục</th>
              <th className="p-4">Số tiền</th>
              <th className="p-4">Thời gian</th>
              <th className="p-4 ">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpeneses.map((expense, index) => (
              <tr 
                key={expense.id + index} 
                className="border-b cursor-pointer"
            >
                <td className="p-4">{expense.name}</td>
                <td className="p-4">{expense.category}</td>
                <td className="p-4">
                  {money.formatVietnameseCurrency(expense.amount)}
                </td>
                <td className="p-4 ">{expense.date.toLocaleDateString()}</td>
                <td
                  onClick={(e) => e.stopPropagation()}
                  className="p-4 flex items-center space-x-2"
                >
                  <Button onClick={() => {
                    console.log("View Detail button clicked");
                    setSelectedExpense(expense);
                    setExpenseDetailModalOpen(true);
                  }} className="text-blue-500">
                    <FaEye />
                  </Button>
                  <Button onClick={() => {
                    console.log("View Detail button clicked");
                    setSelectedExpense(expense);
                    setEditModalOpen(true);
                  }}>
                    <FaEdit />
                  </Button>
                  <ExpenseManagementDeleteAlert
                    expense={expense}
                    deleteExpense={deleteExpense}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={() =>
          setModalOpen({
            ...modalOpen,
            state: true,
          })
        }
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-2 py-2 px-4 float-right  rounded"
      >
        Thêm khoản chi
      </button>

      <PayingMoneyModal
        type={modalOpen.type}
        open={modalOpen.state}
        setOpen={(state) => setModalOpen({ ...modalOpen, state })}
        payingMoneyData={modalOpen.selectedPayingMoney}
      />

      <ExpensesDetailModal
        open={expenseDetailModalOpen}
        setOpen={setExpenseDetailModalOpen}
        receipt={selectedExpense}
        setEditModalOpen={setEditModalOpen}
        deleteExpense={deleteExpense}
      />

    </div>
  );
};

export default ExpenseManagement;
