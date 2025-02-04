import {
  Box,
  Link as ChakraLink,
  Flex,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { isAxiosError } from "axios";
import moment from "moment";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { invoiceStatusList } from "../../../constants/invoice";
import useCurrentOrgCurrency from "../../../hooks/useCurrentOrgCurrency";
import useDateFilterFetch from "../../../hooks/useDateFilterFetch";
import instance from "../../../instance";
import AlertModal from "../../common/AlertModal";
import MainLayout from "../../common/main-layout";
import Pagination from "../../common/main-layout/Pagination";
import TableLayout from "../../common/table-layout";
import VertIconMenu from "../../common/table-layout/VertIconMenu";
import BillModal from "../../estimates/list/BillModal";
import Status from "../../estimates/list/Status";
import RecordPaymentModal from "./RecordPaymentModal";
import TableDateFilter from "./TableDateFilter";
import useAsyncCall from "../../../hooks/useAsyncCall";
import ExporterModal from "../../common/ExporterModal";
import ShareBillModal from "../../common/ShareBillModal";
import useAuth from "../../../hooks/useAuth";
export default function InvoicesPage() {
  const {
    items: invoices,
    reachedLimit,
    dateFilter,
    onChangeDateFilter,
    currentPage,
    totalPages,
    totalCount,
    fetchItems: fetchInvoices,
    status,
  } = useDateFilterFetch({
    entity: "invoices",
  });
  const auth = useAuth();
  const loading = status === "loading";
  const navigate = useNavigate();
  const { symbol } = useCurrentOrgCurrency();

  const invoiceTableMapper = (invoice) => ({
    partyName: (
      <ChakraLink
        to={`/${orgId}/parties/${invoice.party._id}/transactions`}
        as={Link}
      >
        {invoice.party.name}
      </ChakraLink>
    ),
    ...invoice,
    date: moment(invoice.date).format("LL"),
    grandTotal: `${symbol} ${(invoice.total + invoice.totalTax).toFixed(2)}`,
    status: <Status status={invoice.status} statusList={invoiceStatusList} />,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [invoice, setInvoice] = useState(null);
  const onOpenInvoice = (currentInvoice) => {
    setInvoice(currentInvoice);
    onOpen();
  };
  const { orgId } = useParams();
  const {
    isOpen: isDeleteModalOpen,
    onClose: onCloseDeleteModal,
    onOpen: onOpenDeleteModal,
  } = useDisclosure();
  const [invoiceStatus, setInvoiceStatus] = useState("idle");
  const toast = useToast();
  const deleteInvoice = async (invoice) => {
    try {
      if (!invoice) return;
      setInvoiceStatus("deleting");
      await instance.delete(
        `/api/v1/organizations/${orgId}/invoices/${invoice._id}`
      );
      onCloseDeleteModal();
      fetchInvoices();
    } catch (error) {
      toast({
        title: isAxiosError(error) ? error.response.data.name : "Error",
        description: isAxiosError(error)
          ? error.response.data.message
          : "Some error occured",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setInvoiceStatus("idle");
    }
  };
  const deleting = invoiceStatus === "deleting";
  const onClickAddNewInvoice = () => {
    navigate(`create`);
  };
  const { requestAsyncHandler } = useAsyncCall();
  const onSaveBill = requestAsyncHandler(async (item) => {
    const currentInvoice = item || invoice;
    const downloadBill = `/api/v1/organizations/${
      currentInvoice.org._id
    }/invoices/${currentInvoice._id}/download?template=${
      localStorage.getItem("template") || "simple"
    }`;
    const { data } = await instance.get(downloadBill, {
      responseType: "blob",
    });
    const href = URL.createObjectURL(data);
    const link = document.createElement("a");
    link.setAttribute("download", `Invoice-${currentInvoice.num}.pdf`);
    link.href = href;
    link.click();
    URL.revokeObjectURL(href);
  });
  const downloading = invoiceStatus === "downloading";
  const {
    isOpen: isRecordPaymentModalOpen,
    onOpen: openRecordPaymentModal,
    onClose: closeRecordPaymentModal,
  } = useDisclosure();
  const { isOpen: isExportModalOpen, onToggle: toggleExportModal } =
    useDisclosure();
  const { isOpen: isShareModalOpen, onToggle: toggleShareModal } =
    useDisclosure();

  return (
    <MainLayout>
      <Box p={4}>
        {loading ? (
          <Flex justifyContent={"center"} alignItems={"center"}>
            <Spinner size={"md"} />
          </Flex>
        ) : (
          <TableLayout
            filter={
              <TableDateFilter
                dateFilter={dateFilter}
                onChangeDateFilter={onChangeDateFilter}
              />
            }
            limitKey={"invoices"}
            showExport={{
              onExport: toggleExportModal,
              status: "idle",
            }}
            isAddDisabled={reachedLimit}
            heading={"Invoices"}
            tableData={invoices.map(invoiceTableMapper)}
            caption={`Total invoices found : ${totalCount}`}
            operations={invoices.map((invoice) => (
              <VertIconMenu
                recordPayment={() => {
                  setInvoice(invoice);
                  openRecordPaymentModal();
                }}
                shareItem={() => {
                  setInvoice(invoice);
                  toggleShareModal();
                }}
                openItem={() => {
                  navigate(`/${orgId}/receipt/invoices/${invoice._id}`);
                }}
                showItem={() => onOpenInvoice(invoice)}
                downloading={downloading}
                onDownloadItem={() => {
                  onSaveBill(invoice);
                }}
                editItem={() => {
                  navigate(`${invoice._id}/edit`);
                }}
                deleteItem={() => {
                  setInvoice(invoice);
                  onOpenDeleteModal();
                }}
              />
            ))}
            selectedKeys={{
              num: "Invoice No.",
              date: "Invoice Date",
              partyName: "Recipient",
              status: "Status",
              grandTotal: "Total",
            }}
            onAddNewItem={onClickAddNewInvoice}
          />
        )}
        {invoice ? (
          <BillModal
            bill={invoice}
            entity={"invoices"}
            heading={"Invoice"}
            isOpen={isOpen}
            onSaveBill={onSaveBill}
            onClose={onClose}
          />
        ) : null}
        {invoice ? (
          <ShareBillModal
            bill={invoice}
            isOpen={isShareModalOpen}
            onClose={toggleShareModal}
            billType={"invoices"}
          />
        ) : null}
        <AlertModal
          confirmDisable={deleting}
          body={"Do you want to delete the invoice ?"}
          header={"Delete Invoice"}
          isOpen={isDeleteModalOpen}
          onClose={onCloseDeleteModal}
          onConfirm={() => deleteInvoice(invoice)}
        />
        {invoice ? (
          <RecordPaymentModal
            invoice={invoice}
            fetchInvoices={fetchInvoices}
            isOpen={isRecordPaymentModalOpen}
            onClose={closeRecordPaymentModal}
          />
        ) : null}

        {loading ? null : (
          <Pagination currentPage={currentPage} total={totalPages} />
        )}
        {isExportModalOpen ? (
          <ExporterModal
            isOpen={isExportModalOpen}
            onClose={toggleExportModal}
            downloadUrl={`/api/v1/organizations/${orgId}/invoices/export?startDate=${dateFilter.startDate}&endDate=${dateFilter.endDate}`}
            defaultSelectedFields={{
              partyName: "Party Name",
              billingAddress: "Billing Address",
              total: "Total",
              totalTax: "Total Tax",
              date: "Date",
              num: "Number",
              status: "Status",
              grandTotal: "Grand Total",
            }}
            selectableFields={{
              createdByEmail: "Created By Email",
              createdByName: "Created By Name",
              poNo: "PO Number",
              poDate: "PO Date",
              cgst: "CGST",
              igst: "IGST",
              sgst: "SGST",
              vat: "VAT",
              cess: "Cess",
              sal: "SAL",
              others: "Other taxes",
            }}
          />
        ) : null}
      </Box>
    </MainLayout>
  );
}
