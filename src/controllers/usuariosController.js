var express = require('express');
var router = express.Router();

const authService = require('../services/authService')

/**************************************************************************************/
/**************************************************************************************/

router.get('/', function (req, res, next) {
    res.send('usuarios')
});

router.post('/login', function (req, res) {

    authService.login('hola', 'hola')
        .then(a => {

            res.send(
                a  
            )
        })


    // if (err) return res.status(500).send("There was a problem registering the user.")
    // res.status(200).send({ auth: true, token: token });


});

/**************************************************************************************/
/**************************************************************************************/

module.exports = router;