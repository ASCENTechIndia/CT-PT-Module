const express = require('express');
const validate = require('../../middleware/validate.middleware');
const { authRequired } = require('../../middleware/auth');
// const { } = require('./Reports.validation');
const { getWardList, getToiletList, getComplaintTypeList,registerComplaint } = require('./registerComplaint.controller');

const router = express.Router();

router.get('/wardList', getWardList);
router.get('/toiletList', getToiletList);
router.get('/complaintTypeList', getComplaintTypeList);
router.post('/insertComplaint', registerComplaint );


module.exports = router;