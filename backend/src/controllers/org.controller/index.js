const create = require("./create");
const createOrgUser = require("./createOrgUser");
const read = require("./read");
const closeFinanialYear = require("./closeFinancialYear");
const getUserOrgs = require("./getUserOrgs");
const getUsersOfOrganization = require("./getUsersOfOrganization");
const update = require("./update");
const updateOrgUser = require("./updateOrgUser");
const uploadLogo = require("./uploadLogo");
const removeLogo = require("./removeLogo");
module.exports = {
  createOrgUser,
  create,
  uploadLogo,
  removeLogo,
  read,
  closeFinanialYear,
  getUserOrgs,
  getUsersOfOrganization,
  update,
  updateOrgUser,
};
