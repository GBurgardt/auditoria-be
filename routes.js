module.exports = {
    name: 'ApiRoutes',
    register: async (server, options) => {
        server.route([
            {
                method: 'GET',
                path: '/',
                handler: async (req, res) => {
                    return 'test!';
                }
            },
            {
                method: 'GET',
                path: '/usuarios/{nombre?}',
                handler: async (req, res) => {
                    const nombre = (req.params.nombre) ? req.params.nombre : 'invitado';
                    return `Hola ${nombre}!`;
                }
            },
            {
                method: 'POST',
                path: '/usuarios/',
                handler: async (req, res) => {
                    const newUser = {
                        nombre: req.payload.nombre,
                        apellido: req.payload.apellido
                    };
                    return res.response({
                        datos: newUser
                    }).type('application/json');
                }
            }
        ]);
    }
}