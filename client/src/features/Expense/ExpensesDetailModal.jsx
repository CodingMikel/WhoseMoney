import React from 'react';
import { Button, Modal } from 'antd';
import useGlobalModalStore from '~/store/useGlobalModalStore';
import { formatDate } from '~/utils/time';
import { money, objUtils } from '~/utils';
import axiosClient from '~/axios';

const ExpensesDetailModal = ({
  expense,
  setEditModalOpen,
  deleteExpense,
  open,
  setOpen,
}) => {
  const [setConfirmModal, resetConfirmModal] = useGlobalModalStore((state) => [
    state.setConfirmModal,
    state.resetConfirmModal,
  ]);

  if (!expense || objUtils.isEmptyObject(expense)) {
    return <></>;
  }

  return (
    <Modal
      width={480}
      title="Chi tiết khoản chi"
      open={open}
      onCancel={() => setOpen(false)}
      centered
      className="custom-modal"
      footer={null}
    // zIndex={1000}
    >
      <div className="flex flex-col">
        <header className="text-xl font-medium flex items-center justify-center mt-2 mb-4">
          {expense?.name}
          {/* Luong hang thang */}
        </header>

        <div className="grid grid-cols-2 gap-4 pb-8">
          {/* Source */}
          <div className="text-center text-base font-medium truncate">
            Nguồn tiền
          </div>
          <div className="text-base text-center truncate">
            {expense?.source}
            {/* Cong ty ABC */}
          </div>

          {/* Amount */}
          <div className="text-center text-base font-medium truncate">
            Số tiền
          </div>
          <div className="text-base text-center truncate">
            {money.formatVietnameseCurrency(expense?.amount)}
            {/* 10.000.000 */}
          </div>

          {/* Date */}
          <div className="text-center text-base font-medium truncate">
            Thời gian
          </div>
          <div className="text-base text-center truncate">
            {formatDate(new Date(expense?.date))}
            {/* 01/10/2023 */}
          </div>

          {/* Before balance */}
          <div className="text-center text-base font-medium truncate">
            Sô dư trước
          </div>
          <div className="text-base text-center truncate">
            {/* {expense?.before_balance} */}
            10.000.000
          </div>

          {/* After balance */}
          <div className="text-center text-base font-medium truncate">
            Số dư sau
          </div>
          <div className="text-base text-center truncate">
            {/* {expense?.after_balance} */}
            20.000.000
          </div>
        </div>

        <footer className="flex items-center justify-center gap-4">
          <Button
            onClick={() =>
              setConfirmModal({
                open: true,
                title: 'Xác nhận xóa',
                content: 'Bạn có chắc muốn xóa khoản chi này?',
                handleCancel: () => resetConfirmModal(),
                handleOk: () => {
                  deleteExpense(expense);
                  resetConfirmModal();
                  setTimeout(() => {
                    setOpen(false);
                  }, 0);

                  axiosClient
                    .delete(`/spending-money/${expense.id}`)
                    .catch((error) => {
                      console.log(error);
                    });
                },
              })
            }
            danger
            size="large"
          >
            Xóa
          </Button>
          <Button
            type="default"
            size="large"
            onClick={() => setEditModalOpen(true)}
          >
            Chỉnh sửa
          </Button>
        </footer>
      </div>
    </Modal>
  );
};

export default ExpensesDetailModal;
