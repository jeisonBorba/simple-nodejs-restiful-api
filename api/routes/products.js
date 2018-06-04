const express       = require('express');
const ProductCtrl   = require('../controllers/productCtrl');
const upload        = require('../middlewares/uploadFile');
const authorization = require('../middlewares/authorization');

const router = express.Router();

router.post('/', authorization, upload.single('productImage'), ProductCtrl.products_create_product);
router.get('/', ProductCtrl.products_get_all);
router.get('/:id', ProductCtrl.producs_get_byId);
router.patch('/:id', authorization, ProductCtrl.products_update_product);
router.delete('/:id', authorization, ProductCtrl.products_delete_product);

module.exports = router;