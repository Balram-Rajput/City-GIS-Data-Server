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
    res.status(200).json({geoData,count :geoData.length})
    
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