var
  io = require('socket.io').listen(3333),
  sys = require('sys'),
  exec = require('child_process').exec;

function puts(error, stdout, stderr) { sys.puts(stdout) }

io.sockets.on('connection', function (socket) {

  socket.emit('livePreview', {});

  socket.on('clone', function(data){
    console.log(data);
    exec("git clone "+data.repoAddr+" sessions/"+data.sessionId, puts);
  });

});
