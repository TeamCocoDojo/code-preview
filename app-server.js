var
  express = require('express'),
  app = express(),
  http = require('http'),
  server = http.createServer(app)
  io = require('socket.io').listen(server),
  fs = require('fs'),
  sys = require('sys'),
  exec = require('child_process').exec;

// Some Configurations...
server.listen(3333);
app.configure(function(){
  app.use(express.static(__dirname + '/sessions'));
});

// Function for outputs
function puts(error, stdout, stderr) { sys.puts(stdout) }

// client table
var clientTable = {};

io.sockets.on('connection', function (socket) {

  //console.log(socket.id);
  //clientTable[socket.id] = socket;

  socket.emit('livePreview', {});

  // Clone the repository to the session directory
  socket.on('clone', function(data){
    console.log(data);
    exec("git clone "+data.repoAddr+" -b "+data.repoBranch+" sessions/"+data.sessionId, function(){
      socket.emit('serverDirectoryReady', {});
    });
  });

  // Make the session directory
  socket.on('makedir', function(data){
    exec("mkdir sessions/"+data.sessionId, function(){
      socket.emit('serverDirectoryReady', {});
    });
  });

  // Replace repository files with the modified ones
  socket.on('replaceFile', function(data){
    console.log('replaceFile');
    var filePath = "sessions/"+data.sessionId+"/"+data.path;
    fs.writeFile(filePath, data.fileString, function(err) {
      if(err) { console.log(err); }
      else {
        console.log("The file is saved!");
        socket.emit('fileSaved', {});
      }
    });
  });

  // Compile and run C/C++ code using g++
  socket.on('compileAndRun', function(data){
    console.log('compileAndRun');
    var
      fileDir = "sessions/"+data.sessionId,
      files = data.files.join(" ");
    exec(fileDir+"/g++ "+files, function(){
      // run the executable file
    });
  });

});
