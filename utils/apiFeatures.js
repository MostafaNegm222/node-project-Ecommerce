const Product = require("../models/productModel.js")
class ApiFeatures {
  constructor(query, searchQuery) {
    this.query = query;
    this.searchQuery = searchQuery;
  }

  filter() {
    let mongoObj = {};
    let queryObj = { ...this.searchQuery };
    let excludedQuery = ["search", "sort", "limit", "skip", "fields","page"];
    excludedQuery.forEach((v) => delete queryObj[v]);
    Object.keys(queryObj).forEach((field) => {
      let value = queryObj[field];
      if (field.includes("[")) {
        let key = field.split("[")[0];
        let operator = field.split("[")[1].replace("]", "");
        if (!mongoObj[key]) mongoObj[key] = {};
        mongoObj[key][`$${operator}`] = isNaN(value) ? value : Number(value);
      } else {
        mongoObj[field] = isNaN(value) ? value : Number(value);
      }
    });
    this.query = this.query.find(mongoObj)
    return this
  }

  search () {
    if(this.searchQuery.search) {
          let keyword = this.searchQuery.search
          this.query = this.query.find({
            $or : [
             { title : {$regex:`^${keyword}` , $options:"i"}},
             { name : {$regex:keyword , $options:"i"}},
             { description : {$regex:keyword , $options:"i"}},
            ]
          })
        }
        return this
  }

  sort () {
    if(this.searchQuery.sort) {
      let sortedBy = this.searchQuery.sort.split(",").join(" ")
      this.query = this.query.sort(sortedBy)
    } else {
      this.query = this.query.sort("createdAt")
    }
    return this
  }

  fields () {
     if(this.searchQuery.fields) {
          let fields = this.searchQuery.fields.split(",").join(" ")
          this.query = this.query.select(fields)
        } else {
          this.query = this.query.select("-isDeleted -__v")
        }

        return this
  }

  pagination() {
  let limit = parseInt(this.searchQuery.limit, 10) || 10;
  let page = parseInt(this.searchQuery.page, 10) || 1;
  let skip = (page - 1) * limit;
  this.query = this.query.skip(skip).limit(limit);

  return this;
}
}

module.exports = ApiFeatures