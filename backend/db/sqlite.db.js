const Database = require('better-sqlite3');
const moment = require('moment');
const fs = require('fs');
let SqliteDB = null;
exports.setNewDB = (fileName) => {
    try{
        if(!!SqliteDB) SqliteDB.close();
        const db = new Database(`./files/${fileName}`, { verbose: console.log });
        SqliteDB = db;
        return SqliteDB;
    }catch(error) {
        console.log(error.message)
        return null;
    }
}
exports.getSqlite = async () => {
    try{
        if(!!SqliteDB) return SqliteDB;
        else {
            const fileNames = await fs.promises.readdir('./files');
            if(!fileNames.length) return null;
            const db = new Database(`./files/${fileNames[0]}`, { verbose: console.log });
            SqliteDB = db;
            return SqliteDB;
        }
    }catch(error) {
        console.log(error.message)
        return null;
    }  
}
exports.getAllProducts = async() => {
    const db = await this.getSqlite()
    if(!!db) {
        let array = [];
        const stmt = db.prepare('SELECT * FROM Products');
        for (const product of stmt.iterate()) {
            array.push(product)
        }
        return array;
    }else {
        return []
    }
}
exports.getAllLocations = async() => {
    const db = await this.getSqlite()
    if(!!db) {
        let array = [];
        const stmt = db.prepare('SELECT * FROM Locations');
        for (const location of stmt.iterate()) {
            array.push(location)
        }
        return array;
    }else {
        return []
    }
}
exports.getResult = async(fc, from, to) => {
    const db = await this.getSqlite()
    if(!!db) {
        let products = [];
        let query = `SELECT * FROM Products LEFT JOIN Locations on Products.Asin=Locations.Asin WHERE Locations.Fc='${fc}'`
        const stmt = db.prepare( query );
        for (const element of stmt.iterate()) {
            const {Asin1, ...rest} = element
            products.push(rest)
        }
        let _products = [...products];
        if(!!from) {
            _products = _products.filter(el => !!el['Date']).filter(el => {
                return moment(el['Date']).isAfter(from) || moment(el['Date']).isSame(from) ; 
            })
        }
        if(!!to) {
            _products = _products.filter(el => !!el['Date']).filter(el => {
                return moment(el['Date']).isBefore(to) || moment(el['Date']).isSame(to) ; 
            })
        }
        // HP, LP, AP, LSD, SSD, ASD, LMD, SMD, AMD, LLD , SLD, ALD, CATEGORY, SUBCATEGORY, BRAND 
    
    let array = [..._products];
    array = array.filter(el => !!el['Price'])
    array.sort((a, b) => a['Price'] < b['Price']? 1: -1);
    let HP = array.filter((el, index) => !!el && index < 5).map(el => el['Price']);
    array = array.reverse();
    let LP = array.filter((el, index) => !!el && index < 5).map(el => el['Price']);
    let AP = array.map(el => el['Price']).reduce((a, b) => a + b, 0) / array.length;
    AP = parseInt(AP * 10000) / 10000;

    array = [..._products];
    array = array.filter(el => !!el['Shortest'])
    array.sort((a, b) => a['Shortest'] < b['Shortest']? 1: -1);
    let LSD = array.filter((el, index) => !!el && index < 5).map(el => el['Shortest']);
    array = array.reverse();
    let SSD = array.filter((el, index) => !!el && index < 5).map(el => el['Shortest']);
    let ASD = array.map(el => el['Shortest']).reduce((a, b) => a + b, 0) / array.length;
    ASD = parseInt(ASD * 10000) / 10000;
    
    array = [..._products];
    array = array.filter(el => !!el['Median'])
    array.sort((a, b) => a['Median'] < b['Median']? 1: -1);
    let LMD = array.filter((el, index) => !!el && index < 5).map(el => el['Median']);
    array = array.reverse();
    let SMD = array.filter((el, index) => !!el && index < 5).map(el => el['Median']);
    let AMD = array.map(el => el['Median']).reduce((a, b) => a + b, 0) / array.length;
    AMD = parseInt(AMD * 10000) / 10000;
   
    array = [..._products];
    array = array.filter(el => !!el['Longest'])
    array.sort((a, b) => a['Longest'] < b['Longest']? 1: -1);
    let LLD = array.filter((el, index) => !!el && index < 5).map(el => el['Longest']);
    array = array.reverse();
    let SLD = array.filter((el, index) => !!el && index < 5).map(el => el['Longest']);
    let ALD = array.map(el => el['Longest']).reduce((a, b) => a + b, 0) / array.length;
    ALD = parseInt(ALD * 10000) / 10000;

    array = [..._products];
    array = array.filter(el => !!el['C1'])
    let categorys = [...new Set(array.map(el => el['C1']))]
    let CATEGORY = [];
    categorys.forEach(category => {
        let arr = array.filter(el => el['C1'] === category);
        CATEGORY.push({  label: category, count: arr.length })
    })
    CATEGORY.sort((a, b) => a['count'] < b['count']? 1: -1);

    array = [..._products];
    array = array.filter(el => !!el['C2'])
    let sub_categorys = [...new Set(array.map(el => el['C2']))]
    let SUBCATEGORY = [];
    sub_categorys.forEach(label => {
        let arr = array.filter(el => el['C2'] === label);
        SUBCATEGORY.push({  label: label, count: arr.length })
    })
    SUBCATEGORY.sort((a, b) => a['count'] < b['count']? 1: -1);

    array = [..._products];
    array = array.filter(el => !!el['Brand'])
    let brands = [...new Set(array.map(el => el['Brand']))]
    let BRAND = [];
    brands.forEach(brand => {
        let arr = array.filter(el => el['Brand'] === brand);
        BRAND.push({  label: brand, count: arr.length })
    })
    BRAND.sort((a, b) => a['count'] < b['count']? 1: -1);
    return [
        { label: 'Highest Prices', array: HP },
        { label: 'Lowest Prices', array: LP },
        { label: 'Average Prices', array: [AP] },
        { label: 'Largest Shortest Dimensions', array: LSD },
        { label: 'Smallest Shortest Dimensions', array: SSD },
        { label: 'Average Shortest Dimension', array: [ASD] },
        { label: 'Largest Median Dimensions', array: LMD },
        { label: 'Smallest Median Dimensions', array: SMD },
        { label: 'Average Median Dimension', array: [AMD] },
        { label: 'Largest Longest Dimensions', array: LLD },
        { label: 'Smallest Longest Dimensions', array: SLD },
        { label: 'Average Longest Dimension', array: [ALD] },
        { label: 'Category', array: CATEGORY.map(el => el['label']) },
        { label: 'Category Count', array: CATEGORY.map(el => el['count']) },
        { label: 'Subcategory', array: SUBCATEGORY.map(el => el['label']) },
        { label: 'Subcategory Count', array: SUBCATEGORY.map(el => el['count']) },
        { label: 'Brand', array: BRAND.map(el => el['label']) },
        { label: 'Brand Count', array: BRAND.map(el => el['count']) },
    ]
    }else {
        return []
    }
}