import express from "express";

import { getPostId, getPosts, obtenerInventarioPorFiltros } from "./database/methods.js";
import { reportarConsulta } from "./middlewares/middlewares.js";
import { handleErrors } from "./database/errors.js";


const app = express();

app.use(express.json())

const prepararHATEOAS = (inventario) => {
    const results = inventario.map((j) => { return {
                nombre: j.nombre,
                precio: j.precio,
                url: `http://localhost:3000/joyas/${j.id}`,
            }
    })
    const total = inventario.length 
    const HATEOAS = {
    total,
    results }
    return HATEOAS }

app.get("/joyas", reportarConsulta, async(req, res) => {
    const queryStrings = req.query;

    try {
        
        const inventario = await getPosts(queryStrings)
        const HATEOAS = await prepararHATEOAS(inventario)
        res.json(HATEOAS)
    } catch (error) {
        const { status, message } = handleErrors(error.code)
        return res.status(status).json({ ok: false, result: message})
    }
})

app.get("/joyas/filtros", reportarConsulta, async(req, res) => {
    const queryStrings = req.query;

    try {
        
        const inventario = await obtenerInventarioPorFiltros(queryStrings)
        const HATEOAS = await prepararHATEOAS(inventario)
        res.json(HATEOAS)
    } catch (error) {
        console.log(error)
    }
})

app.get("/joyas/:id", reportarConsulta, async(req, res) => {
    const {id} = req.params;
    try {
        const inventarioId = await getPostId({id})
        res.json(inventarioId)
    } catch (error) {
        console.log(error)
    }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Servidor listo en http://localhost:" + PORT);
})