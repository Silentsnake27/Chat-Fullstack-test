const Chat = require('./models/Chat');

module.exports = function (io) {
  let users = {};

  function updateNicknames() {
    io.sockets.emit('usernames', Object.keys(users));
  }

  io.on('connection', async (socket) => {
    console.log('new user connected');

    let messages = await Chat.find().sort({$natural:1});
    socket.emit('load old msgs', messages);

    socket.on('new user', (data, cb) => {
      if (data in users) {
        cb(false);
      } else {
        cb(true);
        socket.nickname = data;
        users[socket.nickname] = socket;
        updateNicknames();
      }
    });

    socket.on('send message', async (data, cb) => {
      // '/p joe asdasdads';
      var msg = data.trim();

      if (msg.substr(0, 3) === '/p ') {
        msg = msg.substr(3);
        var index = msg.indexOf(' ');
        if (index !== -1) {
          var name = msg.substring(0, index);
          var msg = msg.substring(index + 1);
          if (name in users) {
            users[name].emit('private', {
              msg,
              user: socket.nickname,
            });
          } else {
            cb('Error! Please enter a Valid User');
          }
        } else {
          cb('Error! Please enter your message');
        }
      } else {
        let newMsg = new Chat({
          msg,
          user: socket.nickname,
        });
        await newMsg.save();
        io.sockets.emit('new message', {
          msg: data,
          user: socket.nickname,
        });
      }
    });

    //Disconnect users
    socket.on('disconnect', (data) => {
      if (!socket.nickname) return;
      delete users[socket.nickname];
      updateNicknames();
    });
  });
};
