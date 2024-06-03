const pool = require('../../database');
const queries = require('./queries');

const getItems = (req, res) => {
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    pool.query(queries.getItems, [limit, offset], (err, result) => {
        if (err) {
            throw err;
        }
        console.log(result.rows);
        res.status(200).json(result.rows);
    });
};


const getUniqueItems = (req,res) =>{
    const id = parseInt(req.params.id);
    console.log(id);

    pool.query(
        queries.getUniqueItems,[id],(err,result) =>{
            if(err){
                return res.status(404).send(err);
            }
            console.log(result.rows);
            res.status(200).json(result.rows);
        }
    )

}

const uploadItem = (req,res) =>{
    const {name, description, starting_price, image_url, end_time} = req.body;
    const user_id = req.user.id;

    console.log(user_id);

    pool.query(
        queries.addItem,[name,description,starting_price,image_url,end_time,user_id],(err,result) =>{
            if(err){
                return res.status(400).send("Item not added");
            } 
            res.status(201).send("Item added");
        }
    )

}

const updateItem = (req,res) =>{
    const {name,description,starting_price,image_url,end_time} = req.body;
    const user_id = req.user.id;
    const id = parseInt(req.params.id);

    const user_type = req.user.role

    console.log(name,description,starting_price,image_url,end_time,id);


    pool.query(
        queries.getUniqueItems,[id],(err,result) => {
            if(err){
                return res.status(404).send(err);
            };

            if(result.rows[0].user_id != user_id && user_type != 'admin'){
                return res.status(401).send("Unothorized access");
            }

            else{
                pool.query(
                    queries.updateItem,[name,description,starting_price,image_url,end_time,id],(err,result) =>{
                        if(err){
                            return res.status(400).send("Item not updated");
                        } 
                        res.status(201).send("Item updated");
                    }
                )
            }
        }
    )
}

const userItems = (req,res) =>{
    const user_id = req.user.id;
    // console.log(user_id);
    pool.query(
        queries.getUserItems,[user_id],(err,result) =>{
            if(err){
                return res.status(404).send("Not deleted");
            }
            console.log(result.rows);
            res.status(202).send(result.rows);
        }
    )
}

const deleteItem = (req,res) =>{
    const user_id = req.user.id;
    const role = req.user.role;
    const id = parseInt(req.params.id);

    console.log(id);

    pool.query(
        queries.getUniqueItems,[id],(err,result) =>{
            if(err){
                return res.status(402).send("NOT found");
            }

            if(result.rows[0].user_id != user_id && role!='admin'){
                return res.status(401).send("unauthorized access");
            }

            pool.query(
                queries.deleteItem,[id],(err,result) =>{
                    if(err){
                        return res.status(404).send("Not deleted");
                    }

                    res.status(200).send("deleted");
                }
            )
        }
    )
}

const getBids = (req,res) =>{
    const id = parseInt(req.params.itemId);
    console.log(id);

    pool.query(
        queries.getBids,[id],(err,result) =>{
            if(err){
                return res.status(404).send(err);
            }
            res.status(200).send(result.rows);
        }
    )
}

const makeBid = (req,res) =>{
    const {bid_amount} = req.body;
    const id = parseInt(req.params.itemId);
    const user_id = req.user.id;

    // console.log(bid_amount);

    pool.query(
        queries.makeBid,[id,user_id,bid_amount],(err,result)=>{
            if(err){
                return res.status(400).send(err);
            }

            pool.query(
                queries.updateCurrent_price,[bid_amount,id],(err,result)=>{
                    if(err){
                        return res.status(404).send(err);
                    }
                    
                    res.status(202).send("Bid created");
                }
            )
            
        }
    )
}

// const check = (req,res) =>{
//     console.log(req.user.id);
//     res.send("hello");
// }

module.exports = {
    getItems,
    getUniqueItems,
    uploadItem,
    updateItem,
    userItems,
    deleteItem,
    getBids,
    makeBid
    // check
}
