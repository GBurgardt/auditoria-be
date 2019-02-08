var express = require('express');
var router = express.Router();
const dbService = require('../services/dbService');

router.get(
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
);

module.exports = router;