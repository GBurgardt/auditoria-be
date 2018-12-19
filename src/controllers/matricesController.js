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



/*

"select distinct cl_c_ciclo, cl_nombre "+
				"from    au_matriz, bm_ciclos "+
				"where mt_c_empresa = (?) " +
				"and     mt_n_auditoria = (?) " +
				"and     mt_c_empresa = cl_c_empresa " +
				"and     mt_c_ciclo = cl_c_ciclo " +
				"order by cl_nombre ";

*/