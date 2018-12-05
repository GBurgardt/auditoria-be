module.exports = 
    class ControlResponse {
        constructor(control) {
            this.codigo = control.codigo;
            this.descripcion = control.descripcion;
            this.descripcionLarga = control.descripcionLarga;
        }
    }