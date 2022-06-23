const DB_API = require('../db/sqlite.db');
const AUTH_API = require('../db/auth.db');
const jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

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
exports.getScoreboard = async (request, res) => {
    const {body} = request;
    try {
        const {fcs} = body;
        const result = await DB_API.getScoreboard(fcs);
        res.send({ error: '', status: true, result });
    }catch(error) {
        console.log(error)
        res.send({ error: error.message, status: false  });
    }
}
exports.getChartData = async (request, res) => {
    const {body} = request;
    try {
        const {fc} = body;
        const result = await DB_API.getChartData(fc);
        res.send({ error: '', status: true, result });
    }catch(error) {
        console.log(error)
        res.send({ error: error.message, status: false  });
    }
}
exports.register = async (req, res) => {
    try{
        const { email } = req.body;
        const user = await AUTH_API.getUserByEmail(email);
        if(!!user) return res.send({ error: 'User Already Exist. Please Login', status: false  });
        const admin  =await AUTH_API.getAdmin();
        if(!!admin) return res.send({ error: 'Since the admin already exists, you need to change the role to user.', status: false  });
        const data = await AUTH_API.createUser(req.body);
        const token = jwt.sign(
            { id: data.id, email },
            '12345678',
            {
              expiresIn: "24h",
            }
        );
        data['token'] = token;
        res.send({ status: true, user: data  });
    }catch(error) {
        res.send({ error: error.message, status: false  });
    }
}
exports.login = async (req, res) => {
    try{
        const { email, password } = req.body;
        const user = await AUTH_API.getUserByEmail(email);
        if (!!user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                { id: user.id, email },
                '12345678',
                {
                  expiresIn: "24h",
                }
            );
            return res.send({ status: true, user: {token, ...user}  });
        }
        res.send({ error: 'Invalid Credentials', status: false  });
    }catch(error) {
        res.send({ error: error.message, status: false  });
    }
}