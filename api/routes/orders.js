const express       = require('express');
const OrderCtrl     = require('../controllers/orderCtrl');
const authorization = require('../middlewares/authorization');

const router = express.Router();

router.post('/', authorization, OrderCtrl.orders_create_order);
router.get('/', authorization, OrderCtrl.orders_get_all);
router.get('/:id', authorization, OrderCtrl.orders_get_byId);
router.delete('/:id', authorization, OrderCtrl.orders_delete_order);

module.exports = router;