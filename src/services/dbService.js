/**
 * dbService
 * 
 * Servicio que se ocupa de todo lo relacionado a consultas o acciones con la base de datos.
 * Proporciona métodos de alto nivel para usar stores procedures y consultas comunes, asi como 
 * configura las conecciones.
 */

// Dependencias
const promise = require('bluebird');
const Connection = require("tedious").Connection;
const Request = require("tedious").Request;

// Configs
const config = require('../constants/configDb')
const typesActionsDb = require("../constants/typesActionsDb")

/**
 * Wrappeo un tipo de procedimiento de la db en una promise
 * @param {*} action 
 * @param {*} callback 
 */
const execute = (action, callback) =>
    new promise((resolve, reject) => {
        const connection = new Connection(config);

        connection.on(
            'connect', 
            (errDb) => 
                connection[action](
                    callback(resolve, reject, connection)
                )
        )
    })


/**
 * Mappea la respuesta horrible que tira tedious a algo mas legible
 * @param {*} resp 
 */
const mappedResponse = (rows) => 
    rows.map(row => 
        row.reduce((json, value, key) => { 
            json[value.metadata.colName] = value.value; 
            return json; 
        }, {})
    )

/**************************************************************************************/
/**************************************************************************************/


/**
 * Ejecuta una query
 * @param {*} query 
 */
const executeQuery = (query) => execute(
    typesActionsDb.execSql, 
    (resolve, reject, connection) => 
        new Request(
            query,
            (error, rowCount, rows) => {
                error ?
                    reject({
                        data: null,
                        size: null,
                        error
                    }) :
                    resolve({
                        // data: rows,
                        data: mappedResponse(rows),
                        size: rowCount ? rowCount : rows.length,
                        error: null
                    });

                connection.close();
            }
        )
)

/**
 * Ejecuta un store procedure
 * @param {*} name Nombre del store
 * @param {*} params Formato: [{ name, type, value }, {...}, ...]. Donde type es un tipo de TYPES
 */
const executeSP = (nameSp, params) => execute(
    typesActionsDb.callProcedure, 
    (resolve, reject, connection) => {
        const rq = new Request(
            nameSp,
            (error, rowCount, rows) => {
                error ?
                    reject({
                        data: null,
                        size: null,
                        error
                    }) :
                    resolve({
                        // data: rows,
                        data: mappedResponse(rows),
                        size: rowCount ? rowCount : rows.length,
                        error: null
                    });

                connection.close();

            }
        );
        
        params.forEach(
            p => rq.addParameter(p.name, p.type, p.value)
        )

        return rq;
    }
)

/**************************************************************************************/
/**************************************************************************************/

/**
 * Funciones relacionadas a la DB
 */
module.exports = {
    executeQuery,
    executeSP
}