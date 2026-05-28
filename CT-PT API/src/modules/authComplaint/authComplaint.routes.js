const express = require('express');
const validate = require('../../middleware/validate.middleware');
const { authRequired } = require('../../middleware/auth');
const { complaintRegistrationSchema } = require('./authComplaint.validation');
const { 
 } = require('./authComplaint.controller');

const router = express.Router();


router.post('/authComplaint', validate(acomplaintRegistrationSchema), registerComplaint );


module.exports = router;