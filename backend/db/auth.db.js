const Database = require('better-sqlite3');
const { v4: uuidv4 } = require('uuid');
var bcrypt = require('bcryptjs');

let authDB = null;
exports.getAuth = async () => {
    try{
        if(!!authDB) return authDB;
        else {
            const db = new Database(`./store/auth.db`, { verbose: console.log });
            authDB = db;
            return authDB;
        }
    }catch(error) {
        console.log(error.message)
        return null;
    }  
}
exports.getUserByEmail = async (email) => {
    const db = await this.getAuth();
    let array = [];
    const stmt = db.prepare(`SELECT * FROM Users Where email='${email}'`);
    for (const user of stmt.iterate()) {
        array.push(user)
    }
    return !!array.length? array[0]: null;
}
exports.getUsers = async () => {
    const db = await this.getAuth();
    let array = [];
    const stmt = db.prepare(`SELECT * FROM Users Where role=0`);
    for (const user of stmt.iterate()) {
        array.push(user)
    }
    return array
}
exports.deleteUser = async (id) => {
    const db = await this.getAuth();
    var deleteQuery = `DELETE FROM Users WHERE id=?`;
    db.prepare(deleteQuery).run(id);
}
exports.limitUser = async (id, checked) => {
    console.log(checked)
    const db = await this.getAuth();
    var deleteQuery = `UPDATE Users SET user_limit=? WHERE id=?`;
    db.prepare(deleteQuery).run(checked, id);
}
exports.getAdmin = async () => {
    const db = await this.getAuth();
    let array = [];
    const stmt = db.prepare(`SELECT * FROM Users Where role=10`);
    for (const user of stmt.iterate()) {
        array.push(user)
    }
    return !!array.length? array[0]: null;
}
exports.createUser = async ( body ) => {
    const id = uuidv4();
    let { password, email, role } = body;
    password = await bcrypt.hash(password, 10);
    const db = await this.getAuth();
    var insertQuery = "INSERT INTO Users (id, email, password, role) VALUES (?, ?, ?, ?)";
    db.prepare(insertQuery).run(id, email, password, role);
    return { id, ...body };
}