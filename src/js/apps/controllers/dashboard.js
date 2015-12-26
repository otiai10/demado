"use strict";

angular.module("demado", []).controller("DashboardController", ($scope) => {

  MadoStore.local().all().then((list) => {
    return Promise.resolve(list);
  }).then((list) => {
    var tasks = [];
    for (var key in list) {
      tasks.push(new Promise((resolve) => {
        Launcher.find({url:list[key].url + "*"}).then((tab) => {
          list[key].launched = true;
          list[key].tabID = tab.id;
          list[key].winID = tab.windowId;
          list[key].muted = tab.mutedInfo.muted;
          resolve(tab);
        }).catch(() => { resolve(); });
      }));
    }
    return Promise.all(tasks).then(() => {
      return Promise.resolve(list);
    });
  }).then((list) => {
    $scope.$apply(() => { $scope.mados = list; });
  });

  $scope.launch = (mado) => {
    Message.me().send("/mado/launch", {mado:mado}).then((res) => {
      $scope.$apply(() => {
        $scope.mados[mado.url].launched = true;
        $scope.mados[mado.url].winID = res.win.id;
        $scope.mados[mado.url].tabID = res.win.tabs[0].id;
        $scope.mados[mado.url].muted = res.win.tabs[0].mutedInfo.muted;
      });
    });
  };

  $scope.focus = (mado) => {
    Launcher.chrome(mado.winID).focus();
  };

  $scope.openPanelDashboard = () => {
    Launcher.blank().open({
      url: "/src/html/dashboard.html",
      width: 400,
      height: 280,
      type: "panel"
      // type: "popup"
    }).then((win) => { window.close(); });
  };

  $scope.toggleMute = (mado) => {
    Launcher.find({url:mado.url+"*"}).then((tab) => {
      return Launcher.toggleMute(tab.id);
    }).then((tab) => {
      $scope.$apply(() => {
        $scope.mados[tab.url].muted = tab.mutedInfo.muted;
      });
    });
  };

  $scope.capture = (mado) => {
    Message.me().send("/mado/capture", {tab: mado.tabID, win: mado.winID});
  };

  // TODO: infrastructure
  chrome.tabs.onRemoved.addListener((tabID) => {
    for (var key in $scope.mados) {
      if ($scope.mados[key].tabID != tabID) continue;
      $scope.$apply(() => {
        delete $scope.mados[key].winID;
        delete $scope.mados[key].tabID;
        delete $scope.mados[key].launched;
        delete $scope.mados[key].muted;
      });
    }
  });
});
