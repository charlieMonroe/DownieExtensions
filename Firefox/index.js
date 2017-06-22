var self = require("sdk/self");
var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");

var button = buttons.ActionButton({
  id: "downie-link",
  label: "Open in Downie",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onClick: handleClick
});

function handleClick(state) {
  XUOpenLink();
}

function XUOpenURL(url){
	url = "downie://XUOpenLink?url=" + url;

  console.log("XUOpenURL: " + url);
  
  tabs.activeTab.url = url;
}

function XUOpenLink() {
	XUOpenURL(tabs.activeTab.url);
}


var contextMenu = require("sdk/context-menu");
var menuItem = contextMenu.Item({
  label: "Open Link in Downie",
  context: contextMenu.URLContext('*'),
  contentScript: 'self.on("click", function (node, data) {' +
                 '  self.postMessage(node.href);' +
                 '});',
  image: self.data.url("icon-16.png"),
  onMessage: function (selectionText) {
    XUOpenURL(selectionText);
  }
});


var { Hotkey } = require("sdk/hotkeys");
var showHotKey = Hotkey({
  combo: "control-alt-d",
  onPress: function() {
    XUOpenLink();
  }
});

console.log(showHotKey);

