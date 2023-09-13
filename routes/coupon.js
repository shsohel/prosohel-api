const express = require('express');
const {
  getCoupons,
  createCoupon,
  getCoupon,
  updateCoupon,
  deleteCoupon,
  filterCouponSection,
} = require('../controllers/couponController');

const Coupon = require('../models/Coupon');

const advancedResults = require('../middleware/advancedResults');

const router = express.Router();

router
  .route('/')
  .post(
    advancedResults(
      Coupon,
      [
        'includeProducts',
        'excludeProducts',
        'includeCategories',
        'excludeCategories',
        'includeSubCategories',
        'excludeSubCategories',
      ],
      filterCouponSection
    ),
    getCoupons
  )
  //.post(advancedResults(Coupon, null, filterCouponSection), getCoupons)
  .get(advancedResults(Coupon), getCoupons);

router.route('/new').post(createCoupon);

router.route('/:id').get(getCoupon).put(updateCoupon).delete(deleteCoupon);

module.exports = router;
