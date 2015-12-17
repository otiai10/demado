"use strict";

angular.module("demado", []).controller("ConfigsController", ($scope) => {
  $scope.newmado = new Mado(null, null);
  MadoStore.local().all().then((list) => {
    $scope.$apply(() => { $scope.list = list });
  });

  $scope.visibleTab = null;
  $scope.visibleWin = null;

  $scope.cancel = () => {
    $scope.newmado = new Mado(null, null);
  };

  $scope.commit = (mado) => {
    MadoStore.local().set(mado).then((set) => {
      location.reload(); // FIXME
    });
  };

  $scope.visible = (mado) => {
    MadoStore.local().set(mado).then((set) => {
      return Launcher.blank().launch(mado);
    }).then((win) => {
      if (!win.tabs || win.tabs.length == 0) return;
      $scope.visibleTab = win.tabs[0];
      $scope.visibleWin = win.id;
      setInterval(() => {
        Message.me().send("/page/onresize/draw", {tabID: $scope.visibleTab.id})
        .then((res) => {
          $scope.$apply(() => {
            $scope.newmado.bounds.size = res.size;
          });
        }).catch((err) => {});
      }, 2000);
    });
  };

  $scope.launch = (mado) => {
    Launcher.blank().launch(mado);
  };

  $scope.edit = (mado) => {
    $scope.newmado = mado;
  };

  $scope.remove = (mado) => {
    if (!window.confirm("この設定を削除しますか？\n\n" + mado.name)) return;
    MadoStore.local().remove(mado).then((removed) => {
      $scope.$apply(() => { delete $scope.list[removed.id()]; });
    });
  };

  $scope.showForm = () => {
    $scope.newmado = new Mado("", "");
  };

  $scope.adjust = () => {
    if (!$scope.visibleTab || !$scope.visibleWin) return;

    TabMessage.to($scope.visibleTab.id).send({
      bounds: $scope.newmado.bounds
    });

    Launcher.chrome($scope.visibleWin).update({
      width: $scope.newmado.bounds.size.w,
      height: $scope.newmado.bounds.size.h
    });
  };
});
