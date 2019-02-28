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
                    mtr_c_empresa,
                    mtr_n_auditoria,
                    mtr_n_riesgo,
                    mtr_n_objetivo,
                    mtr_riesgo,
                    mtr_accion,
                    mtr_usuario,
                    mtr_f_graba
                FROM au_matriz_ocr
                    WHERE  mtr_c_empresa = '${req.query.mtr_c_empresa}'
                    AND	   mtr_n_auditoria = '${req.query.mtr_n_auditoria}'
                    AND    mtr_n_riesgo =  '${req.query.mtr_n_riesgo}'
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
            storesProcedures.s_AU_MATRIZ_OCR_CRUD, 
            [
                new SpParam('paction', TYPES.Char, 'I'),
                new SpParam('p_c_empresa', TYPES.Int, req.body.p_c_empresa),
                new SpParam('p_n_auditoria', TYPES.Int, req.body.p_n_auditoria),
                new SpParam('p_n_riesgo', TYPES.SmallInt, req.body.p_n_riesgo),
                new SpParam('p_n_objetivo', TYPES.SmallInt, req.body.p_n_objetivo),
                new SpParam('p_riesgo', TYPES.VarChar, req.body.p_riesgo),
                new SpParam('p_accion', TYPES.VarChar, req.body.p_accion),
                new SpParam('p_usuario', TYPES.VarChar, req.body.p_usuario)
            ]
        )
            .then(resp => {
                if (resp && resp.data) {
                    
                    const infoResp = { 
                        ...resp,
                        infoModal: {
                            title: 'Operación realizada',
                            innerText: `El Riesgo Relacionado se creó con éxito`
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
            storesProcedures.s_AU_MATRIZ_OCR_CRUD, 
            [
                new SpParam('paction', TYPES.Char, 'U'),
                new SpParam('p_c_empresa', TYPES.Int, req.body.p_c_empresa),
                new SpParam('p_n_auditoria', TYPES.Int, req.body.p_n_auditoria),
                new SpParam('p_n_riesgo', TYPES.SmallInt, req.body.p_n_riesgo),
                new SpParam('p_n_objetivo', TYPES.SmallInt, req.body.p_n_objetivo),
                new SpParam('p_riesgo', TYPES.VarChar, req.body.p_riesgo),
                new SpParam('p_accion', TYPES.VarChar, req.body.p_accion),
                new SpParam('p_usuario', TYPES.VarChar, req.body.p_usuario)
            ]
        )
            .then(resp => {
                if (resp && resp.data) {
                    
                    const infoResp = { 
                        ...resp,
                        infoModal: {
                            title: 'Operación realizada',
                            innerText: `El Riesgo Relacionado se editó con éxito`
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
        '/:p_n_riesgo',
        (req, res, next) => 
            dbService.executeSP(
                storesProcedures.s_AU_MATRIZ_OCR_CRUD, 
                [
                    new SpParam('paction', TYPES.Char, 'D'),
                    new SpParam('p_c_empresa', TYPES.Int, req.query.p_c_empresa),
                    new SpParam('p_n_auditoria', TYPES.Int, req.query.p_n_auditoria),
                    new SpParam('p_n_riesgo', TYPES.SmallInt, req.params.p_n_riesgo),
                    new SpParam('p_n_objetivo', TYPES.SmallInt, null),
                    new SpParam('p_riesgo', TYPES.VarChar, null),
                    new SpParam('p_accion', TYPES.VarChar, null),
                    new SpParam('p_usuario', TYPES.VarChar, null)
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