 var socket = io();

    socket.on('output', function(data){
      if(data.length) {
        for(var x=0; x < data.length; x++){
          $('#opinion').append($('<p id="saying">').text(data[x].username + ": " + data[x].message));
		  $('#opinion').append($('<br>'));
        }
      }
    });



    $('form').submit(function(){
      if($('#mess').val().length > 0 || $('#name').val().length > 0) {
        socket.emit('message', {
          message: $('#mess').val(),
          username: $('#name').val()
        });
        $('#mess').val('');
		$('#name').val('');

    }
    return false;
    });

    socket.on('message', function(mess){
     $('#opinion').append($('<p id="saying">').text(mess.username + ": " + mess.message));
	 $('#opinion').append($('<br>'));
     $("html, body").scrollTop($('section id="contact"').height());
    });
 

  socket.on('er', function(er){
    alert(er);
  });
