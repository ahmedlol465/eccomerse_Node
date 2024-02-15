/**
 * 
 * @param {*} req.savedDocument
 * @describtion {*} delete from data base  
 */


export const rollBackSavedDocuments = async (req,res,next) => {

    console.log("rollbacksaved document",req.savedDocument);
    if(req.savedDocument) {
        const { model, _id } = req.savedDocument
        await model.findByIdAndDelete(_id)
    }
    next()
}