const express = require("express");
const router = express.Router()
const { getAllIndiaGeojson } = require("../controllers/IndiaCountyfile")

router.route('/').get(getAllIndiaGeojson)


module.exports = router