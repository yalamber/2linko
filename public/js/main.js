$(window).load(function() {
  var socket_server_address = $(window.location).attr('href');
  var socket = io.connect(socket_server_address);
  var msg_list = $("#message_list");
  var msg_container = $("#message_container");
  socket.on('msg', function (data) {
    if(data.msg) {
      var html;
      var hue = 'rgba(' + (Math.floor((256-199)*Math.random()) + 200) + ',' + (Math.floor((256-199)*Math.random()) + 200) + ',' + (Math.floor((256-199)*Math.random()) + 200) + ',.8)';
      html = '<li style="background:'+hue+'">'+ data.msg + '</li>';
      msg_list.append(html);
      msg_container.scrollTop(msg_container.height());
    } else {
      console.log("There is a problem:", data);
    }
  });
  $("#msg").keyup(function (e) {
    setTimeout(function(){
      socket.emit('typing', {type: "typing..."});
    }, 5);
    if (e.keyCode == 13) {
      socket.emit('send', { msg: $("#msg").val() });
      $('#msg').val('');
    }
  });
});