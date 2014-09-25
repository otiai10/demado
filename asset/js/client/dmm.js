setTimeout(function(){
    var client = new DMD.DMMPageClient();
    client.shift().done(function(){ client.adjust(); });
});