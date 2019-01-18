/**
 * authService
 * 
 * Controlador login, tokens, autorizaciones y registro
 */

// Dependencias
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const configJwt = require('../constants/configJwt');
// const configRest = require('../constants/configRest');
const dbService = require('./dbService');



/**************************************************************************************/
/**************************************************************************************/

/**
 * Dado un user y su pass se lo busca en la db, y en caso de encontrarlo se retorna un token
 * @param {*} nombre 
 * @param {*} clave 
 */
const login = (empresa, nombre, clave) => {
    // Encripto la clave en sha256
    const shaPass = crypto.createHash('sha256')
        .update(clave).digest('hex');

    // Obtengo el usuario a partir de su nombre y su clave encryptada (sha256)
    return getUserFromDb(empresa, nombre, shaPass).then(user => 
        // Retorno el token (o null si el usuario no existe)
        user && user.data && user.data.length > 0 ? generateToken(user.data[0], empresa) : null
    )
}

/**
 * Genera un token a partir de un usuario
 * @param {*} user 
 */
const generateToken = (user, empresa) => 
    jwt.sign(
        { 
            id: `${user.nombre}-${empresa}`
        }, 
        configJwt.secret,
        {
            // expiresIn: 86400 // expires in 24 hours
            expiresIn: 60
        }
    )

/**
 * Verifica que el token sea valido
 * @param {*} token 
 */
const verifyToken = (token) => 
    jwt.verify(
        token, 
        configJwt.secret
    )

/**
 * Dado un user y su pass encryptada, se lo busca en la db y se lo retorna si se lo encuentra
 * @param {*} nombre 
 */
const getUserFromDb = (empresa, nombre, shaPass) => 
    dbService.executeQuery(
        `
        SELECT US_C_EMPRESA, US_NOMBRE, US_CONTRA 
            FROM Audinterna.dbo.MN_USUARIOS 
            WHERE 
                US_NOMBRE = '${nombre}' 
                and US_CONTRA = '${shaPass}'
                and US_C_EMPRESA = ${empresa}
        `
    )


/**************************************************************************************/
/**************************************************************************************/

/**
 * Funciones relacionadas a la DB
 */
module.exports = {
    login,
    verifyToken
}