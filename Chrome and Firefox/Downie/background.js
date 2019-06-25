// Copyright (c) 2014-19 Charlie Monroe Software. All rights reserved.

function openLinkInDownie(url, postprocessing, tab){
	var action_url = "downie://XUOpenLink?url=" + encodeURI(url);
	action_url = action_url.replace("&", "%26");
	if (postprocessing != null) {
		action_url = action_url + "&postprocessing=" + postprocessing;
	}
	
	chrome.tabs.update(tab.id, {
		url: action_url
	});
};

chrome.contextMenus.create({
	"title" : "Open link in Downie",
	"contexts" : [ "link" ],
	"onclick" : function(info, tab){
		openLinkInDownie(info.linkUrl, null, tab);
	}
});

chrome.contextMenus.create({
	"title" : "Open Current Link in Downie [MP4]",
	"contexts" : ["page"],
	"onclick" : function(info, tab){
		openLinkInDownie(info.pageUrl, "mp4", tab);
	}
});

chrome.contextMenus.create({
	"title" : "Open Current Link in Downie [MP3]",
	"contexts" : ["page"],
	"onclick" : function(info, tab){
		openLinkInDownie(info.pageUrl, "mp3", tab);
	}
});

chrome.contextMenus.create({
	"title" : "Open Current Link in Downie [Permute]",
	"contexts" : ["page"],
	"onclick" : function(info, tab){
		openLinkInDownie(info.pageUrl, "permute", tab);
	}
});

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
	openLinkInDownie(tab.url, null, tab);
});

const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (isDark) {
	var darkModeIcons = {
		16: "downie_16x16_white.png"
	};
	
	chrome.browserAction.setIcon({
		path: darkModeIcons
	});
}

chrome.commands.onCommand.addListener(function(command) {
	var postprocessing = null;
	if (command == "XUOpenCurrentSite") {
		postprocessing = null;
	} else if (command == "XUOpenCurrentSiteMP4") {
		postprocessing = "mp4";
	} else if (command == "XUOpenCurrentSiteMP3") {
		postprocessing = "mp3";
	} else if (command == "XUOpenCurrentSitePermute") {
		postprocessing = "permute";
	} else {
		return;
	}
	
	chrome.tabs.query({
		active: true,
		lastFocusedWindow: true
	}, function(tabs) {
		// and use that tab to fill in out title and url
		var tab = tabs[0];
		openLinkInDownie(tab.url, postprocessing, tab);
	});
});