/**
 * 
 * @param {*} req.savedDocument
 * @describtion {*} delete from data base  
 */


export const rollBackSavedDocuments = async (req,res,next) => {
    
    console.log("rollbacksaved document",req.savedDocument);
    if(req.savedDocument) {
        // model === that brand or category or subCategory 
        // _id to delete it 
        const { model, _id } = req.savedDocument
        await model.findByIdAndDelete(_id)
    }
    next()
}



// req.savedDocument = { model: Product, _id: addProduct._id}
