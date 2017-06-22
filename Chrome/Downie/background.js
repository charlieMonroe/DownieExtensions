// Copyright (c) 2014-16 Charlie Monroe Software. All rights reserved.

function openLinkInDownie(url, tab){
	var action_url = "downie://XUOpenLink?url=" + url;
	chrome.tabs.update(tab.id, {
		url: action_url
	});
};

chrome.contextMenus.create({
	"title" : "Open link in Downie",
	"contexts" : [ "link" ],
	"onclick" : function(info, tab){
		openLinkInDownie(info.linkUrl, tab);
	}
});

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
	openLinkInDownie(tab.url, tab);
});

chrome.commands.onCommand.addListener(function(command) {
	if (command == "XUOpenCurrentSite") {
		chrome.tabs.query({
			active: true,
			lastFocusedWindow: true
		}, function(tabs) {
			// and use that tab to fill in out title and url
			var tab = tabs[0];
			openLinkInDownie(tab.url, tab);
		});
	}
});