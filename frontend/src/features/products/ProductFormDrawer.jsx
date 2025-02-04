import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  Input,
  SimpleGrid,
  Textarea,
} from "@chakra-ui/react";
import FormDrawerLayout from "../common/form-drawer-layout";
import { Select } from "chakra-react-select";
import NumberInputInteger from "../common/NumberInputInteger";
import ProductCategoryAsyncSelect from "./ProductCategoryAsyncSelect";
import useUms from "../../hooks/useUms";
export default function ProductFormDrawer({ isOpen, onClose, formik }) {
  const typeOfProducts = [
    { value: "service", label: "Service" },
    { value: "goods", label: "Goods" },
  ];
  const { ums } = useUms();
  const umOptions = ums.map((um) => ({
    value: um._id,
    label: um.name,
  }));
  const selectedUm = umOptions.find((um) => um.value === formik.values.um);
  return (
    <FormDrawerLayout
      isSubmitting={formik.isSubmitting}
      formBtnLabel={formik.values._id ? "Update" : "Add"}
      formHeading={
        formik.values._id ? "Update product form" : "New Product form"
      }
      handleFormSubmit={formik.handleSubmit}
      isOpen={isOpen}
      onClose={onClose}
    >
      <Grid gap={4}>
        <FormControl
          isRequired
          isInvalid={formik.errors.name && formik.touched.name}
        >
          <FormLabel>Item Name</FormLabel>
          <Input
            autoFocus
            onChange={formik.handleChange}
            name="name"
            type="text"
            value={formik.values.name}
            placeholder="Product Name"
          />
          <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
        </FormControl>
        <FormControl
          isInvalid={formik.errors.category && formik.errors.category}
        >
          <FormLabel>Category</FormLabel>
          <ProductCategoryAsyncSelect formik={formik} />
          <FormErrorMessage>{formik.errors.category}</FormErrorMessage>
        </FormControl>
        <FormControl
          isRequired
          isInvalid={formik.errors.type && formik.touched.type}
        >
          <FormLabel>Type of product</FormLabel>
          <Select
            options={typeOfProducts}
            onChange={({ value }) => {
              formik.setFieldValue("type", value);
            }}
            name="type"
            value={typeOfProducts.find(
              (productType) => productType.value === formik.values.type
            )}
          />
          <FormErrorMessage>{formik.errors.type}</FormErrorMessage>
        </FormControl>
        <FormControl
          isRequired
          isInvalid={formik.errors.um && formik.touched.um}
        >
          <FormLabel>Unit of Measurement</FormLabel>
          <Select
            name={`um`}
            value={selectedUm}
            onChange={({ value }) => {
              formik.setFieldValue(`um`, value);
            }}
            options={umOptions}
          />
          <FormErrorMessage>{formik.errors.um}</FormErrorMessage>
        </FormControl>
        <SimpleGrid minChildWidth={200} gap={2}>
          <FormControl
            isRequired
            isInvalid={formik.errors.costPrice && formik.touched.costPrice}
          >
            <FormLabel>Cost Price</FormLabel>
            <NumberInputInteger name={"costPrice"} formik={formik} />
            <FormErrorMessage>{formik.errors.costPrice}</FormErrorMessage>
          </FormControl>
          <FormControl
            isRequired
            isInvalid={
              formik.errors.sellingPrice && formik.touched.sellingPrice
            }
          >
            <FormLabel>Selling Price</FormLabel>
            <NumberInputInteger name={"sellingPrice"} formik={formik} />
            <FormErrorMessage>{formik.errors.sellingPrice}</FormErrorMessage>
          </FormControl>
        </SimpleGrid>

        <FormControl isInvalid={formik.errors.code && formik.touched.code}>
          <FormLabel>HSN Code or SAC Code</FormLabel>
          <Input
            onChange={formik.handleChange}
            name="code"
            type="text"
            value={formik.values.code}
            placeholder="Code"
          />
          <FormErrorMessage>{formik.errors.code}</FormErrorMessage>
        </FormControl>
        <FormControl
          isInvalid={formik.errors.description && formik.touched.description}
        >
          <FormLabel>Description</FormLabel>
          <Textarea
            onChange={formik.handleChange}
            name="description"
            type="text"
            value={formik.values.description}
            placeholder="Product Description"
          />
          <FormErrorMessage>{formik.errors.description}</FormErrorMessage>
        </FormControl>
      </Grid>
    </FormDrawerLayout>
  );
}
