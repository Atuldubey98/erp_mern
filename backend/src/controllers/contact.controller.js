const { contactDto } = require("../dto/contact.dto");
const requestAsyncHandler = require("../handlers/requestAsync.handler");
const Party = require("../models/party.model");
const { PartyNotFound } = require("../errors/party.error");
const Contact = require("../models/contacts.model");
const { ContactNotFound } = require("../errors/contact.error");
exports.createContact = requestAsyncHandler(async (req, res) => {
  const body = await contactDto.validateAsync(req.body);
  if (body.party) {
    const party = await Party.findById(body.party);
    if (!party) throw new PartyNotFound();
  }
  const contact = await Contact.create({ ...body, org: req.params.orgId });
  return res.status(200).json({ data: contact });
});

exports.getContacts = requestAsyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const filter = {
    org: req.params.orgId,
  };
  const search = req.query.search || "";
  const type = req.query.type;
  const partyId = req.query.partyId;
  if (search) filter.$text = { $search: search };
  if (type) filter.type = type;
  if (partyId) filter.party = partyId;
  const totalPartys = await Contact.countDocuments(filter);
  const totalPages = Math.ceil(totalPartys / limit);

  const skip = (page - 1) * limit;
  const contacts = await Contact.find(filter)
    .populate("party")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  return res.status(200).json({
    page,
    limit,
    totalPages,
    total: totalPartys,
    data: contacts,
  });
});

exports.updateContact = requestAsyncHandler(async (req, params) => {
  const body = await contactDto.validateAsync(req.body);
  const updatedContact = await Contact.findOneAndUpdate(
    {
      _id: req.params.id,
      org: req.params.orgId,
    },
    body
  );
  if (!updatedContact) throw new ContactNotFound();
  return res
    .status(200)
    .json({ data: updatedContact, message: "Contact updated" });
});
exports.deleteContact = requestAsyncHandler(async (req, params) => {
  const deletedContact = await Contact.findOneAndDelete({
    _id: req.params.id,
    org: req.params.orgId,
  });
  if (!deletedContact) throw new ContactNotFound();
  return res.status(200).json({ message: "Contact deleted" });
});

exports.getContact = requestAsyncHandler(async (req, params) => {
  const contact = await Contact.findOne({
    _id: req.params.id,
    org: req.params.orgId,
  }).populate("party");
  if (!contact) throw new ContactNotFound();
  return res.status(200).json({ data: contact });
});
