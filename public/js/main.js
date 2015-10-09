(function($) {

  var viewport = $('#viewport');

  // Disable zooming on iPad
  if (Modernizr.mq('(max-width: 1024px) and (min-width: 768px)')) {
    viewport.attr('content',
      'width=device-width, user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1');
  }

}(jQuery));
