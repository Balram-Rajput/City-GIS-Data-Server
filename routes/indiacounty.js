const express = require("express");
const router = express.Router()
const  {getAllIndiaGeojson} = require("../controllers/IndiaCounty")

router.route('/').get(getAllIndiaGeojson)


module.exports = router