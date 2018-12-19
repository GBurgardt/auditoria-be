var express = require('express');
var router = express.Router();
const dbService = require('../services/dbService');

router.get('/', function (req, res, next) {

    dbService.executeQuery(
        `
        SELECT cls_n_subciclo, cls_nombre
            FROM au_matriz, bm_ciclos_s
            WHERE mt_c_empresa = '${req.query.mt_c_empresa}'
            AND	mt_n_auditoria = '${req.query.mt_n_auditoria}'
            AND	mt_c_ciclo = '${req.query.mt_c_ciclo}'
            AND mt_c_empresa = cls_c_empresa
            AND mt_c_ciclo = cls_c_ciclo
            AND mt_n_subciclo = cls_n_subciclo
        `
    )
        .then(resp => {   
            if (resp && resp.data) {
                res.send(resp)
            } else {
                res.send([])
            }
        })
        .catch(err => {
            res.send(err)
        })
});

module.exports = router;