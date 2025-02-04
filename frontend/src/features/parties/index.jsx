import { Box, Flex, Spinner, useDisclosure, useToast } from "@chakra-ui/react";
import { isAxiosError } from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useParties from "../../hooks/useParties";
import usePartyForm from "../../hooks/usePartyForm";
import instance from "../../instance";
import AlertModal from "../common/AlertModal";
import ShowDrawer from "../common/ShowDrawer";
import MainLayout from "../common/main-layout";
import Pagination from "../common/main-layout/Pagination";
import TableLayout from "../common/table-layout";
import SearchItem from "../common/table-layout/SearchItem";
import PartyFormDrawer from "./PartyFormDrawer";
import PartyMenu from "./PartyMenu";
import DisplayPartyDrawer from "./PartyDisplayDrawer";


export default function PartysPage() {
  const {
    isOpen: isDeleteModalOpen,
    onOpen: openDeleteModal,
    onClose: closeDeleteModal,
  } = useDisclosure();
  const {
    isOpen: isPartyFormOpen,
    onClose: onClosePartyFormDrawer,
    onOpen: openPartyFormDrawer,
  } = useDisclosure();
  const {
    isOpen: isPartyDrawerOpen,
    onClose: closePartyDrawer,
    onOpen: openPartyDrawer,
  } = useDisclosure();
  const {
    parties,
    fetchPartys,
    loading,
    currentPage,
    reachedLimit,
    totalPartys,
    totalPages,
  } = useParties();
  const { formik: partyFormik } = usePartyForm(
    fetchPartys,
    onClosePartyFormDrawer
  );
  const [selectedToShowParty, setSelectedToShowParty] = useState(null);
  const onOpenParty = (party) => {
    setSelectedToShowParty(party);
    openPartyDrawer();
  };
  const { orgId = "" } = useParams();
  const [status, setStatus] = useState("idle");
  const deleting = status === "deleting";
  const onOpenPartyToDelete = (party) => {
    setSelectedToShowParty(party);
    openDeleteModal();
  };
  const toast = useToast();
  const onDeleteParty = async () => {
    try {
      setStatus("deleting");
      await instance.delete(
        `/api/v1/organizations/${orgId}/parties/${selectedToShowParty._id}`
      );
      fetchPartys();
      setStatus("idle");
    } catch (err) {
      toast({
        title: isAxiosError(err) ? err.response?.data?.name : "Error",
        description: isAxiosError(err)
          ? err?.response?.data.message || "Network error occured"
          : "Network error occured",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setStatus("idle");
      closeDeleteModal();
    }
  };
  const onCloseParty = () => {
    closePartyDrawer();
    setSelectedToShowParty(null);
  };
  const onOpenDrawerForAddingNewParty = () => {
    partyFormik.setValues({
      name: "",
      billingAddress: "",
      gstNo: "",
      panNo: "",
      shippingAddress: "",
    });
    openPartyFormDrawer();
  };
  const onOpenDrawerForEditingParty = (party) => {
    partyFormik.setValues(party);
    openPartyFormDrawer();
  };
  const navigate = useNavigate();

  return (
    <MainLayout>
      <Box p={4}>
        {loading ? (
          <Flex justifyContent={"center"} alignItems={"center"}>
            <Spinner size={"md"} />
          </Flex>
        ) : (
          <TableLayout
            isAddDisabled={reachedLimit}
            filter={
              <Box maxW={"md"}>
                <SearchItem />
              </Box>
            }
            heading={"Parties"}
            limitKey={"parties"}
            tableData={parties}
            caption={`Total parties found : ${totalPartys}`}
            operations={parties.map((party) => (
              <PartyMenu
                onOpenTransactionsForParty={() => {
                  navigate(`/${orgId}/parties/${party._id}/transactions`);
                }}
                onDeleteParty={onOpenPartyToDelete}
                party={party}
                key={party._id}
                onOpenDrawerForEditingParty={onOpenDrawerForEditingParty}
                onOpenParty={onOpenParty}
              />
            ))}
            selectedKeys={{
              name: "Name",
              billingAddress: "Billing address",
              gstNo: "TAX No.",
            }}
            onAddNewItem={onOpenDrawerForAddingNewParty}
          />
        )}
        <AlertModal
          confirmDisable={deleting}
          body={"Do you want to delete the party ?"}
          header={"Delete party"}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={onDeleteParty}
        />
        <PartyFormDrawer
          formik={partyFormik}
          isOpen={isPartyFormOpen}
          onClose={onClosePartyFormDrawer}
        />
        {selectedToShowParty ? (
          <DisplayPartyDrawer
            isPartyDrawerOpen={isPartyDrawerOpen}
            reachedLimit={reachedLimit}
            selectedToShowParty={selectedToShowParty}
            onCloseParty={onCloseParty}
            onOpenDrawerForAddingNewParty={onOpenDrawerForAddingNewParty}
          />
        ) : null}
        {loading ? null : (
          <Pagination currentPage={currentPage} total={totalPages} />
        )}
      </Box>
    </MainLayout>
  );
}
