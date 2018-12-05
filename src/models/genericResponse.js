const ControlResponse = require('./controlResponse')

module.exports = 
    class GenericResponse {
        constructor(control, datos) {
            this.control = new ControlResponse(control);
            this.datos = datos;
        }
    }