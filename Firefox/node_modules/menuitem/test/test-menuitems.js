/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
'use strict'

const windowUtils = require('sdk/deprecated/window-utils');
const menuitems = require('../index');

let window = windowUtils.activeBrowserWindow;
let document = window.document;
function $(id) document.getElementById(id);

function createMI(options, test) {
  test.equal(!$(options.id), true);
  var mi = new menuitems.Menuitem(options);
  return mi;
}

exports.testMIDoesNotExist = function(assert) {
  var options = {
    id: "test-mi-dne",
    label: "test"
  };
  createMI(options, assert);
  assert.equal(!!$(options.id), false, 'menuitem does not exists');
};

exports.testMIDoesExist = function(assert) {
  var options = {
    id: "test-mi-exists",
    label: "test",
    menuid: 'menu_FilePopup'
  };
  let mi = createMI(options, assert);
  let menuitem = $(options.id);
  assert.equal(!!menuitem, true, 'menuitem exists');
  assert.equal(menuitem.id, options.id, 'menuitem id is ok');
  assert.equal(menuitem.getAttribute('label'), options.label, 'menuitem label is ok');
  assert.equal(menuitem.parentNode.id, options.menuid, 'in the file menu');
  assert.equal(menuitem.getAttribute('disabled'), 'false', 'menuitem not disabled');
  assert.equal(menuitem.getAttribute('accesskey'), '', 'menuitem accesskey is ok');
  assert.equal(menuitem.getAttribute('class'), '', 'menuitem class is ok');
  assert.equal(menuitem.nextSibling, undefined, 'menuitem is last');
  assert.equal(menuitem.hasAttribute("checked"), false, 'menuitem not checked');
  mi.destroy();
  assert.ok(!$(options.id), 'menuitem is gone');
  assert.equal(menuitem.parentNode, null, 'menuitem has no parent');
};

exports.testMIOnClick = function(assert, done) {
  let options = {
    id: "test-mi-onclick",
    label: "test",
    menuid: 'menu_FilePopup',
    onCommand: function() {
      mi.destroy();
      assert.pass('onCommand worked!');
      done();
    }
  };

  let e = document.createEvent("UIEvents");
  e.initUIEvent("command", true, true, window, 1);

  var mi = createMI(options, assert);
  let menuitem = $(options.id);
  assert.equal(!!menuitem, true, 'menuitem exists');
  menuitem.dispatchEvent(e);
};

exports.testMIDisabled = function(assert, done) {
  let commandIsOK = false;
  let count = 0;
  let options = {
    id: "test-mi-disabled",
    label: "test",
    disabled: true,
    menuid: 'menu_FilePopup',
    onCommand: function() {
      count++;
      if (!commandIsOK) {
        assert.fail('onCommand was called, that is not ok');
        return;
      }

      mi.destroy();
      assert.equal(count, 1, 'onCommand was called the correct number of times!');
      done();
    }
  };

  let e = document.createEvent("UIEvents");
  e.initUIEvent("command", true, true, window, 1);

  var mi = createMI(options, assert);
  let menuitem = $(options.id);
  assert.equal(!!menuitem, true, 'menuitem exists');
  assert.equal(menuitem.getAttribute('disabled'), 'true', 'menuitem not disabled');
  menuitem.dispatchEvent(e);
  mi.disabled = false;
  assert.equal(menuitem.getAttribute('disabled'), 'false', 'menuitem not disabled');
  commandIsOK = true;
  menuitem.dispatchEvent(e);
};

exports.testMIChecked = function(assert) {
  let options = {
    id: "test-mi-checked",
    label: "test",
    disabled: true,
    menuid: 'menu_FilePopup',
    checked: true
  };

  let mi = createMI(options, assert);
  let menuitem = $(options.id);
  assert.equal(!!menuitem, true, 'menuitem exists');
  assert.equal(menuitem.getAttribute("checked"), "true", 'menuitem checked');
  mi.checked = false;
  assert.equal(menuitem.getAttribute("checked"), "false", 'menuitem checked');
  mi.destroy();
};

exports.testMIClass = function(assert) {
  let options = {
    id: "test-mi-class",
    label: "pizazz",
    className: "pizazz",
    menuid: 'menu_FilePopup',
  };

  var mi = createMI(options, assert);
  let menuitem = $(options.id);
  assert.equal(!!menuitem, true, 'menuitem exists');
  assert.equal(menuitem.getAttribute('class'), 'pizazz', 'menuitem not disabled');
  mi.destroy();
};

exports.testInsertBeforeExists = function(assert) {
  let options = {
    id: 'test-mi-insertbefore',
    label: 'insertbefore',
    insertbefore:'menu_FileQuitItem',
    menuid: 'menu_FilePopup',
  };

  var mi = createMI(options, assert);
  let menuitem = $(options.id);
  assert.equal(!!menuitem, true, 'menuitem exists');
  assert.equal(menuitem.nextSibling, $('menu_FileQuitItem'), 'menuitem not disabled');
  mi.destroy();
};

exports.testInsertBeforeDoesNotExist = function(assert) {
  let options = {
    id: 'test-mi-insertbefore',
    label: 'insertbefore',
    insertbefore:'menu_ZZZDNE',
    menuid: 'menu_FilePopup',
  };

  var mi = createMI(options, assert);
  let menuitem = $(options.id);
  assert.equal(!!menuitem, true, 'menuitem exists');
  assert.equal(menuitem.nextSibling, null, 'menuitem not disabled');
  mi.destroy();
};

require('sdk/test').run(exports);
