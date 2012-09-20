jQuery(function($) {
  var storage = window.localStorage;
  var socket = io.connect('http://localhost');

  var $jade = $('#jade');
  $jade.val(storage.jadeText || '!!!\nhtml');
  socket.on('preview', function (result) {
    $('#markup').text(result.markup);
    prettyPrint();
  });

  $jade.tabby({tabString: '  '});

  // Event
  setInterval(function() {
    var jadeText = $jade.val();
    socket.emit('changeHtml', jadeText);
    storage.jadeText = jadeText;
  }, 500);

  $('#sample').on('click', function($event) {
    console.log($('#sample-code').text());
    $jade.val($('#sample-code').text());
    return false;
  });
})(jQuery);
