import { Schema, model } from "mongoose";


const productSchema = new Schema({
    // strings
    title: { type: String, required: true, trim: true},
    desc: { type: String},
    slug: { type: String, required: true },

    // numbers
    basePrice: { type: Number, required: true },
    discount: { type: Number, default: 0},
    appliedPrice: { type: Number, required: true},
    stock: { type: Number, required: true ,min: 0, default: 0},
    rate: { type: Number, min: 0, default: 0, max: 5},

    // relations ObjectId
    addedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    updateBy: { type: Schema.Types.ObjectId, ref: 'User'},
    brandId: { type: Schema.Types.ObjectId, ref: 'Brand', required: true},
    subCategoryId: { type: Schema.Types.ObjectId, ref: 'SubCategory', required: true},
    categoryId: { type: Schema.Types.ObjectId, ref: 'Catagory', required: true},
    // arrays
    images: [{
        secure_url: {type: String, required: true},
        public_id: {type: String, required:true}
    }],
    spaces: {
        type: Map,
        of: [String | Number]
    },
    folderId: { type: String, required: true, unique: true},

},{
    timestamps: true,
    toJSON: {virtuals:true},
    ObjectId: {virtuals:true}
})

productSchema.virtual("reviews", {
    ref: 'Review',
    localField: '_id',
    foreignField: 'productId'
})

export default model("Product", productSchema)