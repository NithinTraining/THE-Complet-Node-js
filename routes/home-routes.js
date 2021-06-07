const express = require("express");
const {
  homeview,
  generatePdf,
  viewLogin,
  viewDashboard,
  pdfjson,
  pdfExtract,
  pdfPars,

} = require("../controller/pdfController");

const router = express.Router();

router.get("/", homeview);
router.get("/download", generatePdf);
router.get("/login", viewLogin);
router.get("/dashboard", viewDashboard)
router.get("/pdfjson",pdfjson)
router.get('/pdfExtract',pdfExtract)
router.get('/pdfpars',pdfPars)

module.exports = router;
