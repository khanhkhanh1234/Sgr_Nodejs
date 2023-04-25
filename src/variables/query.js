const excuteQuery  = ({ db, query, params }) => {
    return new Promise((resolve, reject) => {  
        db.query(query, params, (error, results, fields) => {
            if (error) {
                reject(error);
            }
            resolve(results);
        })
    })
};
const getOne = async ({ db, query, params }) => {
    const results = await excuteQuery({ db, query, params });
    if(results.length > 0) 
    {
        return results[0];
    }
    else {
        return null;
    }
};
const getMany = async ({ db, query, params }) => {
    const results = await excuteQuery({ db, query, params });
    if(results.length > 0) 
    {
        return results;
    }
    else {
        return null;
    }
}
const create = async ({ db, query, params }) => {
    const results = await excuteQuery({ db, query, params });
    if(results.affectedRows > 0) 
    {
        return true;
    }
    else {  
        return false;
    }
}
 module.exports = {
    getOne,
    getMany,
    create
 }
    