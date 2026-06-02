const express = require('express');
const router = express.Router();
const customerController = require('../controller/customerController');

router.post('/register', customerController.register);
router.post('/login', customerController.login);
router.post('/verify-email', customerController.verifyEmail);
router.post('/bypass-verify', customerController.bypassVerify);
router.get('/profile', customerController.getProfile);
router.put('/profile', customerController.updateProfile);
router.delete('/profile', customerController.deleteOwnAccount);

router.get('/admin/users', customerController.requireAdmin, customerController.getAllUsers);
router.delete('/admin/users/:id', customerController.requireAdmin, customerController.deleteUser);
router.put('/admin/users/:id/role', customerController.requireAdmin, customerController.updateRole);
router.put('/admin/users/:id/partition-access', customerController.requireAdmin, customerController.updatePartitionAccess);
router.put('/admin/users/:id/teacher', customerController.requireAdmin, customerController.updateTeacher);

module.exports = router;