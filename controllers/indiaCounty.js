const IndiaCountyModel = require("../models/indiacounty")
const BadRequestError= require("../errors/bad-request")
const NotFoundError = require("../errors/not-found")



const getAllIndiaGeojson = async (req,res)=>{   
    const {city,state} = req.query
    const queryObject = {}

    if(city){
        let multiCity = city.split(",")
        // queryObject["properties.dist_name"] = {$regex:city, $options:'i'}
        const regexPatterns = multiCity.map(distName => new RegExp(distName, 'i'));
        queryObject["properties.dist_name"] = {$in : regexPatterns}
        
    }

    else if(state){
        let MultieState = state.split(",")
        const regexPatterns = MultieState.map(distName => new RegExp(distName, 'i'));
        queryObject["properties.dist_name"] =  {$in : regexPatterns}
    }

    if(Object.keys(queryObject).length  === 0){
        throw new BadRequestError("No Data found on query.")
    }

    console.log(queryObject)
    let result =  IndiaCountyModel.find(queryObject)
    // pagination
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 4000 ;
    const skip = (page -1)*limit;  
    result = result.skip(skip).limit(limit);

    const geoData = await result
    var filter_properties = []
    
    if(city){
         let newCity = city.split(",");
         let jsonData = JSON.parse(JSON.stringify(geoData))
         for(city1 of newCity){
            let obj = {
                "key":city1,
                "geometry":[]
            }

            jsonData.forEach(result=>{
                let dist_name = result["properties"]["dist_name"].toLowerCase()
                if(dist_name.includes(city1.toLowerCase())){
                    obj.geometry.push(result)
                }    
            })
            filter_properties.push(obj)
            // for(geo of geoData){
            //     console.log(geo)
            //     if(geo["properties"]["dist_name"].incldues(value)){
            //         filter_properties[value].push(geo.properties)
            //     }
            // } 
        } 
    } 


    res.status(200).json({geoData:filter_properties,count :geoData.length})
    
     // if(numericFilters){
    //     const operatorMap={
    //         ">":"$gt",
    //         ">=":"$gte",
    //         "=":"$eq",
    //         "<":"$lt",
    //         "<=":"$lte"
    //     }
    //     const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    //     let filters = numericFilters.replace(
    //         regEx,
    //         (match)=>`-${operatorMap[match]}-`
    //     )
    //     const options = ["price","rating"];
    //     filters = filters.split(",").forEach((item) => {
    //         const [field,operator,value] = item.split("-");
    //         if(options.includes(field)){
    //             queryObject[field] = {[operator]:Number(value)} 
    //         } 
    //     });
    // }

    // sort
    // if(sort){
    //     let sortList = sort.split(",").join(" ")
    //     result = result.sort(sortList)
    //     // console.log(sort)
    // }else{
    //     result = result.sort("createAt")
    // }

    //fields 
    // if(fields){
    //     let fieldList = fields.split(",").join(" ")
    //     result = result.select(fieldList)
    // }


}

module.exports = {getAllIndiaGeojson}