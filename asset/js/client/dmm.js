setTimeout(function(){
    var client = new DMD.DMMPageClient();
    client.shift().done(function(){ client.adjust(); });
    client.listenOnBeforeUnload();
    setInterval(function(){
        client.sendPositionTracking();
    }, 10 * 1000);
});