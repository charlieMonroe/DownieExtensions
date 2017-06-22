
document.addEventListener("contextmenu", handleContextMenu, false);
function handleContextMenu(event) {
	if (event.target.nodeName == "A"){
		var url = event.target.href;
		if (url != undefined) {
			safari.extension.setContextMenuEventUserInfo(event, { "selectedLink": url });
		}
	}
}

function __XUHandleKeyDown(e) {
	var keyCode = event.charCode || event.keyCode;
	if (keyCode == 68 && e.ctrlKey && !e.metaKey && !e.altKey && e.shiftKey) {
		safari.extension.dispatchMessage("XUOpenCurrentSite");
	}
}

window.addEventListener("keydown", __XUHandleKeyDown, false);
