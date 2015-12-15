"use strict";

angular.module("demado", []).controller("ConfigsController", ($scope) => {
  $scope.newmado = new Mado(null, null);
  MadoStore.local().all().then((list) => {
    $scope.$apply(() => { $scope.list = list });
  });

  $scope.commit = (mado) => {
    MadoStore.local().set(mado).then((set) => {
      location.reload(); // FIXME
    });
  };

  $scope.visible = (mado) => {
    MadoStore.local().set(mado).then((set) => {
      Launcher.launch(mado);
    });
  };

  $scope.edit = (mado) => {
    $scope.newmado = mado;
  };

  $scope.remove = (mado) => {
    MadoStore.local().remove(mado).then((removed) => {
      $scope.$apply(() => { delete $scope.list[removed.id()]; });
    });
  };

  $scope.showForm = () => {
    $scope.newmado = new Mado("", "");
  };
});
