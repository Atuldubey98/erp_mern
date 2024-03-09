import { Link, Text } from "@chakra-ui/react";
import React from "react";
import { SiMicrosoftexcel } from "react-icons/si";
import { useParams } from "react-router-dom";

export default function ExportButton({ dateFilter }) {
  const { orgId, reportType } = useParams();

  return (
    <>
      <Link
        _hover={{
          textTransform: "none",
          bg: "blue.600",
        }}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        gap={3}
        fontWeight={"bold"}
        borderRadius={"md"}
        bg={"blue.500"}
        padding={2}
        colorScheme="green"
        fontSize={"md"}
        href={`http://localhost:9000/api/v1/organizations/${orgId}/reports/${reportType}/download?startDate=${dateFilter.startDate}&endDate=${dateFilter.endDate}`}
      >
        <Text>Export</Text>
        <SiMicrosoftexcel />
      </Link>
    </>
  );
}
