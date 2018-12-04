/**
 * authService
 * 
 * Controlador login, tokens, autorizaciones y registro
 */

// Dependencias
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const configJwt = require('../constants/configJwt');
const configRest = require('../constants/configRest');
const dbService = require('./dbService');



/**************************************************************************************/
/**************************************************************************************/

/**
 * Dado un user y su pass se lo busca en la db, y en caso de encontrarlo se retorna un token
 * @param {*} nombre 
 * @param {*} contra 
 */
const login = (nombre, contra) => {
    // Encripto la clave en sha256
    const shaPass = crypto.createHash('sha256')
        .update(contra).digest('hex');

    // Obtengo el usuario a partir de su nombre y su clave encryptada (sha256)
    const user = getUserFromDb(nombre, shaPass);

    return user

    // Retorno el token (o null si el usuario no existe)
    // return user ? generateToken(user) : null;
}

/**
 * Genera un token a partir de un usuario
 * @param {*} user 
 */
const generateToken = (user) => 
    jwt.sign(
        { 
            id: `${user.nombre}-${configRest.currentEmpresa}`
        }, 
        configJwt.secret, 
        {
            expiresIn: 86400 // expires in 24 hours
        }
    )

/**
 * Dado un user y su pass encryptada, se lo busca en la db y se lo retorna si se lo encuentra
 * @param {*} user 
 */
const getUserFromDb = (user, shaPass) => dbService.executeQuery(
    `SELECT US_C_EMPRESA, US_NOMBRE, US_CONTRA FROM Audinterna.dbo.MN_USUARIOS where us_nombre = 'hola' and us_contra = 'b221d9dbb083a7f33428d7c2a3c3198ae925614d70210e28716ccaa7cd4ddb79'`
)
// .then(resp => {
//     console.log(resp)
// })

/**************************************************************************************/
/**************************************************************************************/

/**
 * Funciones relacionadas a la DB
 */
module.exports = {
    login
}