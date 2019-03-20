var express = require('express');
var router = express.Router();
const dbService = require('../services/dbService');
const storesProcedures = require('../constants/storesProcedures');
const TYPES = require('tedious').TYPES;
const SpParam = require('../models/spParam')

router
    .get(
        '/', 
        (req, res, next) => dbService.executeQuery(
                `
                SELECT 
                    mta_c_empresa, 
                    mta_n_auditoria, 
                    mta_n_actividad, 
                    mta_n_objetivo, 
                    mta_actividad, 
                    mta_existe, 
                    mta_existe_descrip, 
                    mta_norma, 
                    mta_norma_descrip, 
                    mta_referencia, 
                    mta_ac_estado, 
                    mta_usuario, 
                    mta_f_graba, 
                    mta_n_riesgo, 
                    mta_existe_res, 
                    mta_existe_descrip_res
                FROM au_matriz_ac
                    WHERE  mta_c_empresa = '${req.query.mta_c_empresa}'
                    AND	   mta_n_auditoria = '${req.query.mta_n_auditoria}'
                    AND    mta_n_objetivo =  '${req.query.mta_n_objetivo}'
                    AND    mta_n_riesgo =  '${req.query.mta_n_riesgo}'
                    AND    mta_n_actividad =  '${req.query.mta_n_actividad}'
                `
            )
                .then(queryResp => { 
                    if (queryResp && queryResp.data && queryResp.data.length > 0) {
                        res.send({
                            data: queryResp.data[0],
                            error: null
                        })
                    } else {
                        res.send({
                            data: null,
                            error: null
                        })
                    }
                })
                .catch(err => {
                    res.send(err)
                })
    )
    .post(
        '/',
        (req, res, next) => dbService.executeSP(
            storesProcedures.s_AU_MATRIZ_AC_CRUD, 
            [
                new SpParam('paction', TYPES.Char, 'I'),
                new SpParam('p_c_empresa', TYPES.Int, req.body.p_c_empresa),
                new SpParam('p_n_auditoria', TYPES.Int, req.body.p_n_auditoria),
                new SpParam('p_n_actividad', TYPES.SmallInt, req.body.p_n_actividad),
                new SpParam('p_n_objetivo', TYPES.SmallInt, req.body.p_n_objetivo),
                new SpParam('p_actividad', TYPES.VarChar, req.body.p_actividad),
                new SpParam(
                    'p_existe', 
                    TYPES.Char, 
                    req.body.p_existe
                ),
                new SpParam('p_existe_descrip', TYPES.VarChar, req.body.p_existe_descrip),
                new SpParam('p_norma', TYPES.Char, req.body.p_norma),
                new SpParam('p_norma_descrip', TYPES.VarChar, req.body.p_norma_descrip),
                new SpParam('p_referencia', TYPES.VarChar, req.body.p_referencia),
                new SpParam('p_ac_estado', TYPES.Char, req.body.p_ac_estado),
                new SpParam('p_usuario', TYPES.VarChar, req.body.p_usuario),
                new SpParam('p_n_riesgo', TYPES.SmallInt, req.body.p_n_riesgo)
            ]
        )
            .then(resp => {
                if (resp && resp.data) {
                    
                    const infoResp = { 
                        ...resp,
                        infoModal: {
                            title: 'Operación realizada',
                            innerText: `La Acción de Control se creó con éxito`
                        }
                    };

                    res.send(infoResp)
                } else {

                    const infoResp = { 
                        infoModal: {
                            title: 'Error',
                            innerText: `Algo salió mal`
                        }
                    };

                    res.send(infoResp)
                }
            })
            .catch(err => {
                res.send(err)
            })
    )
    .put(
        '/',
        (req, res, next) => dbService.executeSP(
            storesProcedures.s_AU_MATRIZ_AC_CRUD, 
            [
                new SpParam('paction', TYPES.Char, 'U'),
                new SpParam('p_c_empresa', TYPES.Int, req.body.p_c_empresa),
                new SpParam('p_n_auditoria', TYPES.Int, req.body.p_n_auditoria),
                new SpParam('p_n_actividad', TYPES.SmallInt, req.body.p_n_actividad),
                new SpParam('p_n_objetivo', TYPES.SmallInt, req.body.p_n_objetivo),
                new SpParam('p_actividad', TYPES.VarChar, req.body.p_actividad),
                new SpParam(
                    'p_existe', 
                    TYPES.Char, 
                    req.body.p_existe
                ),
                new SpParam('p_existe_descrip', TYPES.VarChar, req.body.p_existe_descrip),
                new SpParam('p_norma', TYPES.Char, req.body.p_norma),
                new SpParam('p_norma_descrip', TYPES.VarChar, req.body.p_norma_descrip),
                new SpParam('p_referencia', TYPES.VarChar, req.body.p_referencia),
                new SpParam('p_ac_estado', TYPES.Char, req.body.p_ac_estado),
                new SpParam('p_usuario', TYPES.VarChar, req.body.p_usuario),
                new SpParam('p_n_riesgo', TYPES.SmallInt, req.body.p_n_riesgo)
            ]
        )
            .then(resp => {
                if (resp && resp.data) {
                    
                    const infoResp = { 
                        ...resp,
                        infoModal: {
                            title: 'Operación realizada',
                            innerText: `La Acción Relacionada se editó con éxito`
                        }
                    };

                    res.send(infoResp)
                } else {

                    const infoResp = { 
                        infoModal: {
                            title: 'Error',
                            innerText: `Algo salió mal`
                        }
                    };

                    res.send(infoResp)
                }
            })
            .catch(err => {
                res.send(err)
            })
    )
    .delete(
        '/:p_n_actividad',
        (req, res, next) => 
            dbService.executeSP(
                storesProcedures.s_AU_MATRIZ_AC_CRUD, 
                [
                    new SpParam('paction', TYPES.Char, 'D'),
                    new SpParam('p_c_empresa', TYPES.Int, req.body.p_c_empresa),
                    new SpParam('p_n_auditoria', TYPES.Int, req.body.p_n_auditoria),
                    new SpParam('p_n_actividad', TYPES.SmallInt, req.params.p_n_actividad),
                    new SpParam('p_n_objetivo', TYPES.SmallInt, req.body.p_n_objetivo),
                    new SpParam('p_actividad', TYPES.VarChar, null),
                    new SpParam('p_existe', TYPES.Char, null),
                    new SpParam('p_existe_descrip', TYPES.VarChar, null),
                    new SpParam('p_norma', TYPES.Char, null),
                    new SpParam('p_norma_descrip', TYPES.VarChar, null),
                    new SpParam('p_referencia', TYPES.VarChar, null),
                    new SpParam('p_ac_estado', TYPES.Char, null),
                    new SpParam('p_usuario', TYPES.VarChar, null),
                    new SpParam('p_n_riesgo', TYPES.SmallInt, req.body.p_n_riesgo)
                ]
            )
                .then(resp => {
                    if (resp && resp.data) {
                        
                        const infoResp = { 
                            ...resp,
                            infoModal: {
                                title: 'Operación realizada',
                                innerText: `El Riesgo Relacionado se borró con éxito`
                            }
                        };
    
                        res.send(infoResp)
                    } else {
    
                        const infoResp = { 
                            infoModal: {
                                title: 'Error',
                                innerText: `Algo salió mal`
                            }
                        };
    
                        res.send(infoResp)
                    }
                })
                .catch(err => {
                    res.send(err)
                })
        
    )

module.exports = router;