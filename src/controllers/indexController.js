var express = require('express');
var router = express.Router();

const jwt = require('jsonwebtoken');
const configJwt = require('../constants/configJwt');

router.get('/', function (req, res, next) {
    res.send('Index');
});


// Middleware para verificar token
router.use(function (req, res, next) {

    // Primero me fijo si se está logueando, en tal caso NO verifico el token
    console.log(req.url)
    if (req.url === `/usuarios/login`) {
        next();
    } else {
        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
    
        // decode token
        if (token) {
    
            // verifies secret and checks exp
            jwt.verify(token, configJwt.secret, function (err, decoded) {
                if (err) {
                    return res.json({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded; next();
                }
            });
    
        } else {
    
            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });
    
        }
    }

});

module.exports = router;
