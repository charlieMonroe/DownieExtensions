
function __HandleKeyDown(e) {
	// Do not handle these shortcuts on Netflix.
	if (window.location.host.endsWith("netflix.com")) {
		return;
	}
	
	var keyCode = event.which;
	if (keyCode == 68 && e.ctrlKey && !e.metaKey && !e.altKey && e.shiftKey) {
		browser.runtime.sendMessage({ action: "openCurrentTab", cookies: document.cookie ?? "" });
	} else if (keyCode == 68 && e.ctrlKey && !e.metaKey && e.altKey && e.shiftKey) {
		browser.runtime.sendMessage({ action: "openAllTabs" });
	}
};

window.addEventListener("keydown", __HandleKeyDown, false);
