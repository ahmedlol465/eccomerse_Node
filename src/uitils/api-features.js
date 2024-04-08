/**
 * sort => inside the class
 * pagination => inside the class
 * search => inside the class
 */

import { paginationFunction } from "./pagination.js"


export class APIFeatures {
    // mongooseQuery = model.find()
    // query = req.query()
    constructor(query, mongooseQuery){
        this.query = query
        this.mongooseQuery = mongooseQuery
    }



    pagination = ({ page, size }) => {
    const {limit, skip} = paginationFunction({page,size})
    this.mongooseQuery = this.mongooseQuery.limit(limit).skip(skip);

    return this
}

sort(sortBy) {
    if (!sortBy) {
        this.mongooseQuery = this.mongooseQuery.sort({ createdAt: -1 });
        return this;
    }
    const formula = sortBy.replace(/desc/g, -1).replace(/asc/g, 1).replace(/ /g, ':');
    const [key, value] = formula.split(':');

    this.mongooseQuery = this.mongooseQuery.sort({ [key]: +value });
    return this;
}


search(search) {
    const quertFilter = {}

    if(search.title) quertFilter.title = { $regex: search.title, $options: 'i' }
    if(search.desc) quertFilter.desc = { $regex: search.desc, $options: 'i' }
    // price for product 
    if(search.discount) quertFilter.discount = { $ne: 0 }; // not = 0
    
    if(search.priceFrom && !search.priceTo) quertFilter.appliedPrice = { $gte: search.priceFrom }; // not = 0
    if(!search.priceFrom && search.priceTo) quertFilter.appliedPrice = { $lte: search.priceTo }; // not = 0
    if(search.priceFrom && search.priceTo) quertFilter.appliedPrice = { $lte: search.priceTo, $gte: search.priceFrom }; // not = 0
    console.log(quertFilter);
    this.mongooseQuery = this.mongooseQuery.find(quertFilter)
    return this


}


filter(filters) {  // filter is the intering from postman  

    console.log('filters ',filters);
    const queryFilter = JSON.stringify(filters) //cange it to string
    .replace(/gt|gte|lt|lte|ne/g, (operator) => `$${operator}`)
// parse date to date base 
    this.mongooseQuery = this.mongooseQuery.Product.find(JSON.parse(queryFilter))
    console.log(this.mongooseQuery);
    return this
}


}



/**
 * in
 * eq
 * nin
 * ne
 */