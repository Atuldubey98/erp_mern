const Joi = require("joi");
const itemSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  quantity: Joi.number().required(),
  um: Joi.string().default("none"),
  code: Joi.string().label("HSN/SAC Code").allow(""),
  tax: Joi.string().default("none"),
});

const purchaseOrderDto = Joi.object({
  party: Joi.string().required().label("Party"),
  org: Joi.string().required().label("Party"),
  sequence: Joi.number().required(),
  discount: Joi.number()
    .default(0)
    .label("Discount")
    .min(0)
    .max(100)
    .optional(),
  date: Joi.string().required().label("PO Date"),
  prefix: Joi.string().label("Prefix").allow("").optional(),
  description: Joi.string().allow("").label("Description"),
  billingAddress: Joi.string().required().label("Billing Address"),
  items: Joi.array().items(itemSchema).required().label("Items"),
  terms: Joi.string().allow("").label("Terms"),
  num: Joi.string().default("").allow(""),
  status: Joi.string()
    .default("draft")
    .valid("draft", "sent", "paid")
    .label("Status"),
  createdBy: Joi.string().optional().label("Created By"),
  updatedBy: Joi.string().optional().label("Updated By"),
}).options({ stripUnknown: true });

module.exports = { purchaseOrderDto };
