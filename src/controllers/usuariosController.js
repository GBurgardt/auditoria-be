var express = require('express');
var router = express.Router();

const authService = require('../services/authService')
const GenericResponse = require('../models/genericResponse')
const tiposResponse = require('../constants/tiposResponse');

/**************************************************************************************/
/**************************************************************************************/

router.get('/', function (req, res, next) {
    res.send('usuarios')
});

router.post('/login', function (req, res) {

    const { empresa, nombre, clave } = req.body

    if (empresa && nombre && clave) {
        authService.login(empresa, nombre, clave)
            .then(token => {
    
                token ?
                    res.status(200).send(new GenericResponse(
                        { codigo: tiposResponse.OK_REQUEST, descripcion: 'Ingreso correcto', descripcionLarga: '' },
                        { auth: true, empresa, nombre, token }
                    ))
                    :
                    res.status(401).send(new GenericResponse(
                        { codigo: tiposResponse.UNAUTHORIZED, descripcion: 'Usuario o clave incorrecto', descripcionLarga: '' },
                        { auth: false, empresa, nombre, token }
                    ))
    
            })
    } else {
        res.status(401).send(new GenericResponse(
            { 
                codigo: tiposResponse.UNAUTHORIZED, 
                descripcion: 'Error en el body', 
                descripcionLarga: `Falta el parámetro: ${
                    !empresa ?    'empresa' : 
                    !nombre  ?    'nombre'  : 
                                  'clave'
                }` 
            },
            { auth: false}
        ))
    }



});

/**************************************************************************************/
/**************************************************************************************/

module.exports = router;