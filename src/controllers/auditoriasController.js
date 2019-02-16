var express = require('express');
var router = express.Router();
const dbService = require('../services/dbService');

router.get('/', function (req, res, next) {
    dbService.executeQuery(
        `
        select au_t_auditoria, au_n_auditoria, AU_DESCRIP + ' - ' + convert(varchar(10), AU_EJERCICIO) + '  (' + 
            case AU_T_AUDITORIA 
            when 'O' then 'Operativa' 
            when 'S' then 'Sistema' 
            else 'Otras'            
            end + ')' AS descrip 
            from   Audinterna.dbo.AU_AUDITORIAS
            where  AU_C_EMPRESA = ${req.query.au_c_empresa}
            order by AU_N_AUDITORIA desc
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