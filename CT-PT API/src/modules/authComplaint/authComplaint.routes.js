const express = require('express');
const validate = require('../../middleware/validate.middleware');
const { authRequired } = require('../../middleware/auth');
const { authComplaintSchema } = require('./authComplaint.validation');
const { authComplaint, getCompListForSup, getCompListForSI, getImagesCon,
    resolvedListbyVendor, resolvedListbySup, complaintStatusUpdate, getSolvedComplaintImagesCon, getSupervisorStatusCon
  } = require('./authComplaint.controller');
const { complaintStatusSchema } = require('./authComplaint.validation');

const router = express.Router();

router.post('/authComplaint', validate(authComplaintSchema), authComplaint);
router.post('/complaintStatusUpdate', validate(complaintStatusSchema), complaintStatusUpdate);

router.get('/getCompListForSup', getCompListForSup);
router.get('/getCompListForSI', getCompListForSI);
router.get('/getImages', getImagesCon);
router.get('/getSolvedComplaintImages', getSolvedComplaintImagesCon);
router.get('/supervisorStatus', getSupervisorStatusCon);
router.get('/rslvdListbyVendor', resolvedListbyVendor);
router.get('/rslvdListApprovedbySup', resolvedListbySup);

module.exports = router;