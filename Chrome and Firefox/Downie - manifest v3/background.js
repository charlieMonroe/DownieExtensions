// Copyright (c) 2014-19 Charlie Monroe Software. All rights reserved.

function openLinkInDownie(url, postprocessing, tab){
	var action_url = "downie://XUOpenLink?url=" + encodeURI(url);
	action_url = action_url.replaceAll("&", "%26");
	action_url = action_url.replaceAll("#", "%23");
	if (postprocessing != null) {
		action_url = action_url + "&postprocessing=" + postprocessing;
	}
	
	chrome.tabs.update(tab.id, {
		url: action_url
	});
};

chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create({
		"id": 'open-in-downie',
		"title" : "Open link in Downie",
		"contexts" : ["link"]
	});
	
	chrome.contextMenus.create({
		"id": 'open-in-downie-mp4',
		"title" : "Open Current Link in Downie [MP4]",
		"contexts" : ["page"]
	});
	
	chrome.contextMenus.create({
		"id": 'open-in-downie-audio',
		"title" : "Open Current Link in Downie [Audio]",
		"contexts" : ["page"]
	});
	
	chrome.contextMenus.create({
		"id": 'open-in-downie-permute',
		"title" : "Open Current Link in Downie [Permute]",
		"contexts" : ["page"]
	});
	
	
	const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
	if (isDark) {
		var darkModeIcons = {
			16: "downie_16x16_white.png"
		};
		
		chrome.action.setIcon({
			path: darkModeIcons
		});
	}
	
});

try {
	chrome.contextMenus.onClicked.addListener( (info, tab) => {
		if (info.menuItemId === "open-in-downie") {
			openLinkInDownie(info.linkUrl, null, tab);
		} else if (info.menuItemId === "open-in-downie-mp4") {
			openLinkInDownie(info.pageUrl, "mp4", tab);
		} else if (info.menuItemId === "open-in-downie-audio") {
			openLinkInDownie(info.pageUrl, "audio", tab);
		} else if (info.menuItemId === "open-in-downie-permute") {
			openLinkInDownie(info.pageUrl, "permute", tab);
		}
	});
} catch (e) {
	console.error(e);
}

// Called when the user clicks on the browser action.
chrome.action.onClicked.addListener(function(tab) {
	openLinkInDownie(tab.url, null, tab);
});

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