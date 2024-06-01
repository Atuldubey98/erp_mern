import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  InputGroup,
  Input,
  InputRightElement,
  Button,
  FormControl,
  FormErrorMessage,
  Tag,
  TagLabel,
  TagCloseButton,
  HStack,
} from "@chakra-ui/react";

export default function PrefixForm({
  isOpen,
  onClose,
  formik,
  currentSelectedPrefix,
}) {
  const [prefix, setPrefix] = useState("");
  const [error, setError] = useState("");
  const prefixes = formik.values.prefixes[currentSelectedPrefix] || [];
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Prefix list</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isInvalid={error}>
            <InputGroup size="md">
              <Input
                pr="4.5rem"
                placeholder="Prefix"
                onChange={(e) => {
                  setPrefix(e.currentTarget.value);
                  setError("");
                }}
                value={prefix}
              />
              <InputRightElement width="4.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={() => {
                    if (prefixes.includes(prefix)) {
                      setError("Already exists");
                      return;
                    }
                    formik.setFieldValue(`prefixes.${currentSelectedPrefix}`, [
                      prefix,
                      ...prefixes,
                    ]);
                    setError("")
                  }}
                >
                  Add
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{error}</FormErrorMessage>
          </FormControl>
          <HStack marginBlock={2} spacing={4}>
            {prefixes.map((prefix) => (
              <Tag size={"md"} key={prefix} variant="solid" colorScheme="blue">
                <TagLabel>{prefix || "NONE"}</TagLabel>
                <TagCloseButton
                  isDisabled={!prefix}
                  onClick={() => {
                    formik.setFieldValue(
                      `prefixes.${currentSelectedPrefix}`,
                      prefixes.filter((item) => item !== prefix)
                    );
                    setError("")
                  }}
                />
              </Tag>
            ))}
          </HStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
