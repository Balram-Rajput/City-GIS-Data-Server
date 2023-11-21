
const mongoose = require("mongoose")

const geoJsonSchema = new mongoose.Schema({
    type: {
        type:String
    },
    properties : {
        type: mongoose.Schema.Types.Object
    },
    geometry :{
        type:mongoose.Schema.Types.Mixed
    }
});


mongoose.set("strictQuery", true);
module.exports = mongoose.model('india_pincode_data', geoJsonSchema);