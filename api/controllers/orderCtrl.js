const mongoose = require('mongoose');
const Order    = require('../models/Order');
const Product  = require('../models/Product');

exports.orders_create_order = (req, res, next) => {
    Product.findById(req.body.productID)
        .exec()
        .then(product => {
            if (!product) {
                return res.status(404).json({ message: 'Product not found!' });
            }

            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productID
            });
        
            return order.save();          
        })
        .then(({ _id, product, quantity }) => {
            res.status(200).json({
                message: 'Order stored',
                createdOrder: {
                    _id,
                    product,
                    quantity
                },
                request: {
                    type: 'GET',
                    url: `http://localhost:3000/orders/${_id}`
                }
            });
        })        
        .catch(error => res.status(500).json({ error }));
};

exports.orders_get_all = (req, res, next) => {
    Order.find()
        .select('_id product quantity')
        .populate('product', 'name')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                docs: docs.map(({ _id, product, quantity }) => {
                    return {
                        _id,
                        product,
                        quantity,
                        request: {
                            type: 'GET',
                            url: `http://localhost:3000/orders/${_id}`
                        }
                    }
                })
            }
            res.status(200).json(response);
        })
        .catch(error => res.status(500).json({ error })); 
};

exports.orders_get_byId = (req, res, next) => {
    Order.findById(req.params.id)
        .populate('product')
        .exec()
        .then(doc => {
            if (!doc) {
                return res.status(404).json({ message: 'No valid entry found for the provided ID' })
            }

            res.status(200).json({
                orders: doc,
                request: {
                    type: 'GET_ALL_ORDERS',
                    url: 'http://localhost:3000/orders'
                }
            });            
        })
        .catch(error => res.status(500).json({ error }));
};

exports.orders_delete_order = (req, res, next) => {
    const id = req.params.id;
    Order.remove({ _id: id })
        .exec()
        .then(result => res.status(200).json({
            message: 'Order deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/orders',
                body: {
                    productID: 'String',
                    quantity: 'Number'
                }                
            }
        }))
        .catch(error => res.status(500).json({ error }));
};