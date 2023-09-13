const asyncHandler = require('../middleware/async');
const ProductCategory = require('../models/ProductCategory');
const ProductSubCategory = require('../models/ProductSubCategory');
const Product = require('../models/Product');

const ErrorResponse = require('../utils/errorResponse');
const isObjEmpty = require('../utils');

// @desc   Get all product
// @route   /api/v1/product
// @access   Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc   Get all product Filter
// @route   /api/v1/product-filter
// @access   Public
exports.getProductsFilter = asyncHandler(async (req, res, next) => {
  let query;

  console.log(req.get('host'));
  console.log(req.originalUrl);

  const clientUrl = res.url;
  console.log('s', clientUrl);
  // ///Copy req.query
  // const reqQuery = { ...req.query };

  // // Field to exclude
  // const removeFields = ['select', 'sort', 'orderBy'];

  // //Loop over removeFields and Delete them from  reqQuery
  // removeFields.forEach((param) => delete reqQuery[param]);

  // ///Create Query String
  // let queryStr = JSON.stringify(req.query);
  // //Create operators ($gt, $gte etc.)
  // queryStr = queryStr.replace(
  //   /\b(gt|gte|lt|lte|in)\b/g,
  //   (match) => `$${match}`
  // );

  ///Finding resource
  query = Product.find();

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

  const total = await Product.countDocuments();

  // query = query.skip(startIndex).limit(limit);

  ///Populated

  query = query.populate([
    'productCategories',
    'productSubCategories',
    'brands',
  ]);

  // Executing Query
  let queryData = await query;
  if (!isObjEmpty(req.body)) {
    const { brands, categories, subCatagories, minPrice, maxPrice } = req.body;
    if (categories && categories.length > 0) {
      queryData = queryData.filter((p) =>
        categories.some((c) => c === p.productCategory.toString())
      );
    }
    if (subCatagories && subCatagories.length > 0) {
      queryData = queryData.filter((p) =>
        subCatagories.some((cs) =>
          p.productSubCategory.some((dd) => dd.toString() === cs)
        )
      );
    }
    if (brands && brands.length > 0) {
      queryData = queryData.filter((p) =>
        brands.some((c) => c === (p.brand === null ? '' : p.brand.toString()))
      );
    }
    if (minPrice && maxPrice) {
      queryData = queryData.filter(
        (qd) => qd.salePrice >= minPrice && qd.salePrice <= maxPrice
      );
    }
  }
  queryData = queryData.slice(startIndex, endIndex);

  const queryTotal = queryData.length;
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

  res.status(200).json({
    total: queryData.length,
    success: true,
    totalRecords: total,
    pagination,
    data: queryData,
  });
  next();
  // res.status(200).json(res.advancedResults);
});

// @desc   create a single product
// @route   /api/v1/product
// @access   Public
exports.createProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    succeed: true,
    data: product,
    id: product._id,
  });
});

// @desc   fetch single product
// @route   /api/v1/product/:id
// @access   Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate([
    'productCategories',
    'productSubCategories',
    'brands',
  ]);

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: product,
  });
});
// @desc   fetch single product
// @route   /api/v1/product/:slug
// @access   Public
exports.getProductBySlug = asyncHandler(async (req, res, next) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate([
    'productCategories',
    'productSubCategories',
    'tags',
    'brands',
    {
      path: 'attribute',
      populate: {
        path: 'id',
        model: 'Attributes',
        select: 'id name',
      },
    },
  ]);

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: product,
  });
});

// @desc   update single product
// @route   /api/v1/product/:id
// @access   Public
exports.updateProduct = asyncHandler(async (req, res, next) => {
  ///Name Checked in Product
  const duplicateItem = await Product.findOne({
    name: req.body.name,
  });

  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  ///Duplicate Check while updating
  if (duplicateItem && duplicateItem.id !== req.params.id) {
    return next(
      new ErrorResponse(
        `The name ( ${duplicateItem.name}) used another Product`,
        409
      )
    );
  }

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: product,
  });
});
// @desc   Delete single product
// @route   /api/v1/product/:id
// @access   Public
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(
      new ErrorResponse(
        `Product Catetory not found with id of ${req.params.id}`,
        404
      )
    );
  }

  product.remove();

  res.status(200).json({
    success: true,
    data: req.params.id,
  });
});
