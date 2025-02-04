import { Box, Flex, Spinner, useDisclosure } from "@chakra-ui/react";
import { useFormik } from "formik";
import moment from "moment";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import useAsyncCall from "../../hooks/useAsyncCall";
import useCurrentOrgCurrency from "../../hooks/useCurrentOrgCurrency";
import usePaginatedFetch from "../../hooks/usePaginatedFetch";
import instance from "../../instance";
import AlertModal from "../common/AlertModal";
import ShowDrawer from "../common/ShowDrawer";
import MainLayout from "../common/main-layout";
import Pagination from "../common/main-layout/Pagination";
import TableLayout from "../common/table-layout";
import SearchItem from "../common/table-layout/SearchItem";
import VertIconMenu from "../common/table-layout/VertIconMenu";
import ExpenseForm from "./ExpenseForm";
export default function ExpensesPage() {
  const { requestAsyncHandler } = useAsyncCall();
  const { orgId, expenseCategoryId } = useParams();

  const { data, status, fetchFn } = usePaginatedFetch({
    url: `/api/v1/organizations/${orgId}/expenses`,
  });
  const [heading, setHeading] = useState("Expenses");
  const fetchExpenseCategoryById = async () => {
    const { data } = await instance.get(
      `/api/v1/organizations/${orgId}/expenseCategories/${expenseCategoryId}`
    );
    setHeading(`Expenses (${data.data.name})`);
  };
  useEffect(() => {
    if (expenseCategoryId) fetchExpenseCategoryById();
  }, [expenseCategoryId]);
  const { items: expenses, totalPages, currentPage, totalCount } = data;
  const loading = status === "loading";
  const {
    isOpen: isExpenseFormOpen,
    onOpen: openExpenseForm,
    onClose: closeExpenseForm,
  } = useDisclosure();
  const {
    isOpen: isExpenseOpen,
    onOpen: openExpense,
    onClose: closeExpense,
  } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onClose: closeDeleteModal,
    onOpen: openDeleteModal,
  } = useDisclosure();
  const [expenseSelected, setExpenseSelected] = useState(null);
  const onOpenDeleteExpenseModal = (expense) => {
    setExpenseSelected(expense);
    openDeleteModal();
  };
  const [expenseStatus, setExpenseStatus] = useState("idle");
  const formik = useFormik({
    initialValues: {
      description: "",
      amount: 0,
      category: "",
      date: new Date().toISOString().split("T")[0],
    },
    validationSchema: Yup.object({
      description: Yup.string()
        .required("Description is required")
        .label("Description"),
      amount: Yup.number()
        .min(0, "Amount should be mininum 0")
        .required("Amount is required")
        .label("Amount"),
      date: Yup.string().required("Date is required").label("Date"),
    }),
    onSubmit: requestAsyncHandler(async (values, { setSubmitting }) => {
      const { _id, ...expense } = values;
      await instance[_id ? "patch" : "post"](
        `/api/v1/organizations/${orgId}/expenses${_id ? `/${_id}` : ``}`,
        { ...expense, category: expense.category || null }
      );
      fetchFn();
      closeExpenseForm();
      setSubmitting(false);
    }),
  });
  const onAddNewExpense = () => {
    formik.setValues({
      amount: 0,
      category: "",
      date: moment().format("YYYY-MM-DD"),
      description: "",
    });
    formik.setTouched({
      amount: false,
      category: false,
      date: false,
      description: false,
    });
    openExpenseForm();
  };
  const deleteExpense = requestAsyncHandler(async () => {
    if (!expenseSelected) return;
    setExpenseStatus("deleting");
    await instance.delete(
      `/api/v1/organizations/${orgId}/expenses/${expenseSelected._id}`
    );
    fetchFn();
    closeDeleteModal();
    setExpenseStatus("idle");
  });
  const deleting = expenseStatus === "deleting";
  const { symbol } = useCurrentOrgCurrency();

  return (
    <MainLayout>
      <Box p={4}>
        {loading ? (
          <Flex justifyContent={"center"} alignItems={"center"}>
            <Spinner size={"md"} />
          </Flex>
        ) : (
          <TableLayout
            isAddDisabled={data.reachedLimit}
            onAddNewItem={onAddNewExpense}
            filter={
              <Box maxW={"md"}>
                <SearchItem />
              </Box>
            }
            limitKey={"expenses"}
            heading={heading}
            tableData={expenses.map((expense) => ({
              ...expense,
              amount: `${symbol} ${expense.amount}`,
              category: expense.category
                ? expense.category.name
                : "Miscellenous",
              date: moment(expense.date).format("LL"),
            }))}
            caption={`Total expenses found : ${totalCount}`}
            operations={expenses.map((expense) => (
              <VertIconMenu
                editItem={() => {
                  formik.setValues({
                    _id: expense._id,
                    description: expense.description,
                    amount: expense.amount,
                    category: expense.category ? expense.category._id : "",
                    date: moment(expense.date).format("YYYY-MM-DD"),
                  });
                  openExpenseForm();
                }}
                showItem={() => {
                  setExpenseSelected(expense);
                  openExpense();
                }}
                deleteItem={() => {
                  onOpenDeleteExpenseModal(expense);
                }}
              />
            ))}
            selectedKeys={{
              date: "Date",
              category: "Category",
              description: "Description",
              amount: "Amount",
            }}
          />
        )}
        {isExpenseFormOpen ? (
          <ExpenseForm
            isOpen={isExpenseFormOpen}
            formik={formik}
            onClose={closeExpenseForm}
          />
        ) : null}
        {expenseSelected ? (
          <ShowDrawer
            onClickNewItem={onAddNewExpense}
            heading={"Expense"}
            formBtnLabel={"Create New"}
            isOpen={isExpenseOpen}
            disable={data.reachedLimit}
            item={{
              ...expenseSelected,
              date: moment(expenseSelected.date).format("DD-MM-YYYY"),
              amount: `${symbol} ${expenseSelected.amount}`,
              category: expenseSelected.category
                ? expenseSelected.category.name
                : "Miscellenous",
            }}
            onClose={closeExpense}
            selectedKeys={{
              date: "Date",
              category: "Category",
              description: "Description",
              amount: "Amount",
            }}
          />
        ) : null}
        <AlertModal
          confirmDisable={deleting}
          body={"Do you want to delete the expense ?"}
          header={"Delete expense"}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={deleteExpense}
        />
        {loading ? null : (
          <Pagination currentPage={currentPage} total={totalPages} />
        )}
      </Box>
    </MainLayout>
  );
}
