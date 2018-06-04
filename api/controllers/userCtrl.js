const mongoose  = require('mongoose');
const bcrypt    = require('bcrypt');
const jwt       = require('jsonwebtoken');
const User      = require('../models/User');

exports.user_signup = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length) {
                return res.status(422).json({
                    message: 'This email is already in use.'
                });
            }

            bcrypt.hash(req.body.password, 10, (error, hash) => {
                if (error) {
                    return res.status(500).json({ error })
                }

                const user = new User({
                    _id: mongoose.Types.ObjectId(),
                    email: req.body.email,
                    password: hash
                });
            
                user.save()
                    .then(result => res.status(201).json({ message: 'User created' }))
                    .catch(error => res.status(500).json({ error }));
            });                
        });
};

exports.user_login = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (!user.length) {
                return res.status(401).json({ message: 'Auth has failed :(' });
            }

            bcrypt.compare(req.body.password, user[0].password, (error, result) => {
                if (error) {
                    return res.status(401).json({ message: 'Auth has failed :(' });
                }
                if (result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        _id: user[0]._id
                    }, 
                    process.env.JWT_SECRET_KEY,
                    {
                        expiresIn: '1h'
                    });

                    return res.status(200).json({ 
                        message: 'Auth successful',
                        token 
                    });
                }

                return res.status(401).json({ message: 'Auth has failed :(' });
            });
        })
        .catch(error => res.status(500).json({  error }));
};

exports.user_get_all = (req, res, next) => {
    User.find()
        .select('email')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                users: docs.map(({ _id, email }) => {
                    return { _id, email }
                })
            }
            res.status(200).json(response);
        })
        .catch(error => res.status(500).json({ error }));
};

exports.user_delete_user = (req, res, next) => {
    User.remove({ _id: req.params.id })
        .exec()
        .then(() => res.status(200).json({ message: 'User deleted' }))
        .catch(error => res.status(500).json({ error }));
};