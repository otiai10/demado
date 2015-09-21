(function() {
  chrome.runtime.sendMessage({
    path: "/registry:get"
  }, function(coords) {
    if (!coords) return; // abort
    var body = document.getElementsByTagName("body")[0];
    body.style.position = "fixed";
    body.style.left = coords.left+"px";
    body.style.top = coords.top+"px";
    window.onbeforeunload = function() {
      return "[dmdからのかくにん]\nこのページから離れていいですか？";
    };
  });
})();
