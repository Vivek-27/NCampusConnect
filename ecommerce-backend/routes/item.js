const express = require('express');
const {
  createItem,
  getItems,
  deleteItem,
  updateItem,
  getMyItems,
  getOneItem,
  getUserItems,
  getSearch
} = require('../controllers/itemController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', getItems);
router.get('/one/:id', getOneItem);
router.get('/myItems', auth, getMyItems);
router.get('/userItems/:id', getUserItems);
router.post('/', auth, createItem);
router.put('/', auth, updateItem);
router.delete('/:id', auth, deleteItem);
router.get('/search', getSearch);

module.exports = router;
