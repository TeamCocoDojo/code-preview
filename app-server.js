var
  express = require('express'),
  app = express(),
  http = require('http'),
  server = http.createServer(app)
  io = require('socket.io').listen(server),
  fs = require('fs'),
  sys = require('sys'),
  exec = require('child_process').exec;

server.listen(3333);

app.configure(function(){
  app.use(express.static(__dirname + '/sessions'));
});

function puts(error, stdout, stderr) { sys.puts(stdout) }

io.sockets.on('connection', function (socket) {

  socket.emit('livePreview', {});

  // Clone the repository to the session directory
  socket.on('clone', function(data){
    console.log(data);
    exec("git clone "+data.repoAddr+" sessions/"+data.sessionId, puts);
  });

  // Make the session directory
  socket.on('makedir', function(data){
    exec("mkdir sessions/"+data.sessionId, puts);
  });

  // Replace repository files with the modified ones
  socket.on('replaceFile', function(data){
    console.log(data);
    var filePath = "sessions/"+data.sessionId+"/"+data.path;
    fs.writeFile(filePath, data.fileString, function(err) {
      if(err) { console.log(err); }
      else {
        console.log("The file was saved!");
        socket.emit('fileSaved', {});
      }
    });
  });

  // Compile and run C/C++ code using g++
  socket.on('compileAndRun', function(data){
    console.log(data);
    var
      fileDir = "sessions/"+data.sessionId,
      files = data.files.join(" ");
    exec(fileDir+"/g++ "+files, function(){
      // run the executable file
    });
  });

});

