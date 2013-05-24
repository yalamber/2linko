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
      setTimeout(function() {
        msg_container.scrollTop(msg_container.height());
      }, 1);
    } else {
      console.log("There is a problem:", data);
    }
  });
  $("#send").click(function() {
    socket.emit('send', { msg: $("#msg").val() });
  });
});