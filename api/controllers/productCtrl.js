const mongoose  = require('mongoose');
const Product   = require('../models/Product');

exports.products_create_product = (req, res, next) => {
    const product = new Product({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });

    product.save()
        .then(({ name, price, _id }) => {
            res.status(201).json({
                message: 'Created product successfully',
                createdProduct: {
                    _id,
                    name,
                    price,
                    request: {
                        type: 'GET',
                        url: `http://localhost:3000/products/${_id}`
                    }
                }
            });            
        })
        .catch(error => res.status(500).json({ error }));
};

exports.products_get_all = (req, res, next) => {
    Product.find()
        .select('_id name price productImage')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(({ name, price, _id, productImage }) => {
                    return {
                        _id,
                        name,
                        price,
                        productImage,
                        request: {
                            type: 'GET',
                            url: `http://localhost:3000/products/${_id}`
                        }
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(error => res.status(500).json({ error }));
};

exports.producs_get_byId = (req, res, next) => {
    Product.findById(req.params.id)
        .select('_id name price productImage')
        .exec()
        .then(doc => {
            if (!doc) {
                return res.status(404).json({ message: 'No valid entry found for the provided ID' });
            }
            
            res.status(200).json({
                product: doc,
                request: {
                    type: 'GET_ALL_PRODUCTS',
                    url: 'http://localhost:3000/products'
                }
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.products_update_product = (req, res, next) => {
    const id = req.params.id;
    const updateOps = {};

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    
    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(() => {
            res.status(200).json({
                message: 'Product updated',
                request: {
                    type: 'GET',
                    url: `http://localhost:3000/products/${id}`
                }
            });
        })
        .catch(error => res.status(500).json({ error }));

};

exports.products_delete_product = (req, res, next) => {
    const id = req.params.id;
    Product.remove({ _id: id })
        .exec()
        .then(result => res.status(200).json({
            message: 'Product deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/products',
                body: {
                    name: 'String',
                    price: 'Number'
                }
            }
        }))
        .catch(error => res.status(500).json({ error }));
};