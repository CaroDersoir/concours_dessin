/** indique quelle fonction appeler pour quelle URL **/

const express = require('express');
const router = express.Router();
const itemsController = require('../controller/itemsController');

router.get('/', itemsController.getItems);
router.post('/', itemsController.createItem);
router.get('/:id', itemsController.getItemById);
router.put('/:id', itemsController.updateItem);
router.patch('/:id/stock', itemsController.updateItemStock);
router.delete('/:id', itemsController.deleteItem);

module.exports = router;
