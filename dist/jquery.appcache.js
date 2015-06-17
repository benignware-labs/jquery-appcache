(function($) {
  
  var instance = null;
  
  var defaults = {
    url: ($('base').attr('href') || ".") + '/appcache.html',
    cookie: 'appcache'
  };
  
  function AppCache() {
    
    if (instance) {
      return instance;
    }
    
    instance = this;
    
    var settings = $.extend({}, defaults);
    
    this.setup = function(options) {
      settings = $.extend({}, defaults, options);
    };
    
    this.load = function(url, options) {
      
      options = typeof url === 'object' ?  url : options;
      options = $.extend({}, settings, options);
      url = options && options.url || url;
      
      var deferred = $.Deferred();

      // Up cookie
      var cookie = options.cookie;
      var cookieExpires = new Date(new Date().getTime() + 60 * 5 * 1000);
      document.cookie = options.cookie + "=1;path=/;expires=" + cookieExpires.toGMTString();
      
      // Load iframe
      var iframe = document.createElement('iframe');
      iframe.setAttribute('id', 'appcacheloader');
      document.body.appendChild(iframe); 
      iframe.setAttribute('style', 'width:0px; height:0px; visibility:hidden; position:absolute; border:none');
      var html = '<!DOCTYPE html><html manifest="?appcache"><head><script src=\"<?= magnet_base_url(); ?>/assets/javascripts/appcache.js\"><\/script></head><body>Foo</body></html>';
      //iframe.src = 'data:text/html;charset=utf-8,' + encodeURI(html);
      iframe.src = url;
      iframe.onload = function() {
        console.info("Appcache-loader");
      };
      
      var isReady = false;
      $(window).on('message', function(event) {
        
        event = event.originalEvent;
        if (event.data && event.data.type && event.data.type === 'appcache:event') {
          var status = event.data.status;
          console.info("Appcache-loader response", status );
          if (status === 'cached' || status === 'uncached' || status === 'idle' || status === 'obsolete' || status === 'timeout' || status === 'updateready' || status === 'noupdate' || status === 'error') {
            
            isReady = true;
            
            // Remove iframe
            var loaderEl = document.getElementById('appcacheloader');
            loaderEl.parentNode.removeChild(loaderEl);
      
            // Remove cookie
            var cookie = 'up';
            cookieExpires = new Date(new Date().getTime() - 60 * 5 * 1000); 
            document.cookie = options.cookie + "=;path=/;expires=" + cookieExpires.toGMTString();
      
            // Remove message listener
            $(window).off('message', arguments.callee);
            deferred.resolve(status);
          } else {
            deferred.notify(status);
          }
        }
      });
      
      return deferred.promise();
    };
    
  }
  
  $.extend({
    appcache: new AppCache()
  });
  
})(jQuery);