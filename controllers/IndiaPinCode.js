const IndiaPinCodeModel = require("../models/indiaPinCode")
const BadRequestError= require("../errors/bad-request")
const NotFoundError = require("../errors/not-found")



const getAllIndiaPinCodeData = async (req,res)=>{   
    const {pincode,district} = req.query
    const queryObject = {}

    if(pincode){
        let multipin = pincode.split(",")
        // queryObject["properties.dist_name"] = {$regex:city, $options:'i'}
        const regexPatterns = multipin.map(response => new RegExp(response, 'i'));
        queryObject["properties.pin_code"] = {$in : regexPatterns}
        
    }
    else if(district){
        let multiCity = district.split(",")
        // queryObject["properties.dist_name"] = {$regex:city, $options:'i'}
        const regexPatterns = multiCity.map(distName => new RegExp(distName, 'i'));
        queryObject["properties.district"] = {$in : regexPatterns}
        
    }

    console.log(queryObject)
    if(Object.keys(queryObject).length  === 0){
        throw new BadRequestError("No Data found on query.")
    }

    console.log(queryObject)
    let result =  IndiaPinCodeModel.find(queryObject)
    // pagination
    result = PaginationFunction(result,req,1,200)
    const geoData = await result
    var filter_properties = []

    if(district){
        let multidistrict = district.split(",");
        let jsonData = JSON.parse(JSON.stringify(geoData))
        for(city1 of multidistrict){
        let obj = {
            "key":city1,
            "geometry":[]
        }
    
        jsonData.forEach(result=>{
            let dist_name = result["properties"]["district"].toLowerCase()
            if(dist_name.includes(city1.toLowerCase())){
                obj.geometry.push(result)
            }    
        })
        filter_properties.push(obj)
    
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


const autoCompletePinCodeData = async(req,res)=>{
    const {pincode} = req.query
    const queryObject = {}
    if(pincode){
        let searchData = [pincode]
        const regexPatterns = searchData.map(result => new RegExp(result, 'i'));
        queryObject["properties.pin_code"] = {$in : regexPatterns}
    }
    console.log(queryObject)
    if(Object.keys(queryObject).length  === 0){
        throw new BadRequestError("No Data found on query.")
    }

    console.log(queryObject)
    let result =  IndiaPinCodeModel.find(queryObject,`properties.pin_code properties.district `)
    // pagination
    result = PaginationFunction(result,req,1,20)
    const pincodeData = await result
    res.status(200).json({pincodeData,count :pincodeData.length})

}

function PaginationFunction(modal,req,page1,limit1){
    const page = Number(req.query.page) || page1 
    const limit = Number(req.query.limit) || limit1 ;
    const skip = (page -1)*limit;  
    modal = modal.skip(skip).limit(limit);
    return modal
}


module.exports = {getAllIndiaPinCodeData,autoCompletePinCodeData}