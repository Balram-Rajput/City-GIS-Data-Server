require("dotenv").config()
const connectDB = require("./db/connect");
const GeoJsonModel = require("./models/indiacounty")


// type: mongoose.Schema.Types.Mixed,
// or you can be more specific and use `mongoose.Schema.Types.Object` depending on your data structure


const geoData = require("./india-city.json")

const start= async ()=>{
    try{
        const t1 = new Date().getTime()
        await connectDB(process.env.MONGO_URI)
        await GeoJsonModel.deleteMany()
        await GeoJsonModel.create(geoData)
        console.log("sucess servr run")
        const t2 = new Date().getTime()
        const result = (t2-t1)/1000
        console.log(result," sec")
        process.exit(0)
    }catch(error){
        console.log(error)
        process.exit(1)
    }
}

// start()


// const {readFile,writeFile} = require('fs');
// readFile("po_geojson.json","utf-8",(err,data)=>{
//     if(err){
//         console.log("error in read file",err)
//     }else{
//         const jsonData =  JSON.parse(data)
//         // console.log(jsonData)
//         const transformData = transformDatafn(jsonData)
//         writeFile("india-city.json",transformData,(err,result)=>{
//             if(err){
//                 console.log(err)
//                 return
//             }
//             console.log("done with geojson file update")
//         })
//     }
// })

// function transformDatafn(json){
//     json.forEach(val=>{
//         val["geometry"]["coordinates"] = val.geometry.coordinates[0]
//     })

//     return json
// }


