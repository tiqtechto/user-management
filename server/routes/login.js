const express = require('express');
const router = express.Router();

const {bulkRegister, registerView, loginView, getNonAdminUsers, logOut, deleteUser, checkLoggedIn, resetPasswordRequest, updateResetStatus, updatePassword } = require('../controllers/loginController');

const checkAuthentication = require('../middleware/checkAuthentication');
const bulkUserValidationRules = require('../bulkUserValidationRules');

router.post('/bulk-register', bulkRegister, bulkUserValidationRules);
router.post('/register', registerView);
router.post('/login', loginView);
router.get('/get-users/:token', checkAuthentication, getNonAdminUsers);
router.post('/logout', logOut);
router.post('/delete-user', checkAuthentication, deleteUser);
router.post('/reset-request', checkAuthentication, resetPasswordRequest);
router.post('/reset-update', checkAuthentication, updateResetStatus);
router.post('/update-password', checkAuthentication, updatePassword);
router.post('/checkloggedin', checkLoggedIn);

module.exports = router;