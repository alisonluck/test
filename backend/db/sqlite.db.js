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
exports.getScoreboard = async (fcs) => {
    const db = await this.getSqlite();
    let scoreBoards = [];
    let products = [];
    let query = `SELECT * FROM Products LEFT JOIN Locations on Products.Asin=Locations.Asin`;
    const stmt = db.prepare( query );
    for (const element of stmt.iterate()) {
        const {Asin1, ...rest} = element
        products.push(rest)
    }
    fcs.forEach(fc => {
        const _products = products.filter(el => el['Fc'] === fc);
        let array = [..._products];
        array = array.filter(el => !!el['Price'])
        let average_price = array.length? array.map(el => el['Price']).reduce((a, b) => a + b, 0) / array.length: 0;
        average_price = parseInt(average_price * 10000) / 10000;
        array = [..._products];
        array = array.filter(el => !!el['Shortest'])
        let average_shortest = array.length? array.map(el => el['Shortest']).reduce((a, b) => a + b, 0) / array.length: 0;
        average_shortest = parseInt(average_shortest * 10000) / 10000;

        array = [..._products];
        array = array.filter(el => !!el['Median'])
        let average_median = array.length? array.map(el => el['Median']).reduce((a, b) => a + b, 0) / array.length: 0;
        average_median = parseInt(average_median * 10000) / 10000;

        array = [..._products];
        array = array.filter(el => !!el['Longest'])
        let average_longest = array.length? array.map(el => el['Longest']).reduce((a, b) => a + b, 0) / array.length: 0;
        average_longest = parseInt(average_longest * 10000) / 10000;

        array = [..._products];
        array = array.filter(el => !!el['Weight'])
        let average_weight = array.length? array.map(el => el['Weight']).reduce((a, b) => a + b, 0) / array.length: 0;
        average_weight = parseInt(average_weight * 10000) / 10000;
/*
        array = [..._products];
        array = array.filter(el => !!el['NumberOfSellers'])
        let average_nos = array.length? array.map(el => el['NumberOfSellers']).reduce((a, b) => a + b, 0) / array.length: 0;
        average_nos = parseInt(average_nos * 10000) / 10000;

        array = [..._products];
        array = array.filter(el => !!el['NumberOfFbaSellers'])
        let average_nofs = array.length? array.map(el => el['NumberOfFbaSellers']).reduce((a, b) => a + b, 0) / array.length: 0;
        average_nofs = parseInt(average_nofs * 10000) / 10000;

        array = [..._products];
        array = array.filter(el => !!el['NumberOfUsedLikeNewOffers'])
        let average_noulno = array.length? array.map(el => el['NumberOfUsedLikeNewOffers']).reduce((a, b) => a + b, 0) / array.length: 0;
        average_noulno = parseInt(average_noulno * 10000) / 10000;
        */
        scoreBoards.push([
            fc, average_price, average_shortest, average_median, average_longest, average_weight, 
        ])
        
    }) 
    return scoreBoards;
}
exports.getChartData = async (fc) => {
    const db = await this.getSqlite();
    let products = [];
    let query = `SELECT * FROM Products LEFT JOIN Locations on Products.Asin=Locations.Asin WHERE Locations.Fc='${fc}'`;
    const stmt = db.prepare( query );
    for (const element of stmt.iterate()) {
        const {Asin1, ...rest} = element
        products.push(rest)
    }
    let dates = [...new Set(products.map(el => el['Date']))]
    dates.sort((a, b) => {
        const aM = moment(a).toDate().getTime();
        const bM = moment(b).toDate().getTime();
        if(aM > bM) return 1;
        return -1
    })
    dates = dates.filter((el, index) => !!el && index < 5);
    products = products.filter(el => dates.includes(el['Date']));
    
    let prices  =[];
    let shortests = [];
    let longests = [];
    let medians = [];
    let weights = [];
    let noss = [];
    let nofss = [];
    let noulnos = []
    dates.forEach(date => {
        let array = [...products];
        array = array.filter(el => !!el['Price'] && el['Date'] === date);
        let allPrice = array.map(el => el['Price']).reduce((a, b) => a + b, 0);
        prices.push(parseInt(allPrice));
        
        array = [...products]
        array = array.filter(el => !!el['Shortest'] && el['Date'] === date);
        let allShortest = array.map(el => el['Shortest']).reduce((a, b) => a + b, 0);
        shortests.push(parseInt(allShortest));

        array = [...products]
        array = array.filter(el => !!el['Median'] && el['Date'] === date);
        let allMedian = array.map(el => el['Median']).reduce((a, b) => a + b, 0);
        medians.push(parseInt(allMedian));

        array = [...products]
        array = array.filter(el => !!el['Longest'] && el['Date'] === date);
        let allLongest = array.map(el => el['Longest']).reduce((a, b) => a + b, 0);
        longests.push(parseInt(allLongest))

        array = [...products]
        array = array.filter(el => !!el['Weight'] && el['Date'] === date);
        let allWeight = array.map(el => el['Weight']).reduce((a, b) => a + b, 0);
        weights.push(parseInt(allWeight))

    });
    return {
        price: {
            series: [{
                name: 'Price',
                data: prices
            }],
            categories: dates
        },
        shortest: {
            series: [{
                name: 'Shortest',
                data: shortests
            }],
            categories: dates
        },
        median: {
            series: [{
                name: 'Median',
                data: medians
            }],
            categories: dates
        },
        longest: {
            series: [{
                name: 'Longest',
                data: longests
            }],
            categories: dates
        },
        weight: {
            series: [{
                name: 'Weight',
                data: weights
            }],
            categories: dates
        }
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
        
    let array = [..._products];
    array = array.filter(el => !!el['Price'])
    array.sort((a, b) => a['Price'] < b['Price']? 1: -1);
    let HP = array.filter((el, index) => !!el && index < 5).map(el => el['Price']);
    array = array.reverse();
    let LP = array.filter((el, index) => !!el && index < 5).map(el => el['Price']);
    let AP = array.length? array.map(el => el['Price']).reduce((a, b) => a + b, 0) / array.length: 0;
    AP = parseInt(AP * 10000) / 10000;

    array = [..._products];
    array = array.filter(el => !!el['Shortest'])
    array.sort((a, b) => a['Shortest'] < b['Shortest']? 1: -1);
    let LSD = array.filter((el, index) => !!el && index < 5).map(el => el['Shortest']);
    array = array.reverse();
    let SSD = array.filter((el, index) => !!el && index < 5).map(el => el['Shortest']);
    let ASD = array.length? array.map(el => el['Shortest']).reduce((a, b) => a + b, 0) / array.length: 0;
    ASD = parseInt(ASD * 10000) / 10000;
    
    array = [..._products];
    array = array.filter(el => !!el['Median'])
    array.sort((a, b) => a['Median'] < b['Median']? 1: -1);
    let LMD = array.filter((el, index) => !!el && index < 5).map(el => el['Median']);
    array = array.reverse();
    let SMD = array.filter((el, index) => !!el && index < 5).map(el => el['Median']);
    let AMD = array.length? array.map(el => el['Median']).reduce((a, b) => a + b, 0) / array.length: 0;
    AMD = parseInt(AMD * 10000) / 10000;

    array = [..._products];
    array = array.filter(el => !!el['Longest'])
    array.sort((a, b) => a['Longest'] < b['Longest']? 1: -1);
    let LLD = array.filter((el, index) => !!el && index < 5).map(el => el['Longest']);
    array = array.reverse();
    let SLD = array.filter((el, index) => !!el && index < 5).map(el => el['Longest']);
    let ALD = array.length? array.map(el => el['Longest']).reduce((a, b) => a + b, 0) / array.length: 0;
    ALD = parseInt(ALD * 10000) / 10000;

    array = [..._products];
    array = array.filter(el => !!el['Weight'])
    array.sort((a, b) => a['Weight'] < b['Weight']? 1: -1);
    let HW = array.filter((el, index) => !!el && index < 5).map(el => el['Weight']);
    array = array.reverse();
    let LW = array.filter((el, index) => !!el && index < 5).map(el => el['Weight']);
    let AW = array.length? array.map(el => el['Weight']).reduce((a, b) => a + b, 0) / array.length: 0;
    AW = parseInt(AW * 10000) / 10000;
    
    array = [..._products];
    array = array.filter(el => !!el['NumberOfSellers'])
    array.sort((a, b) => a['NumberOfSellers'] < b['NumberOfSellers']? 1: -1);
    let HNOS = array.filter((el, index) => !!el && index < 5).map(el => el['NumberOfSellers']);
    array = array.reverse();
    let LNOS = array.filter((el, index) => !!el && index < 5).map(el => el['NumberOfSellers']);
    let ANOS = array.length? array.map(el => el['NumberOfSellers']).reduce((a, b) => a + b, 0) / array.length: 0;
    ANOS = parseInt(ANOS * 10000) / 10000;

    array = [..._products];
    array = array.filter(el => !!el['NumberOfFbaSellers'])
    array.sort((a, b) => a['NumberOfFbaSellers'] < b['NumberOfFbaSellers']? 1: -1);
    let HNOFS = array.filter((el, index) => !!el && index < 5).map(el => el['NumberOfFbaSellers']);
    array = array.reverse();
    let LNOFS = array.filter((el, index) => !!el && index < 5).map(el => el['NumberOfFbaSellers']);
    let ANOFS = array.length? array.map(el => el['NumberOfFbaSellers']).reduce((a, b) => a + b, 0) / array.length:0;
    ANOFS = parseInt(ANOFS * 10000) / 10000;

    array = [..._products];
    array = array.filter(el => !!el['NumberOfUsedLikeNewOffers'])
    array.sort((a, b) => a['NumberOfUsedLikeNewOffers'] < b['NumberOfUsedLikeNewOffers']? 1: -1);
    let HNOULNO = array.filter((el, index) => !!el && index < 5).map(el => el['NumberOfUsedLikeNewOffers']);
    array = array.reverse();
    let LNOULNO = array.filter((el, index) => !!el && index < 5).map(el => el['NumberOfUsedLikeNewOffers']);
    let ANOULNO = array.length? array.map(el => el['NumberOfUsedLikeNewOffers']).reduce((a, b) => a + b, 0) / array.length: 0;
    ANOULNO = parseInt(ANOULNO * 10000) / 10000;

    array = [..._products];
    array = array.filter(el => !!el['Tier'])
    array.sort((a, b) => a['Tier'] < b['Tier']? 1: -1);
    let HT = array.filter((el, index) => !!el && index < 5).map(el => {
        if(el['Tier'] === 0) return 'STANDARD';
        else if(el['Tier'] === 1) return 'OVERSIZE';
        else if(el['Tier'] === 2) return 'HEAVY';
        else if(el['Tier'] === 3) return 'STANDARD_APPAREL';
        else if(el['Tier'] === 4) return 'OVERSIZE_APPAREL';
        else if(el['Tier'] === 5) return 'STANDARD_SHOES';
        else if(el['Tier'] === 6) return 'OVERSIZE_SHOES';
        return 'STANDARD';
    });
    array = array.reverse();
    let LT = array.filter((el, index) => !!el && index < 5).map(el => {
        if(el['Tier'] === 0) return 'STANDARD';
        else if(el['Tier'] === 1) return 'OVERSIZE';
        else if(el['Tier'] === 2) return 'HEAVY';
        else if(el['Tier'] === 3) return 'STANDARD_APPAREL';
        else if(el['Tier'] === 4) return 'OVERSIZE_APPAREL';
        else if(el['Tier'] === 5) return 'STANDARD_SHOES';
        else if(el['Tier'] === 6) return 'OVERSIZE_SHOES';
        return 'STANDARD';
    });
 //   let AT = array.map(el => el['Tier']).reduce((a, b) => a + b, 0) / array.length;
//    AT = parseInt(AT * 10000) / 10000;

    array = [..._products];
    array = array.filter(el => !!el['ProductGroup'])
    let pgs = [...new Set(array.map(el => el['ProductGroup']))]
    let PRODUCT_GROUP = [];
    pgs.forEach(pg => {
        let arr = array.filter(el => el['ProductGroup'] === pg);
        PRODUCT_GROUP.push({  label: pg, count: arr.length })
    })
    PRODUCT_GROUP.sort((a, b) => a['count'] < b['count']? 1: -1);

    array = [..._products];
    array = array.filter(el => !!el['Binding'])
    let bindings = [...new Set(array.map(el => el['Binding']))]
    let BINDINGS = [];
    bindings.forEach(binding => {
        let arr = array.filter(el => el['Binding'] === binding);
        BINDINGS.push({  label: binding, count: arr.length })
    })
    BINDINGS.sort((a, b) => a['count'] < b['count']? 1: -1);
    
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
    array = array.filter(el => !!el['C3'])
    let c3s = [...new Set(array.map(el => el['C3']))]
    let SUBCATEGORY3 = [];
    c3s.forEach(label => {
        let arr = array.filter(el => el['C3'] === label);
        SUBCATEGORY3.push({  label: label, count: arr.length })
    })
    SUBCATEGORY3.sort((a, b) => a['count'] < b['count']? 1: -1);

    array = [..._products];
    array = array.filter(el => !!el['C4'])
    let c4s = [...new Set(array.map(el => el['C4']))]
    let SUBCATEGORY4 = [];
    c4s.forEach(label => {
        let arr = array.filter(el => el['C4'] === label);
        SUBCATEGORY4.push({  label: label, count: arr.length })
    })
    SUBCATEGORY4.sort((a, b) => a['count'] < b['count']? 1: -1);

    array = [..._products];
    array = array.filter(el => !!el['C5'])
    let c5s = [...new Set(array.map(el => el['C5']))]
    let SUBCATEGORY5 = [];
    c5s.forEach(label => {
        let arr = array.filter(el => el['C5'] === label);
        SUBCATEGORY5.push({  label: label, count: arr.length })
    })
    SUBCATEGORY5.sort((a, b) => a['count'] < b['count']? 1: -1);

    array = [..._products];
    array = array.filter(el => !!el['C6'])
    let c6s = [...new Set(array.map(el => el['C6']))]
    let SUBCATEGORY6 = [];
    c6s.forEach(label => {
        let arr = array.filter(el => el['C6'] === label);
        SUBCATEGORY6.push({  label: label, count: arr.length })
    })
    SUBCATEGORY6.sort((a, b) => a['count'] < b['count']? 1: -1);

    array = [..._products];
    array = array.filter(el => !!el['C7'])
    let c7s = [...new Set(array.map(el => el['C7']))]
    let SUBCATEGORY7 = [];
    c7s.forEach(label => {
        let arr = array.filter(el => el['C7'] === label);
        SUBCATEGORY7.push({  label: label, count: arr.length })
    })
    SUBCATEGORY7.sort((a, b) => a['count'] < b['count']? 1: -1);

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
        { label: 'Average Price', array: [AP] },
        { label: 'Largest Shortest Dimensions', array: LSD },
        { label: 'Smallest Shortest Dimensions', array: SSD },
        { label: 'Average Shortest Dimension', array: [ASD] },
        { label: 'Largest Median Dimensions', array: LMD },
        { label: 'Smallest Median Dimensions', array: SMD },
        { label: 'Average Median Dimension', array: [AMD] },
        { label: 'Largest Longest Dimensions', array: LLD },
        { label: 'Smallest Longest Dimensions', array: SLD },
        { label: 'Average Longest Dimension', array: [ALD] },
        { label: 'Highest Weights', array: HW },
        { label: 'Lowest Weights', array: LW },
        { label: 'Average Weight', array: [AW] },
        { label: 'Highest NumberOfSellers', array: HNOS },
        { label: 'Lowest NumberOfSellers', array: LNOS },
        { label: 'Average NumberOfSeller', array: [ANOS] },
        { label: 'Highest NumberOfFbaSellers', array: HNOFS },
        { label: 'Lowest NumberOfFbaSellers', array: LNOFS },
        { label: 'Average NumberOfFbaSeller', array: [ANOFS] },
        { label: 'Highest NumberOfUsedLikeNewOffers', array: HNOULNO },
        { label: 'Lowest NumberOfUsedLikeNewOffers', array: LNOULNO },
        { label: 'Average NumberOfUsedLikeNewOffer', array: [ANOULNO] },
        { label: 'Highest Tiers', array: HT },
        { label: 'Lowest Tiers', array: LT },
//        { label: 'Average Tier', array: [AT] },
        { label: 'Product Group', array: PRODUCT_GROUP.map(el => el['label']) },
        { label: 'Product Group Count', array: PRODUCT_GROUP.map(el => el['count']) },
        { label: 'Binding', array: BINDINGS.map(el => el['label']) },
        { label: 'Binding Count', array: BINDINGS.map(el => el['count']) },
        { label: 'Category', array: CATEGORY.map(el => el['label']) },
        { label: 'Category Count', array: CATEGORY.map(el => el['count']) },
        { label: 'Subcategory 1', array: SUBCATEGORY.map(el => el['label']) },
        { label: 'Subcategory 1 Count', array: SUBCATEGORY.map(el => el['count']) },
        { label: 'Subcategory 2', array: SUBCATEGORY3.map(el => el['label']) },
        { label: 'Subcategory 2 Count', array: SUBCATEGORY3.map(el => el['count']) },
        { label: 'Subcategory 3', array: SUBCATEGORY4.map(el => el['label']) },
        { label: 'Subcategory 3 Count', array: SUBCATEGORY4.map(el => el['count']) },
        { label: 'Subcategory 4', array: SUBCATEGORY5.map(el => el['label']) },
        { label: 'Subcategory 4 Count', array: SUBCATEGORY5.map(el => el['count']) },
        { label: 'Subcategory 5', array: SUBCATEGORY6.map(el => el['label']) },
        { label: 'Subcategory 5 Count', array: SUBCATEGORY6.map(el => el['count']) },
        { label: 'Subcategory 6', array: SUBCATEGORY7.map(el => el['label']) },
        { label: 'Subcategory 6 Count', array: SUBCATEGORY7.map(el => el['count']) },
        { label: 'Brand', array: BRAND.map(el => el['label']) },
        { label: 'Brand Count', array: BRAND.map(el => el['count']) },
    ]
    }else {
        return []
    }
}