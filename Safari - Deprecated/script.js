
document.addEventListener("contextmenu", handleContextMenu, false);
function handleContextMenu(event) {
	var node = event.target;
	while (node != null) {
		if (node.nodeName == "A") {
			var url = node.href;
			if (url != undefined) {
				safari.extension.setContextMenuEventUserInfo(event, { "selectedLink": url });
				return;
			}
		}
		
		node = node.parentNode;
	}
}

function __XUHandleKeyDown(e) {
	// Do not handle these shortcuts on Netflix.
	if (window.location.host.endsWith("netflix.com")) {
		return;
	}
	
	var keyCode = event.which;
	if (keyCode == 68 && e.ctrlKey && !e.metaKey && !e.altKey && e.shiftKey) {
		safari.extension.dispatchMessage("XUOpenCurrentSite");
	} else if (keyCode == 68 && e.ctrlKey && !e.metaKey && e.altKey && e.shiftKey) {
		safari.extension.dispatchMessage("XUOpenAllSites");
	}
}

window.addEventListener("keydown", __XUHandleKeyDown, false);
