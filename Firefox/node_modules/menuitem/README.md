# Menuitem

[![Build Status](https://travis-ci.org/jetpack-labs/menuitem.png)](https://travis-ci.org/jetpack-labs/menuitem)

[![NPM](https://nodei.co/npm/menuitem.png?stars&downloads)](https://nodei.co/npm/menuitem/)
[![NPM](https://nodei.co/npm-dl/menuitem.png)](https://nodei.co/npm/menuitem)

The menuitems API is a simple way to create a menuitem,
which can perform an action when clicked, and display state.

## Example

    // create menuitem for the File menu,
    // and insert it before the 'Quit' menuitem
    require("menuitem").Menuitem({
      id: "myextprefix-some-mi-id",
      menuid: "menu_FilePopup",
      insertbefore: "menu_FileQuitItem",
      "label": _("label"),
      "accesskey": _("label.ak"),
      image: self.data.url("icon.png"),
      className: 'pizazz',
      disabled: false,
      checked: false,
      onCommand: function() {
        // do something
      }
    });
