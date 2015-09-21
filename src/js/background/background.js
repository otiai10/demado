(function() {
  chrome.runtime.onMessage.addListener(function(message, sender, respond) {
    dmd.routes(message.path || "/")(message, sender, respond);
  });
})();
