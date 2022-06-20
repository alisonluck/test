const fs = require('fs');
const DB_API = require('../db/sqlite.db');
exports.uploadFile = async (request, res) => {
    try{
        const fileName = request['file']['filename']
        DB_API.setNewDB(fileName);
        await deleteAllFiles(fileName);
        const locations = await DB_API.getAllLocations();
        res.send({ error: '', status: true, locations });
    }catch(error) {
        res.send({ error: error.message, status: false })
    }
}
const deleteAllFiles = async (dbFileName) => {
    const fileNames = await fs.promises.readdir('./files');
    for(let i = 0; i < fileNames.length; i++) {
        const fileName = fileNames[i];
        if(fileName !== dbFileName) {
            fs.unlinkSync(`./files/${fileName}`)
        }
    }
}