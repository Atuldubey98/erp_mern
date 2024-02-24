const Joi = require("joi");
const itemSchema = Joi.object({
  name: Joi.string().required().label("Item name"),
  price: Joi.number().required().label("Price"),
  quantity: Joi.number().required().label("Quantity"),
  code: Joi.string().allow("").optional().label("Code"),
  um: Joi.string().default("none").label("Unit of measurement"),
  gst: Joi.string().default("none").label("GST applicable"),
});

const invoiceDto = Joi.object({
  customer: Joi.string().required().label("Customer"),
  description: Joi.string().optional().allow("").label("Description"),
  terms: Joi.string().optional().allow("").label("Terms and Conditions"),
  items: Joi.array().items(itemSchema).required().label("Invoice Items"),
  date: Joi.date().required().label("Invoice date"),
  invoiceNo: Joi.number().label("Invoice No.").required(),
  status: Joi.string()
    .default("draft")
    .valid("draft", "sent", "paid")
    .label("Status"),
  createdBy: Joi.string().optional().label("Created By"),
  updatedBy: Joi.string().optional().label("Updated By"),
}).options({ stripUnknown: true });

module.exports = { invoiceDto };
