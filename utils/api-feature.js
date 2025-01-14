function ApiFeature(model, query) {
  this.model = model;
  this.query = query;
}

ApiFeature.prototype.limitFields = function () {
  let { fields = ",-__v" } = this.query;

  fields = fields.split(",").map((field) => field.trim());

  this.model = this.model.select(fields.join(" "));

  return this;
};

ApiFeature.prototype.sort = function () {
  const { sort = "createdAt" } = this.query;

  this.model = this.model.sort(sort);

  return this;
};

ApiFeature.prototype.paginate = function () {
  const { page = "1", limit = "10" } = this.query;

  const skip = (page * 1 - 1) * limit * 1;

  this.model = this.model.skip(skip).limit(Number(limit));

  return this;
};

ApiFeature.prototype.filter = function () {
  const { limit, fields, sort, page, ...filters } = this.query;

  const filtersAsText = JSON.stringify(filters).replace(
    /\b(gt|gte|lt|lte)\b/g,
    (match) => `$${match}`
  );

  this.model = this.model.find(JSON.parse(filtersAsText));

  return this;
};

module.exports = { ApiFeature };
