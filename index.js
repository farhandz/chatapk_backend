const express = require('express')
const app = express()
const db = require('./connection/db')
const http = require('http')
const soketio = require('socket.io')
const server = http.createServer(app)
const io  = soketio(server)
const path = require('path')
const userRouter = require ('./routes/user')
const cors = require('cors')
const dataresult = []

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public/images")));
app.use('/user', userRouter)

io.on('connection', (socket) => {
  socket.on('send-data', msg => {
    db.query(`SELECT * FROM user`, (err, resul) => {
      io.emit('ganteng', resul)
    })
  })
  socket.on('send-id', id => {
    db.query(
      `SELECT friends.id, u.id AS id_user,u1.image AS image, u1.id AS id_friend, u.username AS user, u1.username AS friend FROM friends INNER JOIN user u ON u.id = friends.user_id INNER JOIN user u1 ON u1.id = friends.friend_id WHERE (friends.user_id = ${id} OR friends.friend_id = ${id} )`,
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
           const daya = result.filter(item => item.id_user == id)
          if (daya) {
            io.emit("send-search-result", result); 
          } else {
            console.log('asu')
          }
          // db.query(
          //  `SELECT COUNT(friends.id) AS data, u.id AS id_user,u1.image AS image, u1.id AS id_friend, u.username AS user, u1.username AS friend FROM friends  INNER JOIN user u ON u.id = friends.user_id INNER JOIN user u1 ON u1.id = friends.friend_id WHERE (friends.user_id = 17 OR friends.friend_id = ${id})`, (err, result2) => {
          //   const asu = result2[0].data
          //   console.log(asu == asu)
          //  });
          // console.log(res.length, res2.length)
          // if(result.length !== result.length ) {
          //   console.log('dasa')
          // } else {
          //   console.log('asu')
          // }
          // console.log(result)
          // const data = result.filter((item) => item.user !== item.friend);
          // console.log(result);
        }
      }
    );
  })
     socket.on("disconnect", () => {
       console.log("user disconect");
     });
     socket.on('regis', (msg) => {
       io.emit('send-regis', 'ini kembalian dari backend')
     })

     socket.on('send-message', (payload) => {
      db.query(
        `INSERT INTO messsage (sender, receiver, message) VALUES ('${payload.sender}',  '${payload.receiver}', '${payload.message}')`,
        (err, result) => {
          if (err) {
            console.log(err)
          } else {
             io.to(payload.receiver).emit("asu", payload);
          }
        }
      );
     })
     
     socket.on("get-hisyory-message", payload => {
       db.query(
         `SELECT * FROM messsage WHERE (sender='${payload.sender}' AND receiver='${payload.receiver}') OR (sender='${payload.receiver}' AND receiver='${payload.sender}') `, (err,result) => {
           if(err) {
             console.log(err)
           } else {
            io.to(payload.sender).emit('send-history-message', result)
           }
         });
     });
     socket.on('join-room', (payload) => {
        // console.log( payload)
        socket.join(payload.user)
     })
})

server.listen(3000, () => console.log("erver listen on port 3000"));