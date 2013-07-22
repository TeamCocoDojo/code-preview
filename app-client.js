var liveSocket = io.connect("http://ec2-54-245-222-60.us-west-2.compute.amazonaws.com", {port: 3333} );
liveSocket.on('livePreview', function(data){
  console.log(data);
  // example one...
  //liveSocket.emit("clone", {sessionId: "testid", repoAddr: "git@github.com:davliu/sticky.git"} );
  // example two...
  liveSocket.emit("replaceFile", {sessionId: "testid2", fileString: "teststring", path: 'index.html'} );
});