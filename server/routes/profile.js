const express = require('express');
const router = express.Router();
const {profileUpdate, profilePic, getProfileData, testMail} = require('../controllers/profileController');


const checkAuthentication = require('../middleware/checkAuthentication');

router.post('/profile-update', checkAuthentication, profileUpdate);
router.post('/profile-pic', checkAuthentication, profilePic);
router.post('/get-profile-data', checkAuthentication, getProfileData);

router.post('/send-test-mail', checkAuthentication, testMail);

module.exports = router;