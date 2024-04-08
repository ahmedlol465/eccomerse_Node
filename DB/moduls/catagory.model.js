import { Schema, model } from "mongoose";



const catagorySchema = new Schema({
    name: { type: String, required: true, trim: true, unique: true},
    slug: { type: String, required: true, trim: true, unique: true},
    image: {
        secure_url: { type: String, required: true},
        public_id: { type: String, required: true, unique: true},
    },
    folderId: { type: String, required: true, unique: true},
    addedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true},  // superAdmin
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' } // superAdmin
},{
    timestamps: true,
    toJSON: {virtuals:true},
    ObjectId: {virtuals:true}

})
// virtual populate for subcategory model
catagorySchema.virtual("subCategory", {
    ref:'SubCategory',
    localField: '_id',
    foreignField: 'catagoryId'
});


export default model("Catagory", catagorySchema)