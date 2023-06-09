export const reportarConsulta = async (req, res, next) => { 
    const url = req.url
    console.log(`
    Hoy ${new Date()}
    Se ha recibido una consulta en la ruta ${url} para ver el inventario de joyas.`)
    next()
    }