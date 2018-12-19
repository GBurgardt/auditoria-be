var express = require('express');
var router = express.Router();
const dbService = require('../services/dbService');

router.get('/', function (req, res, next) {

    dbService.executeQuery(
        `
        SELECT distinct cl_c_ciclo, cl_nombre 
            FROM au_matriz, bm_ciclos 
            WHERE mt_c_empresa = '${req.query.mt_c_empresa}'
                AND mt_n_auditoria = '${req.query.mt_n_auditoria}' 
                AND mt_c_empresa = cl_c_empresa
				AND mt_c_ciclo = cl_c_ciclo
                ORDER BY cl_nombre
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