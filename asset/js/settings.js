setTimeout(function () {
    var settingsView = new DMD.SettingsView();
    var commentsView = new DMD.CommentsView();
    $('#wrapper').append(
        settingsView.render().$el,
        commentsView.render().$el
    );
});
