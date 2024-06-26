import mongoose, { Schema, model } from "mongoose";



const BreandSchema = new Schema({
    name: { type: String, required: true, trim: true},
    slug: { type: String, required: true, trim: true, unique: true},
    image: {
        secure_url: { type: String, required: true},
        public_id: { type: String, required: true, unique: true},
    },
    folderId: { type: String, required: true, unique: true},
    addedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true},  // superAdmin
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' }, // superAdmin
    catagoryId: { type: Schema.Types.ObjectId, ref: 'Catagory', required: true }, //Admin
    subCatagoryId: { type: Schema.Types.ObjectId, ref: 'SubCategory', required: true }, // superAdmin
},{
    timestamps: true,
    toJSON: {virtuals: true},    
    ObjectId: {virtuals: true},    
})
// check for the model

BreandSchema.virtual("Products", {
    ref: 'Product',
    localField: '_id',
    foreignField: 'brandId'
})




export default mongoose.models.Brand || model("Brand", BreandSchema)