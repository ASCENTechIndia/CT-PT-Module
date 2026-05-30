const express = require('express');
const validate = require('../../middleware/validate.middleware');
const { authRequired } = require('../../middleware/auth');
const { complaintRegistrationSchema, assignComplaintSchema } = require('./registerComplaint.validation');
const { getWardList, getToiletList, getComplaintTypeList, registerComplaint, assignComplaint, getComplaintList } = require('./registerComplaint.controller');

const router = express.Router();

router.get('/wardList', getWardList);
router.get('/toiletList', getToiletList);
router.get('/complaintTypeList', getComplaintTypeList);
router.post('/insertComplaint', validate(complaintRegistrationSchema), registerComplaint );
router.post('/assignComplaint', validate(assignComplaintSchema), assignComplaint );
router.get('/getCitizenComplaintList', getComplaintList);

module.exports = router;