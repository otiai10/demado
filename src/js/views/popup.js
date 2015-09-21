angular.module("dmd", []).controller("PopupController", function($scope) {
  chrome.runtime.sendMessage(null, {
    path: "/registry:list"
  }, function(res) {
    console.log(res);
  });
  // {{{ fixture
  $scope.registries = {
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
