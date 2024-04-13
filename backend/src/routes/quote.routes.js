const { Router } = require("express");
const {
  checkOrgAuthorization,
} = require("../middlewares/organization.middleware");
const {
  createModel,
  updateModel,
  paginateModel,
} = require("../middlewares/crud.middleware");
const { authenticate } = require("../middlewares/auth.middleware");
const {
  createQuote,
  updateQuote,
  getQuote,
  getQuotes,
  getNextQuotationNumber,
  viewQuote,
  deleteQuote,
  downloadQuote,
  convertQuoteToInvoice,
} = require("../controllers/quotes.controller");
const quoteRouter = Router({
  mergeParams: true,
});

quoteRouter.post(
  "/",
  authenticate,
  createModel,
  checkOrgAuthorization,
  createQuote
);

quoteRouter.get(
  "/nextQuoteNo",
  authenticate,
  checkOrgAuthorization,
  getNextQuotationNumber
);
quoteRouter.get("/:quoteId", authenticate, checkOrgAuthorization, getQuote);

quoteRouter.post(
  "/:quoteId/convertToInvoice",
  authenticate,
  checkOrgAuthorization,
  convertQuoteToInvoice
);
quoteRouter.delete(
  "/:quoteId",
  authenticate,
  checkOrgAuthorization,
  deleteQuote
);
quoteRouter.get(
  "/",
  authenticate,
  checkOrgAuthorization,
  paginateModel,
  getQuotes
);

quoteRouter.patch(
  "/:quoteId",
  authenticate,
  updateModel,
  checkOrgAuthorization,
  updateQuote
);
quoteRouter.get(
  "/:quoteId/view",
  authenticate,
  checkOrgAuthorization,
  viewQuote
);
quoteRouter.get(
  "/:quoteId/download",
  authenticate,
  checkOrgAuthorization,
  downloadQuote
);

module.exports = quoteRouter;
