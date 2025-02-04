import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Hide,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton
} from "@chakra-ui/react";
import { useState } from "react";
import { CiSaveDown2 } from "react-icons/ci";
import { IoPrintOutline } from "react-icons/io5";
import useAsyncCall from "../../../hooks/useAsyncCall";
import instance, { baseURL } from "../../../instance";
import Template from "./Template";
export default function BillModal({ onClose, isOpen, bill, entity, heading }) {
  const { requestAsyncHandler } = useAsyncCall();
  const [status, setStatus] = useState("idle");
  const [billLoadStatus, setBillLoadStatus] = useState("loading");
  const [templateName, setTemplateName] = useState("simple");
  const onSaveBill = async () => {
    setStatus("downloading");
    const downloadBill = `/api/v1/organizations/${bill.org._id}/${entity}/${bill._id}/download?template=${templateName}`;
    const { data } = await instance.get(downloadBill, {
      responseType: "blob",
    });
    const href = URL.createObjectURL(data);
    const link = document.createElement("a");
    link.setAttribute("download", `${heading}-${bill.date}.pdf`);
    link.href = href;
    link.click();
    setStatus("idle");
    URL.revokeObjectURL(href);
  };
  const viewBill = `/api/v1/organizations/${bill.org._id}/${entity}/${bill._id}/view?template=${templateName}`;
  const onPrintBill = requestAsyncHandler(async () => {
    setStatus("printing");
    const { data } = await instance.get(viewBill);
    const billPrint = window.open("", "");
    billPrint.document.write(data);
    billPrint.document.close();
    billPrint.onload = function () {
      billPrint.focus();
      billPrint.print();
      billPrint.close();
    };
    setStatus("success");
  });
  const isBillLoading = billLoadStatus === "idle";
  const templates = [
    { value: "simple", label: "Simple", templateImg: "/templates/simple.png" },
    { value: "modern", label: "Modern", templateImg: "/templates/modern.png" },
    {
      value: "border-land",
      label: "Border-land",
      templateImg: "/templates/border-land.png",
    },
  ];
  const onSelectTemplate = (currentTemplate) => {
    setTemplateName(currentTemplate.value);
    localStorage.setItem("template", currentTemplate.value);
    setBillLoadStatus("loading");
  };
  const isDownloading = status === "downloading";
  const isPrinting = status === "printing";
  return (
    <Modal
      size={"full"}
      onClose={onClose}
      isOpen={isOpen}
      scrollBehavior={"inside"}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{heading}</ModalHeader>
        <ModalCloseButton />
        <ModalBody h={"100%"}>
          <Skeleton w={"100%"} h={"65svh"} isLoaded={isBillLoading}>
            <iframe
              onLoad={() => {
                setBillLoadStatus("idle");
              }}
              style={{
                margin: "auto",
                padding: 1,
                borderRadius: 10,
                border: "none",
                zoom: 0.8,
              }}
              width={"100%"}
              height={"100%"}
              src={`${baseURL}${viewBill}`}
            />
          </Skeleton>
          <Box>
            <Flex justifyContent={"flex-start"} gap={3}>
              {templates.map((template) => (
                <Template
                  key={template.value}
                  template={template}
                  currentTemplateName={templateName}
                  onSelectTemplate={onSelectTemplate}
                />
              ))}
            </Flex>
          </Box>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button onClick={onClose}>Close</Button>
            <Hide below="md">
              <Button
                leftIcon={<IoPrintOutline />}
                onClick={onPrintBill}
                colorScheme="blue"
                isLoading={isPrinting}
              >
                Print
              </Button>
            </Hide>
            <Button
              leftIcon={<CiSaveDown2 />}
              isLoading={isDownloading}
              onClick={() => {
                onSaveBill(bill);
              }}
              colorScheme="green"
            >
              Download
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
