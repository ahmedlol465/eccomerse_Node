import cloudnaryConnection from "../uitils/cloudnary.js";
/**
 * 
 * @param {*} req.folder
 * @describtion {*} delete from cloudnary  
 */


export const rollBackUploadedFiles = async (req,res,next) => {
    if(req.folder) {
        // console.log(req.files);
        // console.log(req.file);
        console.log("role back uploaded files");
        await cloudnaryConnection().api.delete_resources_by_prefix(req.folder)
        await cloudnaryConnection().api.delete_folder(req.folder)
    }
    next()
}