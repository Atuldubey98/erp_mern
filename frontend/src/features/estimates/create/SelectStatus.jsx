import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import { statusList } from "./data";

export default function SelectStatus({ formik }) {
  return (
    <FormControl
      isRequired
      isInvalid={formik.errors.status && formik.touched.status}
    >
      <FormLabel>Status</FormLabel>
      <Select value={formik.values.status} onChange={formik.handleChange} name="status">
        {statusList.map((status) => (
          <option key={status.type} value={status.type}>
            {status.label}
          </option>
        ))}
      </Select>
    </FormControl>
  );
}
