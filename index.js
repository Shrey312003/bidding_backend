const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./src/users/routes');
const authenticateToken = require('./middleware/authenticationToken');
const itemROutes = require('./src/items/routes');
const notificationRoutes = require('./src/notifications/routes');
const path = require('path');
const http = require('http');
const socketIo = require("socket.io");
const cors = require('cors');
const jwt = require('jsonwebtoken');
const pool = require('./database');

require('dotenv').config();

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
      origin: "*", 
      methods: ["GET", "POST"]
  }
});

io.on('connection',(socket)=>{
  console.log('New client connected');

  socket.on('disconnect', () => {
      console.log('Client disconnected');
  });

  socket.on('bid',({token,bid_amount}) =>{  
    let user_id = null;

    // console.log(token,bid_amount);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {

      if (err){
        console.log(err);
        return;
      }
      
      user_id = user.id
    });

    if(user_id != null){
      const message = {user_id,bid_amount};

      io.emit('update',message);
    }

  });

  socket.on('bid2',({token,bid_amount,item_id}) =>{
    let bid_maker_id;

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) console.log(err);
      
      // console.log(user);
      bid_maker_id = user.id
    });
    
    const item_query = "SELECT * FROM public.items WHERE id =$1 ";

    pool.query(
      item_query,[item_id],(err,result)=>{

        if(err){
          console.log(err);
          return;
        }

        const item_name = result.rows[0].name;
        const owner_id = result.rows[0].user_id;

        const owner_msg = `Your item with name = ${item_name} has a bid of ${bid_amount}`;
        const bidder_msg = `You are outbid`;

        const notify_query = "INSERT INTO public.notifications (user_id,message) VALUES ($1,$2)";

        pool.query(
          notify_query,[owner_id,owner_msg],(err,result) =>{
            if(err){
              console.log(err);
              return;
            }

            console.log("Notification sent");
          }
        );

        const outbid_query = "SELECT * FROM public.bids ORDER BY created_at DESC LIMIT 1;"

        pool.query(
          outbid_query,(err,result)=>{
            if(err){
              console.log(err);
              return;
            }

            const outbid_user_id = result.rows[0].user_id;

            pool.query(
              notify_query,[outbid_user_id,bidder_msg],(err,result) =>{
                if(err){
                  console.log(err);
                  return;
                }

                console.log("Outbid notified");
              }
            )
          }
        )

        const bid_maker_msg = `You have made a bid on item = ${item_name} of ${bid_amount}`;

        pool.query(
          notify_query,[bid_maker_id,bid_maker_msg],(err,result)=>{
            if(err){
              console.log(err);
              return;
            }
            console.log("Bid notification sent");
          }
        )
        // io.emit('notify',owner_msg);
      }
    );
  })
});


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin','*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

server.listen(8000,()=>{
    console.log("server connected on port 8000");
});

app.use(bodyParser.json())

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (req,res) => {
    res.json({hello: "Hello World"});
})

app.use('/users',userRoutes);
app.use('/items',itemROutes);
app.use('/notifications',notificationRoutes);
