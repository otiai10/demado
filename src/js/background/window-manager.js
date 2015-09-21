var dmd = dmd || {};
dmd.windowManager = {
  open: function(params) {
    chrome.windows.create({
      type:   params.type || "popup",
      url:    params.url,
      width:  params.width, // including the frame
      height: params.height // including the frame
    });
  }
};
