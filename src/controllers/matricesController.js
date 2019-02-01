var express = require('express');
var router = express.Router();

const dbService = require('../services/dbService');
const storesProcedures = require('../constants/storesProcedures');
const TYPES = require('tedious').TYPES;
const SpParam = require('../models/spParam')

router.get('/', function (req, res, next) {
    dbService.executeSP(
        storesProcedures.SP_MATRICES_002, 
        [
            new SpParam('c_empresa', TYPES.Int, req.query.c_empresa),
            new SpParam('n_auditoria', TYPES.Int, req.query.n_auditoria),
            new SpParam('c_ciclo', TYPES.Int, req.query.c_ciclo),
            new SpParam('n_subciclo', TYPES.Int, req.query.n_subciclo),
            new SpParam('actividad', TYPES.VarChar, ''),
            new SpParam('componente_ci', TYPES.VarChar, '')
        ]
    )
        .then(resp => {
            if (resp && resp.data) {
                
                // Mappeo la data
                const mappedResponse = { 
                    ...resp,
                    data: resp.data
                        .filter(
                            row => row.t_registro === 'OC'
                        )
                        .map(
                            oc => {
                                const allChildren = resp.data
                                    .filter(
                                        row => 
                                            row.t_registro !== 'OC' && 
                                            row.mto_n_objetivo === oc.mto_n_objetivo
                                    )
                                return {
                                    ...oc,
                                    children: allChildren
                                        .filter(
                                            child => child.t_registro !== 'TR'
                                        )
                                        .map(
                                            child => ({
                                                ...child,
                                                children: allChildren
                                                    .filter(
                                                        grandchild => 
                                                            child.t_registro === 'AC' && 
                                                            grandchild.t_registro === 'TR' && 
                                                            child.mta_n_actividad === grandchild.mta_n_actividad
                                                    )
                                            })
                                        )
                                }
                            }
                        )
                };

                res.send(mappedResponse)
            } else {
                res.send([])
            }
        })
        .catch(err => {
            res.send(err)
        })

});

module.exports = router;


/* Tipos Registros Referencia

OC - Objetivo de Control
    RR - Riesgo Relacionado
    AC - Accion de Control
        TR - Tareas.

*/