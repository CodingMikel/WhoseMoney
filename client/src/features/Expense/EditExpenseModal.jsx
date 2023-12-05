import { DatePicker, Input, Modal } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import axiosClient from '~/axios';
import useGlobalModalStore from '~/store/useGlobalModalStore';
import { objUtils } from '~/utils';
import { formatDate } from '~/utils/time';

const EditExpenseModal = ({
  expense,
  setSelectedExpense,
  editExpense,
  open,
  setOpen,
}) => {
  const [newExpense, setNewExpense] = useState(expense);

  const [setConfirmModal, resetConfirmModal] = useGlobalModalStore((state) => [
    state.setConfirmModal,
    state.resetConfirmModal,
  ]);

  useEffect(() => {
    setNewExpense(expense);
  }, [expense.id]);

  const handleCancel = () => {
    if (objUtils.compareObj(expense, newExpense)) {
      setConfirmModal({
        open: true,
        title: 'Hủy thay đổi',
        content: 'Sau khi hủy những thông tin đã điền sẽ không được lưu.',
        handleCancel: () => resetConfirmModal(),
        handleOk: () => {
          resetConfirmModal();
          setTimeout(() => {
            setOpen(false);
          }, 0);
        },
      });
    } else setOpen(false);
  };

  const handleOk = () => {
    newExpense.amount = Number(newExpense.amount);
    setOpen(false);
    setSelectedExpense(newExpense);
    editExpense(newExpense);

    axiosClient
      .patch(`/earning-money/${expense.id}`, newExpense)
      .catch((err) => console.error(err));
  };

  return (
    <Modal
      // title={`Chỉnh sửa ${expense.name}`}
      title="Chỉnh sửa khoản thu"
      open={open}
      centered
      onCancel={handleCancel}
      onOk={handleOk}
      width={525}
      className="custom-modal"
      zIndex={1002}
    >
      <div className="flex flex-col pt-6 pb-4">
        <div className="grid grid-cols-[120px_1fr] gap-6 items-center">
          {/* Name */}
          <div className="text-base font-medium truncate">Tên khoản thu</div>
          <div>
            <Input
              placeholder="Enter name here"
              value={newExpense.name}
              onChange={(e) =>
                setNewExpense({ ...newExpense, name: e.target.value })
              }
            />
          </div>

          {/* Source */}
          <div className="text-base font-medium truncate">Nguồn tiền</div>
          <div>
            <Input
              placeholder="Enter money source here"
              value={newExpense.source}
              onChange={(e) =>
                setNewExpense({ ...newExpense, source: e.target.value })
              }
            />
          </div>

          {/* Amount */}
          <div className="text-base font-medium truncate">Số tiền</div>
          <div>
            <Input
              placeholder="Enter amount here"
              value={newExpense.amount}
              onChange={(e) =>
                setNewExpense({ ...newExpense, amount: e.target.value })
              }
            />
          </div>

          {/* Date */}
          <div className="text-base font-medium truncate">Ngày</div>
          <div>
            <DatePicker
              style={{ width: '100%' }}
              onChange={(date) => {
                console.log(date);
                setNewExpense({ ...newExpense, date: formatDate(date['$d']) });
              }}
              value={dayjs(new Date(newExpense.date))}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditExpenseModal;
