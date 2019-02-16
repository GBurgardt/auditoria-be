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
                    mto_c_empresa,
                    mto_n_auditoria,
                    mto_n_objetivo,
                    mto_n_ciclo,
                    mto_objetivo,
                    mto_c_categoria,
                    mto_usuario,
                    mto_f_graba,
                    mto_p_maximo,
                    mto_califica,
                    mto_valoracion,
                    mto_c_riesgo
                FROM au_matriz_oc
                    WHERE  mto_c_empresa = '${req.query.mt_c_empresa}'
                    AND	   mto_n_auditoria = '${req.query.mt_n_auditoria}'
                    AND    mto_n_objetivo =  '${req.query.mto_n_objetivo}'
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
            storesProcedures.s_AC_MATRIZ_OC_CRUD, 
            [
                new SpParam('pAction', TYPES.Char, req.body.paction),
                new SpParam('pMTO_C_EMPRESA', TYPES.Int, req.body.pmto_c_empresa),
                new SpParam('pMTO_N_AUDITORIA', TYPES.Int, req.body.pmto_n_auditoria),
                new SpParam('pMTO_N_OBJETIVO', TYPES.SmallInt, req.body.pmto_n_objetivo),
                new SpParam('pMTO_N_CICLO', TYPES.Int, req.body.pmto_n_ciclo),
                new SpParam('pMTO_OBJETIVO', TYPES.VarChar, req.body.pmto_objetivo),
                new SpParam('pMTO_C_CATEGORIA', TYPES.SmallInt, req.body.pmto_c_categoria),
                new SpParam('pMTO_USUARIO', TYPES.VarChar, req.body.pmto_usuario),
                new SpParam('pMTO_CALIFICA', TYPES.Char, req.body.pmto_califica),
                new SpParam('pMTO_P_MAXIMO', TYPES.Decimal, req.body.pmto_p_maximo),
                new SpParam('pMTO_VALORACION', TYPES.Decimal, req.body.pmto_valoracion),
                new SpParam('pMTO_C_RIESGO', TYPES.Decimal, req.body.pmto_c_riesgo)
            ]
        )
            .then(resp => {
                if (resp && resp.data) {
                    
                    console.log(resp)
    
                    res.send(resp)
                } else {
                    res.send([])
                }
            })
            .catch(err => {
                res.send(err)
            })
    )

module.exports = router;