const isObjEmpty = require('../utils');

const advancedResults =
  (model, populate, filterSection) => async (req, res, next) => {
    let query;
    ///Copy req.query
    const reqQuery = { ...req.query };

    // Field to exclude
    const removeFields = ['select', 'sort', 'orderBy'];

    //Loop over removeFields and Delete them from  reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);

    ///Create Query String
    let queryStr = JSON.stringify(req.query);
    //Create operators ($gt, $gte etc.)
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    ///Finding resource
    query = model.find(JSON.parse(queryStr));

    ///Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }
    ///Sort
    if (req.query.sort) {
      ///Default Order By Ascending
      const orderBy = req.query?.orderBy ?? 'asc';

      const sortBy = req.query.sort.split(',').join(' ');

      query = query.sort(orderBy === 'desc' ? `-${sortBy}` : sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    ///Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();

    query = query.skip(startIndex).limit(limit);

    ///Populated
    if (populate) {
      query = query.populate(populate);
    }

    // Executing Query
    let queryData = await query;
    if (!isObjEmpty(req.body) && filterSection) {
      const queryFilter = [...queryData];
      queryData = queryFilter.filter((f) => filterSection(f, req.body));
      // s.name.toLowerCase().trim().includes(req.body.name.toLowerCase().trim())
    }

    //Pagination Result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.advancedResults = {
      total: queryData.length,
      success: true,
      totalRecords: total,
      pagination,
      data: queryData,
    };
    next();
  };

module.exports = advancedResults;
