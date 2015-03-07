setTimeout(function(){
    var client = new DMD.YahooMobagePageClient();
    client.shift().done(function(){ client.adjust(); });
    client.listenOnBeforeUnload();
    setInterval(function(){
        client.sendPositionTracking();
    }, 10 * 1000);
});