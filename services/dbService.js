// Dependencias
const promise = require('bluebird');
const Connection = require("tedious").Connection;
const Request = require("tedious").Request;
// const TYPES = require('tedious').TYPES;

// Configs
const config = require("../constants/configDb")
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
                        data: rows,
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
                        data: rows,
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


/*

rq.addParameter('c_empresa', TYPES.Int, 1);
rq.addParameter('n_auditoria', TYPES.Int, 1);
rq.addParameter('c_ciclo', TYPES.Int, 1);
rq.addParameter('n_subciclo', TYPES.Int, 1);
rq.addParameter('actividad', TYPES.VarChar, '');
rq.addParameter('componente_ci', TYPES.VarChar, '');

*/