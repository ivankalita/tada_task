(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function Chat(options) {
  var messageBox = options.box || document.getElementById('msg-box');
  var host = options.host || 'pm.tada.team';
  var name = options.name || 'test123';
  var ws = new WebSocket("ws://".concat(host, "/ws?name=").concat(name));
  var history = [];
  var users = [];

  function connect() {
    var rename = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    onMessage(rename);
  }

  function setUserName(newName) {
    if (!newName) {
      return;
    } else {
      ws.close(1000, "".concat(name, " changed name to ").concat(newName));
      ws = new WebSocket("ws://".concat(host, "/ws?name=").concat(newName));
      connect({
        oldName: name,
        newName: newName
      });
      name = newName;
    }
  }

  function sendMessage(msg) {
    console.log(msg);
    ws.send(JSON.stringify({
      "text": msg
    }));
  }

  function onMessage(rename) {
    ws.onmessage = function (event) {
      var data = JSON.parse(event.data);
      var listItemMsg = null;
      console.log('message:', data);

      if (data.typing === true) {
        return;
      }

      if (data.name !== undefined) {
        listItemMsg = templateMsgItem(data.name, data.text, data.created);
      } else {
        if (rename) listItemMsg = templateSysItem(true, rename, data.created);else listItemMsg = templateSysItem(false, data.text, data.created);
      }

      appendNewMsg(listItemMsg);
    };
  }

  function templateMsgItem(user, msg, date) {
    var dateCreated = new Date(date);
    var result = "\n        <li class=\"list-msg__item\">\n            <div class=\"ava\">\n                <img src=\"https://api.adorable.io/avatars/50/abott@adorable.png\" class=\"image\">\n            </div>\n            <div class=\"msg\">\n                <div class=\"msg-sender\">".concat(user, "</div>\n                <div class=\"msg-cnt\">").concat(msg, "</div>\n            </div>\n            <div class=\"date\">").concat(dateCreated.getDate(), ".").concat(dateCreated.getMonth() + 1 < 10 ? '0' + (dateCreated.getMonth() + 1) : dateCreated.getMonth() + 1, ".").concat(dateCreated.getFullYear(), "</div>\n        </li>");
    return result;
  }

  function templateSysItem(rename, text, date) {
    var dateCreated = new Date(date);
    var result = null;

    if (rename) {
      result = "\n            <li class=\"list-msg__item list-msg__item--system\">\n                <span>@".concat(text.oldName, " \u043F\u0435\u0440\u0435\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043B\u0441\u044F \u0432 ").concat(text.newName, "</span>\n            </li>");
    } else {
      result = "\n            <li class=\"list-msg__item list-msg__item--system\">\n                <span>\u043A \u0447\u0430\u0442\u0443 \u043F\u0440\u0438\u0441\u043E\u0435\u0434\u0438\u043D\u0438\u043B\u0441\u044F @".concat(text.slice(8), ", ").concat(dateCreated.getHours(), ":").concat(dateCreated.getMinutes(), "</span>\n            </li>");
    }

    return result;
  }

  function appendNewMsg(template) {
    messageBox.innerHTML += template;
  }

  this.getHost = function () {
    return host;
  };

  this.getName = function () {
    return name;
  };

  this.init = connect;
  this.sendMessage = sendMessage;
  this.setUserName = setUserName;
}

var _default = Chat;
exports["default"] = _default;
},{}],2:[function(require,module,exports){
"use strict";

var _Chat = _interopRequireDefault(require("./Chat"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

(function () {
  // let ws = new WebSocket('ws://pm.tada.team' + "/ws?name=test123");
  var chatEl = document.getElementById('chat-one'); // let changeNameBtn = document.getElementById('setNewName');
  // let changeNameInp = document.getElementById('newName');

  var sendNewMessageBtn = document.getElementById('sndBtn');
  var chatHeader = chatEl.querySelector('.chat-header');
  var chatFooter = chatEl.querySelector('.chat-footer');
  var newMessageInp = document.getElementById('input-msg');
  var chat = new _Chat["default"]({
    box: chatEl.querySelector('.list-msg')
  });
  chat.init(); // changeNameBtn.addEventListener('click', () => {
  //     if (changeNameInp.value) {
  //         chat.setUserName(changeNameInp.value)
  //     }
  //     //     ws.close(1000, 'change user name')
  //     //     ws = new WebSocket(`ws://pm.tada.team/ws?name=${changeNameInp.value}`);
  //     //     reconnect(ws)
  //     // }
  // })
  // sendNewMessageBtn.addEventListener('click', () => {
  //     if (newMessageInp.value) {
  //         chat.sendMessage(newMessageInp.value)
  //     }
  // })

  chatHeader.addEventListener('click', function (ev) {
    if (ev.target.classList.contains('menu-list__item')) {
      if (ev.target.dataset.action === 'changeUserName') {
        var userName = chatHeader.querySelector('.chat-header__title .user-name');
        chatHeader.querySelector('.chat-header__settings .cbx').checked = false;
        userName.setAttribute('contenteditable', 'true');
        userName.focus();
        userName.classList.add('active');
        userName.addEventListener('keydown', preventEnter);
      }
    }
  });

  function preventEnter(event) {
    var userName = chatHeader.querySelector('.chat-header__title .user-name');

    if (event.key === 'Enter') {
      event.preventDefault();
      userName.blur();
      userName.removeAttribute('contenteditable');
      userName.classList.remove('active');
      chat.setUserName(userName.textContent);
    }

    if (event.key.length === 1 && (event.key.charCodeAt() >= 97 && event.key.charCodeAt() <= 122 || // a-z
    event.key.charCodeAt() >= 65 && event.key.charCodeAt() <= 90 || // A-Z
    event.key.charCodeAt() >= 48 && event.key.charCodeAt() <= 57 || // 0-9
    event.key.charCodeAt() >= 1040 && event.key.charCodeAt() <= 1103 || // а-яА-Я
    event.key.charCodeAt() === 95)) // _
      {
        if (userName.textContent.length > 19) event.preventDefault();
      } // if (event.key.match(/^[a-zA-Z0-9а-яА-Я]+$/gi) && event.key.match()) { console.log(event.key)}

  }

  chatFooter.addEventListener('click', function (ev) {
    if (ev.target == newMessageInp || ev.target == newMessageInp.querySelector('[edit]')) {
      newMessageInp.classList.add('active');
      newMessageInp.querySelector('[edit]').setAttribute('contenteditable', 'true');
      newMessageInp.querySelector('[edit]').focus();
    } else if (ev.target == sendNewMessageBtn) {
      chat.sendMessage(newMessageInp.textContent);
    }

    console.log(ev.target);
  });
})();
},{"./Chat":1}]},{},[2]);
