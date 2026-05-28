const express = require('express');
const validate = require('../../middleware/validate.middleware');
const { authRequired } = require('../../middleware/auth');
const { complaintRegistrationSchema } = require('./authComplaint.validation');
const {registerComplaint,  getCompListForSup
 } = require('./authComplaint.controller');

const router = express.Router();


router.post('/authComplaint', validate(acomplaintRegistrationSchema),  );


router.get('/getCompListForSup', getCompListForSup);

module.exports = router;