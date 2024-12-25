const express = require('express');
const {
  registerUser,
  loginUser,
  updateUser,
  followUser,
  withdrawlfollow,
  followRequests,
  acceptReq,
  denyReq,
  Friends,
  AllUsers,
  getUser,
  getSearchUsers
} = require('../controllers/userController.js');
const router = express.Router();
const { verifyEmail } = require('../controllers/userController.js');
const auth = require('../middleware/auth.js');

router.get('/verify/:token', verifyEmail);

router.post('/register', registerUser);
router.post('/login', loginUser);
router.delete('/delete', loginUser); //todo

router.put('/update_user', auth, updateUser);
router.get('/get_user/:id', getUser);

router.post('/follow', auth, followUser);
router.post('/withdrawfollow', auth, withdrawlfollow);
router.get('/followRequests', auth, followRequests);
router.post('/acceptRequest', auth, acceptReq);
router.post('/denyReq', auth, denyReq);

router.get('/friends', auth, Friends);
router.get('/all_users', AllUsers);
router.get('/getSearchUsers', getSearchUsers);

module.exports = router;
