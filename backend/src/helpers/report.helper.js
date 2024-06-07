const xl = require("excel4node");
const reportDataByType = {
  sale: {
    header: {
      num: "Invoice Number",
      partyName: "Party Name",
      address: "Party Address",
      date: "Date",
      totalTax: "Total Tax",
      poNo: "Purchase Order Number",
      poDate: "Purchase Order Date",
      grandTotal: "Grand Total",
      status: "Status",
    },
    bodyMapper: (item) => ({
      _id: item._id,
      partyName: item.party?.name,
      address: item.party?.billingAddress,
      poNo: item.poNo,
      poDate: item.poDate ? new Date(item.poDate).toLocaleDateString() : "",
      num: item.num,
      date: new Date(item.date).toLocaleDateString(),
      totalTax: item.totalTax.toFixed(2),
      grandTotal: (item.totalTax + item.total).toFixed(2),
      status: (item?.status || "").toLocaleUpperCase(),
    }),
  },
  purchase: {
    header: {
      num: "Purchase Number",
      partyName: "Party Name",
      date: "Date",
      totalTax: "Total Tax",
      grandTotal: "Grand Total",
      status: "Status",
    },

    bodyMapper: (item) => ({
      _id: item._id,
      partyName: item.party?.name,
      num: item.num,
      date: new Date(item.date).toLocaleDateString(),
      totalTax: item.totalTax.toFixed(2),
      grandTotal: (item.totalTax + item.total).toFixed(2),
      status: (item?.status || "").toLocaleUpperCase(),
    }),
  },
  transactions: {
    header: {
      type: "Type",
      amount: "Amount",
      relatedTo: "Related To",
      createdAt: "Done at",
      num: "Num",
    },
    bodyMapper: (item) => ({
      _id: item._id,
      num: item.doc?.num,
      type: item?.docModel,
      relatedTo: item?.party?.name || item.doc?.description || "",
      amount: (item.total + item.totalTax).toFixed(2),
      createdAt: new Date(item.createdAt).toISOString().split("T")[0],
    }),
  },
  gstr1: {
    header: {
      gstNo: "Party GST No",
      partyName: "Party Name",
      date: "Invoice Date",
      num: "Invoice No.",
      cgst: "CGST",
      sgst: "SGST",
      igst: "IGST",
      grandTotal: "Grand Total",
    },
    bodyMapper: (item) => ({
      _id: item._id,
      partyName: item.party?.name,
      num: item.num,
      date: new Date(item.date).toLocaleDateString(),
      gstNo: item.party?.gstNo,
      cgst: item.cgst.toFixed(2),
      sgst: item.sgst.toFixed(2),
      igst: item.igst.toFixed(2),
      grandTotal: (item?.total + item?.totalTax).toFixed(2),
    }),
  },
  gstr2: {
    header: {
      gstNo: "Party GST No",
      partyName: "Party Name",
      num: "Invoice no",
      date: "Purchase Date",
      cgst: "IGST",
      sgst: "IGST",
      igst: "IGST",
      grandTotal: "Grand Total",
    },
    bodyMapper: (item) => ({
      _id: item._id,
      partyName: item.party?.name,
      num: item.num,
      gstNo: item.party?.gstNo,
      date: new Date(item.date).toLocaleDateString(),
      cgst: item.cgst.toFixed(2),
      sgst: item.sgst.toFixed(2),
      igst: item.igst.toFixed(2),
      grandTotal: (item?.total + item?.totalTax).toFixed(2),
    }),
  },
};
exports.makeReportExcelBuffer = async ({ reportData, reportType }) => {
  const { bodyMapper, header } = reportDataByType[reportType];
  const reportItems = reportData.map(bodyMapper);
  const wb = new xl.Workbook();
  const ws = wb.addWorksheet();
  const headerStyle = wb.createStyle({
    font: {
      bold: true,
    },
    border: {
      outline: true,
    },
  });
  Object.values(header).forEach((value, index) => {
    ws.cell(1, index + 1)
      .string(value)
      .style(headerStyle);
  });
  reportItems.forEach((reportItem, index) => {
    Object.entries(header).forEach(([key], fieldIndex) => {
      if (key != "_id")
        ws.cell(index + 2, fieldIndex + 1).string(reportItem[key]);
    });
  });
  const excelBuffer = await wb.writeToBuffer();
  return excelBuffer;
};
