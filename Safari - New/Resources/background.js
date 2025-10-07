// Copyright (c) 2014-2025 Charlie Monroe Software. All rights reserved.

async function openLinkInDownie(tabID, url, postprocessing, cookies){
	var obj = {
		'action': 'open',
		'url': url,
		'cookies': cookies ?? "",
		'tab_id': tabID
	};
	
	if (postprocessing != null) {
		obj.postprocessing = postprocessing;
	}
	
	browser.runtime.sendNativeMessage("", obj, function(response) {
		var close = response.closeTabAfterSendingLink;
		if (close) {
			browser.tabs.remove(tabID);
		}
	});
};

function getCookies() {
	return document.cookie ?? "";
}

function openTabInDownie(tab, postprocessing, cookies) {
	const url = tab.url;
	if (url == null || url == undefined) {
		return;
	}
	
	if (cookies == null || cookies == undefined) {
		browser.scripting.executeScript({
			target : {tabId : tab.id},
			func : getCookies
		})
		.then(injectionResults => {
			for (const {frameId, result} of injectionResults) {
				openLinkInDownie(tab.id, url, postprocessing, result);
			}
		});
	} else {
		openLinkInDownie(tab.id, url, postprocessing, cookies);
	}
}

function openCurrentTab(cookies) {
	browser.tabs.query({
		active: true,
		lastFocusedWindow: true
	}, function(tabs) {
		// and use that tab to fill in out title and url
		var tab = tabs[0];
		openTabInDownie(tab, null, cookies);
	});
}

function onMenuCreated() {
	if (browser.runtime.lastError) {
		console.log("error creating item: ", browser.runtime.lastError);
	}
}

browser.contextMenus.create({
	"id": 'open-in-downie',
	"title": browser.i18n.getMessage("open_link"),
	"contexts" : ["link"]
}, onMenuCreated);

browser.contextMenus.create({
	"id": 'open-in-downie-none',
	"title": browser.i18n.getMessage("open_current_link"),
	"contexts" : ["page"]
}, onMenuCreated);

browser.contextMenus.create({
	"id": 'open-in-downie-mp4',
	"title": browser.i18n.getMessage("open_current_link_mp4"),
	"contexts" : ["page"]
}, onMenuCreated);

browser.contextMenus.create({
	"id": 'open-in-downie-audio',
	"title": browser.i18n.getMessage("open_current_link_audio"),
	"contexts" : ["page"]
}, onMenuCreated);

browser.contextMenus.create({
	"id": 'open-in-downie-permute',
	"title": browser.i18n.getMessage("open_current_link_permute"),
	"contexts" : ["page"]
}, onMenuCreated);

browser.contextMenus.onClicked.addListener( (info, tab) => {
	if (info.menuItemId === "open-in-downie") {
		openLinkInDownie(tab.id, info.linkUrl, null, null);
	} else if (info.menuItemId === "open-in-downie-none") {
		openLinkInDownie(tab.id, info.pageUrl, null, null);
	} else if (info.menuItemId === "open-in-downie-mp4") {
		openLinkInDownie(tab.id, info.pageUrl, "mp4", null);
	} else if (info.menuItemId === "open-in-downie-audio") {
		openLinkInDownie(tab.id, info.pageUrl, "audio", null);
	} else if (info.menuItemId === "open-in-downie-permute") {
		openLinkInDownie(tab.id, info.pageUrl, "permute", null);
	}
});

// Called when the user clicks on the browser action.
browser.action.onClicked.addListener(function(tab) {
	openTabInDownie(tab, null, null);
});

browser.runtime.onMessage.addListener(function(message) {
	const action = message.action;
	if (action == "openCurrentTab") {
		openCurrentTab(message.cookies);
	} else if (action == "openAllTabs") {
		browser.tabs.query({
			currentWindow: true,
			lastFocusedWindow: true
		}, function(tabs) {
			// and use that tab to fill in out title and url
			for (const tab of tabs) {
				openTabInDownie(tab, null, null);
			}
		});
	}
});


