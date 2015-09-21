angular.module("dmd", []).filter("parseURL", function() {
  return function(input) {
    var m = input.match(/(https?:\/\/)([^?#]+)/);
    if (!m || m.length < 3) return input;
    return m[2];
  };
}).controller("PopupController", function($scope) {
  chrome.runtime.sendMessage(null, {
    path: "/registry:list"
  }, function(res) {
    console.log(res);
  });
  // {{{ fixture
  $scope.registries = {
    "http://ponpon-pa.in/": {
      name: "ぽんぺ",
      url: "http://ponpon-pa.in/",
      left: 0,
      top:  0,
      width: 460,
      height: 297
    },
    "http://google.com": { // IDはquery無視したやつ
      name: "おっぱい",
      url: "http://google.com",
      left: 40,
      top:  20,
      width: 200,
      height: 200
    },
    "http://www.dmm.com/netgame/social/-/gadgets/=/app_id=854854/": {
      name: "艦これ",
      url: "http://www.dmm.com/netgame/social/-/gadgets/=/app_id=854854/",
      left: 40,
      top: 20,
      width: 800,
      height: 480,
    }
  };
  // }}}
  $scope.open = function(reg) {
    chrome.runtime.sendMessage({
      path: "/registry:open",
      params: reg
    });
  };
});
