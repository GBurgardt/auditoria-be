var express = require('express');
var router = express.Router();

const dbService = require('../services/dbService');
const storesProcedures = require('../constants/storesProcedures');
const TYPES = require('tedious').TYPES;
const SpParam = require('../models/spParam')

const mapKeys = require('lodash.mapkeys');

router.get('/', function (req, res, next) {
    dbService.executeSP(
        storesProcedures.s_BM_RIESGOS_DATOS, 
        [
            new SpParam('pRSG_C_EMPRESA', TYPES.Int, req.query.prsg_c_empresa)
        ]
    )
        .then(resp => {
            if (resp && resp.data) {
                // Mappeo la data
                const mappedResponse = { 
                    ...resp,
                    data: resp.data.map(
                        categ => mapKeys(
                            categ, 
                            (value, key) => key.toLowerCase()
                        )
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
