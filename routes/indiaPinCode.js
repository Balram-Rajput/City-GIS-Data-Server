const express = require("express");
const routerpin = express.Router()
const {getAllIndiaPinCodeData ,autoCompletePinCodeData} = require("../controllers/IndiaPinCode")

routerpin.route('/').get(getAllIndiaPinCodeData)
routerpin.route('/autoComplete/').get(autoCompletePinCodeData)


module.exports = routerpin
