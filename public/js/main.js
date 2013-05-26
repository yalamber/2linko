$(window).load(function() {
  var socket_server_address = $(window.location).attr('href');
  var socket = io.connect(socket_server_address);
  var msg_list = $("#message_list");
  var msg_container = $("#message_container");
  //ask nickname
  $('#ask_nickname').modal({show:true, backdrop:"static", keyboard: false });
  $('#ask_nickname').on('shown', function () {
    $('#nickname').focus();
  })
  //save nickname
  $('#save_nickname').click(function(){
    socket.emit('set nickname', {nickname: $('#nickname').val()});
    socket.on('nickname set', function(data){
      if(data.status == 'success'){
        $('#control_name').text(data.nickname);
        $('#ask_nickname').modal('hide');
      }
      else{
        $('#set_name_status').fadeIn().html('Nickname is not available!');
      }
    });
  });
  socket.on('msg', function (data) {
    if(data.msg) {
      var html;
      var hue = 'rgba(' + (Math.floor((256-199)*Math.random()) + 200) + ',' + (Math.floor((256-199)*Math.random()) + 200) + ',' + (Math.floor((256-199)*Math.random()) + 200) + ',.8)';
      var nickname = data.nickname || '';
      html = '<li style="background:'+hue+'"><strong>'+ nickname +'</strong> : '+ data.msg + '</li>';
      msg_list.append(html);
      msg_container.scrollTop(msg_container.height());
    } else {
      console.log("There is a problem:", data);
    }
  });

  $("#msg").keyup(function (e) {
    if (e.keyCode == 13) {
      if($('#nickname').val()!=''){
        socket.emit('send', {nickname: $('#nickname').val(), msg: $("#msg").val()});
        $('#msg').val('');
      }
      else{
        alert('Please provide your name!');
      }
    }
  });

  $("#nickname").keyup(function (e) {
    if (e.keyCode == 13) {
      if($('#nickname').val()!=''){
        $('#save_nickname').trigger("click");
      }
      else{
        alert('Please provide your name!');
      }
    }
  });

});
$(window).bind('beforeunload', function(){
  return 'All messages will be lost, Are you sure you want to leave?';
});