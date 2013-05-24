window.onload = function() {
  var messages = [];
  var socket = io.connect('http://localhost:8081');
  var field = document.getElementById("msg");
  var sendButton = document.getElementById("send");
  var content = document.getElementById("message_list");

  socket.on('msg', function (data) {
    if(data.msg) {
      messages.push(data.msg);
      var html = '';
      for(var i=0; i<messages.length; i++) {
        html += messages[i] + '<br />';
      }
      content.innerHTML = html;
    } else {
      console.log("There is a problem:", data);
    }
  });

  sendButton.onclick = function() {
    var text = field.value;
    socket.emit('send', { message: text });
  };

}