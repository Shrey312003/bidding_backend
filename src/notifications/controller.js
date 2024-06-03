const pool = require('../../database');
const queries = require('./queries');

const getNotif = (req,res) =>{
    const user_id = req.user.id;

    pool.query(
        queries.getNotif,[user_id],(err,result)=>{
            if(err){
                return res.status(404).send(err);
            }
            res.status(200).send(result.rows);
        }
    )
}

const markRead = (req,res) =>{  
    const user_id = req.user.id;

    pool.query(
        queries.markRead,[true, user_id],(err,result)=>{
            if(err){
                return res.status(400).send(err);
            }
            res.status(200).send("Marked");
        }
    )
}

module.exports = {
    getNotif,
    markRead
}