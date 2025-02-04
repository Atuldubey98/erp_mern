import { useFormik } from "formik";
import { useParams } from "react-router-dom";
import * as Yup from "yup";

import useAsyncCall from "./useAsyncCall";
import instance from "../instance";

const partyDto = Yup.object({
  name: Yup.string()
    .min(3, "Cannot be less than 2")
    .max(80, "Cannot be greater than 80")
    .required("Please give party name")
    .label("Name"),
  shippingAddress: Yup.string()
    .max(150, "Cannot be greater than 80")
    .label("Shipping address")
    .optional(),
  billingAddress: Yup.string()
    .min(3, "Cannot be less than 2")
    .max(150, "Cannot be greater than 80")
    .label("Billing address"),
  gstNo: Yup.string().label("GST Number"),
  panNo: Yup.string().label("PAN Number"),
});
export default function usePartyForm(onAddedFetch, onCloseDrawer) {
  const { requestAsyncHandler } = useAsyncCall();
  const { orgId = "" } = useParams();
  const formik = useFormik({
    initialValues: {
      name: "",
      billingAddress: "",
      gstNo: "",
      panNo: "",
      shippingAddress: "",
    },
    validationSchema: partyDto,
    validateOnChange: false,
    onSubmit: requestAsyncHandler(async (values, { setSubmitting }) => {
      const { name, shippingAddress, billingAddress, gstNo, panNo, _id } =
        values;
      const party = {
        name,
        shippingAddress,
        billingAddress,
        gstNo,
        org: orgId,
        panNo,
      };
      let partyId = _id;
      if (_id)
        await instance.patch(
          `/api/v1/organizations/${orgId}/parties/${_id}`,
          party
        );
      else {
        const response = await instance.post(
          `/api/v1/organizations/${orgId}/parties`,
          party
        );
        partyId = response.data.data._id;
      }
      setSubmitting(false);
      onCloseDrawer();
      if (onAddedFetch) onAddedFetch({ ...values, _id: partyId });
      formik.resetForm();
    }),
  });
  return { formik };
}
