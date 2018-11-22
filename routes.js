const dbService = require('./services/dbService');
const storesProcedures = require('./constants/storesProcedures');
const TYPES = require('tedious').TYPES;
const SpParam = require('./models/spParam')

module.exports = {
    name: 'ApiRoutes',
    register: async (server, options) => {
        server.route([
            {
                method: 'GET',
                path: '/',
                handler: async (req, res) => {
                    return 'test!';
                }
            },
            {
                method: 'GET',
                path: '/test',
                handler: async (req, res) => 
                    await dbService.executeQuery('select top 10 * from Audinterna.dbo.AU_MATRIZ')
            },
            {
                method: 'GET',
                path: '/matrices',
                handler: async (req, res) => 
                    await dbService.executeSP(
                        storesProcedures.SP_MATRICES_001, 
                        [
                            new SpParam('c_empresa', TYPES.Int, req.query.c_empresa),
                            new SpParam('n_auditoria', TYPES.Int, req.query.n_auditoria),
                            new SpParam('c_ciclo', TYPES.Int, req.query.c_ciclo),
                            new SpParam('n_subciclo', TYPES.Int, req.query.n_subciclo),
                            new SpParam('actividad', TYPES.VarChar, ''),
                            new SpParam('componente_ci', TYPES.VarChar, ''),
                        ]
                    )
            }
        ]);
    }
}




/*

{
    method: 'GET',
    path: '/usuarios/{nombre?}',
    handler: async (req, res) => {
        const nombre = (req.params.nombre) ? req.params.nombre : 'invitado';
        return `Hola ${nombre}!`;
    }
},
{
    method: 'POST',
    path: '/usuarios/',
    handler: async (req, res) => {
        const newUser = {
            nombre: req.payload.nombre,
            apellido: req.payload.apellido
        };
        return res.response({
            datos: newUser
        }).type('application/json');
    }
}

*/