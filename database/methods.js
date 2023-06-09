import pkg from "pg";
const {Pool} = pkg;

import format from "format";

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'joyas',
    password: 'udech',
    port: 5432,
    allowExitOnIdle: true,
});

export const getPosts = async({ limit = 6, order_by = "id_ASC" , page = 1 }) => {

    let consulta = "SELECT * FROM inventario"
    const [campo, direccion] = order_by.split("_")

    if(page){
        const offset = (page - 1) * limit
        consulta = "SELECT * FROM inventario order by %s %s LIMIT %s OFFSET %s"
        const formattedQuery = format(consulta, campo, direccion, limit, offset);
        const { rows } = await pool.query(formattedQuery)
        return rows
    }else{
        const { rows } = await pool.query(consulta)
        return rows
    }

}

export const obtenerInventarioPorFiltros = async ({ filters }) => { 
    const propertys = Object.keys(filters);
    let query = "SELECT * FROM inventario WHERE "; 

    const operatorsQueryObjet = { 
        $eq: "=", 
        $gt: ">", 
        $gte: ">=", 
        $lt: "<", 
        $lte: "<=", 
        $ne: "!=", 
    }; 
    
    let arrayFormat = []; 
    
    for (const key in filters) { 
        const name = key; 
        const object = filters[name]; 
        const operator = Object.keys(object)[0]; 
        const value = object[operator]; 
    
        query += "%s %s '%s'";

        arrayFormat.push(name, operatorsQueryObjet[operator], value); 
        console.log(arrayFormat); 
    
        if (key !== propertys[propertys.length - 1]) { 
        query += " AND "; 
        } 
    } 
    const formattedQuery = format(query, ...arrayFormat); 
        const { rows } = await pool.query(formattedQuery); 
        return rows
    
}

export const getPostId = async({id}) => {
    if (!id) {
        throw { code: "400" }
    }

    const comando = "SELECT * FROM inventario WHERE id = $1"
    const {rows} = await pool.query(comando, [id])
    return rows[0]
}