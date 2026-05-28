const express = require('express');
const validate = require('../../middleware/validate.middleware');
const { authRequired } = require('../../middleware/auth');
// const { } = require('./Reports.validation');
const {getWardList} = require('./registerComplaint.controller');

const router = express.Router();

router.get('/wardList', getWardList);


module.exports = router;