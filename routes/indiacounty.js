const express = require("express");
const router = express.Router()
const {getAllIndiaGeojson} = require("../controllers/indiaCounty")

router.route('/').get(getAllIndiaGeojson)


module.exports = router