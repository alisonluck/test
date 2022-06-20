const DB_API = require('../db/sqlite.db');
exports.getAllInfo = async (request, res) => {
    try{
        const products = await DB_API.getAllProducts();
        const locations = await DB_API.getAllLocations();
        res.send({ error: '', status: true, products, locations });
    }catch(error) {
        res.send({ error: error.message, status: false  });
    }
}
exports.getLocations = async (request, res) => {
    try{
        const locations = await DB_API.getAllLocations();
        res.send({ error: '', status: true, locations });
    }catch(error) {
        res.send({ error: error.message, status: false  });
    }
}
exports.getResult = async (request, res) => {
    const {body} = request;
    try {
        const {fc, from , to} = body;
        const result = await DB_API.getResult(fc, from , to);
        res.send({ error: '', status: true, result });
    }catch(error) {
        console.log(error)
        res.send({ error: error.message, status: false  });
    }
}