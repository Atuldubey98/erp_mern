import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import React from "react";
import { FcSearch } from "react-icons/fc";

export default function SearchCustomer() {
  return (
    <InputGroup>
      <InputLeftElement pointerEvents="none">
        <FcSearch color="gray.300" />
      </InputLeftElement>
      <Input type="tel" placeholder="Search customers" />
    </InputGroup>
  );
}
