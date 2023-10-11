// // SERVER SIDE CODE
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const {generateMessage} = require('./utils/messages')
const {calTotalIFFScore} = require('./utils/utility')
const {
    addUser,
    getUsersInRoom
} = require('./utils/users')




const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve your static files
app.use(express.static('public'));

// Serve socket.io.js from the server (adjust the path as needed)
app.get('/socket.io/socket.io.js', (req, res) => {
    res.sendFile(__dirname + '/node_modules/socket.io-client/dist/socket.io.js');
});


//Port configuration
const port = process.env.PORT || 3000


app.get("/", (req, res)=>{
    res.send("index")
})

server.listen(port, () => {
    console.log('Server is running on port 3000');
});



const allUserDataList = [];
io.on("connection", (socket)=>{

    //Receiving the username and room name of join page from client
    socket.on('join', ({username, room}, callback) => {

        const {error, user} = addUser({id:socket.id, username, room})
        //user = {id, username, room}
        console.log("user", user);

        if(error){
            return callback(error);
        }

        //socket.join onl be used at server side
        socket.join(user.room)


        // Server will send welcome message to new user
        // socket.emit("message", generateMessage("System", "Welcome!"));
        // socket.broadcast.to(user.room).emit("message", generateMessage("System",`${user.username} has joined the ${room} room.`));
        io.to(user.room).emit('joinData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        // callback(); //Indicating no issue while adding a new user

        // Listening the IFF_Score value from the joined user
        socket.on('iff_scr',({ticket, iffscore}, callback) => {
            const ticketUpperCase = ticket.toUpperCase();
            const allUserData = {};
            allUserData['id'] = user.id;
            allUserData['uname'] = user.username;
            allUserData['room'] = user.room;
            allUserData['ticket'] = ticketUpperCase;
            allUserData['iffscr'] = Number(iffscore);
            allUserDataList.push(allUserData)
            console.log('allUserDataList', allUserDataList);
            totalIFF = calTotalIFFScore(allUserDataList, user.room, ticketUpperCase)
            console.log(totalIFF);
            io.to(user.room).emit('roomData', {
                // room: user.room,
                // users: getUsersInRoom(user.room),
                ticket: ticketUpperCase,
                score: totalIFF
            })
        });


        callback(); //Indicating no issue while adding a new user

    });


})
