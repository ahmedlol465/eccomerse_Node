import { Schema, model } from "mongoose";



const subCatagorySchema = new Schema({
    name: { type: String, required: true, trim: true, unique: true},
    slug: { type: String, required: true, trim: true, unique: true},
    image: {
        secure_url: { type: String, required: true},
        public_id: { type: String, required: true, unique: true},
    },
    folderId: { type: String, required: true, unique: true},
    addedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true},  // superAdmin
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' }, // superAdmin
    catagoryId: { type: Schema.Types.ObjectId, ref: 'Catagory', required: true }, // superAdmin
},{
    timestamps: true,
    toJSON: { virtuals: true},
    toObject: { virtuals: true}
    
})

subCatagorySchema.virtual("Brands", {
    ref: "Brand",
    localField: "_id",
    foreignField: "subCatagoryId"
})


export default model("SubCategory", subCatagorySchema)