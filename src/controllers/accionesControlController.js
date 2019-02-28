var express = require('express');
var router = express.Router();
const dbService = require('../services/dbService');
const storesProcedures = require('../constants/storesProcedures');
const TYPES = require('tedious').TYPES;
const SpParam = require('../models/spParam')


/*

"select * from au_matriz_ac " +  	                       
                       "where  mta_c_empresa  = (?) " +
                       "and	   mta_n_auditoria    = (?) " +
                       "and    mta_n_objetivo  = (?) " +
		               "and    mta_n_actividad  = (?) ";

*/

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
            storesProcedures.s_AC_MATRIZ_OC_CRUD, 
            [
                new SpParam('pAction', TYPES.Char, 'I'),
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
                    
                    const infoResp = { 
                        ...resp,
                        infoModal: {
                            title: 'Operación realizada',
                            innerText: `El Objetivo de Control se creó con éxito`
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
            storesProcedures.s_AC_MATRIZ_OC_CRUD, 
            [
                new SpParam('pAction', TYPES.Char, 'U'),
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
                    
                    const infoResp = { 
                        ...resp,
                        infoModal: {
                            title: 'Operación realizada',
                            innerText: `El Objetivo de Control se editó con éxito`
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
        '/:pmto_objetivo',
        (req, res, next) => 
            dbService.executeSP(
                storesProcedures.s_AC_MATRIZ_OC_CRUD, 
                [
                    new SpParam('pAction', TYPES.Char, 'D'),
                    new SpParam('pMTO_C_EMPRESA', TYPES.Int, req.query.pmto_c_empresa),
                    new SpParam('pMTO_N_AUDITORIA', TYPES.Int, req.query.pmto_n_auditoria),
                    new SpParam('pMTO_N_OBJETIVO', TYPES.SmallInt, req.params.pmto_objetivo),
                    new SpParam('pMTO_N_CICLO', TYPES.Int, null),
                    new SpParam('pMTO_OBJETIVO', TYPES.VarChar, null),
                    new SpParam('pMTO_C_CATEGORIA', TYPES.SmallInt, null),
                    new SpParam('pMTO_USUARIO', TYPES.VarChar, null),
                    new SpParam('pMTO_CALIFICA', TYPES.Char, null),
                    new SpParam('pMTO_P_MAXIMO', TYPES.Decimal, null),
                    new SpParam('pMTO_VALORACION', TYPES.Decimal, null),
                    new SpParam('pMTO_C_RIESGO', TYPES.Decimal, null)
                ]
            )
                .then(resp => {
                    if (resp && resp.data) {
                        
                        const infoResp = { 
                            ...resp,
                            infoModal: {
                                title: 'Operación realizada',
                                innerText: `El Objetivo de Control se borró con éxito`
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