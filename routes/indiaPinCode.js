const express = require("express");
const router = express.Router()
const {getAllIndiaPinCodeData ,autoCompletePinCodeData} = require("../controllers/IndiaPinCode")

router.route('/').get(getAllIndiaPinCodeData)
router.route('/autoComplete/').get(autoCompletePinCodeData)


module.exports = router