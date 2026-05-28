const express = require('express');
const validate = require('../../middleware/validate.middleware');
const { authRequired } = require('../../middleware/auth');
const { authComplaintSchema } = require('./authComplaint.validation');
const { authComplaint } = require('./authComplaint.controller');

const router = express.Router();

router.post('/authComplaint', validate(authComplaintSchema), authComplaint);

module.exports = router;