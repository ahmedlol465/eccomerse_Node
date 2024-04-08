export const paginationFunction = ({page = 1, size = 3}) => {
    if(page < 1) page = 1
    if(page < 1) size = 2

    // equation 
    const limit = +size  // + to avoid string when i send it in query
    // the fourmla 
    const skip = (+page - 1) * limit


    return {limit, skip}
}