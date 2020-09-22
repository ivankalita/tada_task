(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports={
    "face": {
        "eyes": [
            "eyes1",
            "eyes10",
            "eyes2",
            "eyes3",
            "eyes4",
            "eyes5",
            "eyes6",
            "eyes7",
            "eyes9"
        ],
        "nose": [
            "nose2",
            "nose3",
            "nose4",
            "nose5",
            "nose6",
            "nose7",
            "nose8",
            "nose9"
        ],
        "mouth": [
            "mouth1",
            "mouth10",
            "mouth11",
            "mouth3",
            "mouth5",
            "mouth6",
            "mouth7",
            "mouth9"
        ],
        "colors": [
            {
                "slug": "red",
                "value": "F04747"
            },
            {
                "slug": "blue",
                "value": "7289DA"
            },
            {
                "slug": "green",
                "value": "43B581"
            },
            {
                "slug": "purple",
                "value": "904FAD"
            },
            {
                "slug": "yellow",
                "value": "FAA61A"
            },
            {
                "slug": "cyan",
                "value": "00BCD4"
            },
            {
                "slug": "lime",
                "value": "CDDC39"
            },
            {
                "slug": "brown",
                "value": "795548"
            }
        ]
    }
}
},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function Chat(options) {
  var messageBox = options.box || document.getElementById('msg-box');
  var host = options.host || 'pm.tada.team';
  var user = options.user || 'test123';
  var userAva = options.userAva || 'https://api.adorable.io/avatars/face/eyes1/nose2/mouth1/F04747/50';
  var chat = options.name || 'Tada.team';
  var chatEl = options.el;
  var ws = new WebSocket("ws://".concat(host, "/ws?name=").concat(user));
  var history = [];
  var users = [];

  function connect() {
    var rename = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    chatEl.querySelector('.chat-header__title .user-name').textContent = user;
    chatEl.querySelector('.chat-footer__ava .image').src = userAva;
    onMessage(rename); // сохраним текущего пользователя в localStorage
  }

  function close() {
    ws.close(1000, "".concat(user, " \u043F\u043E\u043A\u0438\u043D\u0443\u043B \u0447\u0430\u0442"));
  }

  function setChatName(newName) {
    chat = newName;
    window.document.title = chat;
  }

  function setUserName(newName) {
    if (!newName) {
      return;
    } else {
      ws.close(1000, "".concat(user, " changed name to ").concat(newName));
      ws = new WebSocket("ws://".concat(host, "/ws?name=").concat(newName));
      connect({
        oldName: user,
        newName: newName
      });
      user = newName;
      chatEl.querySelector('.chat-header__title .user-name').textContent = user;
    }
  }

  function sendMessage(msg) {
    ws.send(JSON.stringify({
      "text": msg
    }));
  }

  function onMessage(rename) {
    ws.onmessage = function (event) {
      var data = JSON.parse(event.data);
      var listItemMsg = null;

      if (data.typing === true) {
        return;
      }

      if (data.name !== undefined) {
        if (data.name === user) listItemMsg = templateMsgItem(true, data.name, data.text, data.created);else listItemMsg = templateMsgItem(false, data.name, data.text, data.created);
      } else {
        if (rename) listItemMsg = templateSysItem(true, rename, data.created);else listItemMsg = templateSysItem(false, data.text, data.created);
      }

      appendNewMsg(listItemMsg);
    };
  }

  function templateMsgItem(own, user, msg, date) {
    var dateCreated = new Date(date);
    var result = "\n        <li class=\"list-msg__item\">\n            <div class=\"ava\">\n                <img src=\"".concat(own ? userAva : 'https://api.adorable.io/avatars/50/random', "\" class=\"image\">\n            </div>\n            <div class=\"msg\">\n                <div class=\"msg-sender\">").concat(user, "</div>\n                <div class=\"msg-cnt\">").concat(msg, "</div>\n            </div>\n            <div class=\"date\">").concat(dateCreated.getDate(), ".").concat(dateCreated.getMonth() + 1 < 10 ? '0' + (dateCreated.getMonth() + 1) : dateCreated.getMonth() + 1, ".").concat(dateCreated.getFullYear(), "</div>\n        </li>");
    return result;
  }

  function templateSysItem(rename, text, date) {
    var dateCreated = new Date(date);
    var result = null;

    if (rename) {
      result = "\n            <li class=\"list-msg__item list-msg__item--system\">\n                <span>@".concat(text.oldName, " \u043F\u0435\u0440\u0435\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043B\u0441\u044F \u0432 ").concat(text.newName, "</span>\n            </li>");
    } else {
      result = "\n            <li class=\"list-msg__item list-msg__item--system\">\n                <span>\u043A \u0447\u0430\u0442\u0443 \u043F\u0440\u0438\u0441\u043E\u0435\u0434\u0438\u043D\u0438\u043B\u0441\u044F @".concat(text.slice(8), ", ").concat(dateCreated.getHours(), ":").concat(dateCreated.getMinutes() < 10 ? '0' + dateCreated.getMinutes() : dateCreated.getMinutes(), "</span>\n            </li>");
    }

    return result;
  }

  function appendNewMsg(template) {
    messageBox.innerHTML += template;
  }

  this.getHostName = function () {
    return host;
  };

  this.getUserName = function () {
    return user;
  };

  this.getChatName = function () {
    return chat;
  };

  this.init = connect;
  this.sendMessage = sendMessage;
  this.setUserName = setUserName;
  this.setChatName = setChatName;
  this.exit = close;
}

var _default = Chat;
exports["default"] = _default;
},{}],3:[function(require,module,exports){
"use strict";

var _Chat = _interopRequireDefault(require("./Chat"));

var _faces = _interopRequireDefault(require("../faces.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

(function () {
  var lobbyEl = document.getElementById('lobby-one');
  var lobbyCardName = lobbyEl.querySelector('.lobby-card--name');
  var lobbyCardAva = lobbyEl.querySelector('.lobby-card--ava');
  var avaImage = document.getElementById('ava-image');
  var chatEl = document.getElementById('chat-one');
  var sendNewMessageBtn = document.getElementById('sndBtn');
  var chatHeader = chatEl.querySelector('.chat-header');
  var chatFooter = chatEl.querySelector('.chat-footer');
  var newMessageInp = document.getElementById('input-msg'); // fetch('https://api.adorable.io/avatars/list', {}).then(resp => console.log(resp))

  var chat = null;
  var userName = 'test123';
  lobbyCardName.querySelector('[lobby-next]').addEventListener('click', function () {
    if (lobbyCardName.querySelector('.inp').value.trim().length !== 0 && !lobbyCardName.querySelector('.inp').value.trim().match(/[^a-zA-Z0-9а-яА-Я_]+/g)) {
      userName = lobbyCardName.querySelector('.inp').value.trim();
      lobbyCardName.querySelector('.inp-error').classList.remove('show');
      lobbyCardName.classList.remove('current');
      lobbyCardAva.classList.add('current');
    } else if (lobbyCardName.querySelector('.inp').value.trim().match(/[^a-zA-Z0-9а-яА-Я_]+/g)) {
      lobbyCardName.querySelector('.inp-error').textContent = 'Только буквы, цифры и _';
      lobbyCardName.querySelector('.inp-error').classList.add('show');
    } else {
      lobbyCardName.querySelector('.inp-error').textContent = 'Нельзя оставить пустым';
      lobbyCardName.querySelector('.inp-error').classList.add('show');
    }
  });
  lobbyCardName.querySelector('.inp').addEventListener('input', function (ev) {
    if (ev.target.value.trim().length > 20) {
      ev.target.value = userName;
      lobbyCardName.querySelector('.inp-error').textContent = 'Не более 20 символов';
      lobbyCardName.querySelector('.inp-error').classList.add('show');
    } else if (ev.data && ev.data.match(/^[^a-zA-Z0-9а-яА-Я_]+$/g)) {
      lobbyCardName.querySelector('.inp-error').textContent = 'Только буквы, цифры и _';
      lobbyCardName.querySelector('.inp-error').classList.add('show');
    } else {
      userName = ev.target.value;
      lobbyCardName.querySelector('.inp-error').classList.remove('show');
    }
  });
  lobbyCardAva.addEventListener('click', function (ev) {
    if (ev.target == lobbyCardAva.querySelector('[lobby-prev]')) {
      lobbyCardAva.classList.remove('current');
      lobbyCardName.classList.add('current');
    } else if (ev.target == lobbyCardAva.querySelector('[lobby-accept]')) {
      chat = new _Chat["default"]({
        user: userName,
        userAva: avaImage.src.replace('/100', '/50'),
        box: chatEl.querySelector('.list-msg'),
        el: document.getElementById('chat-one')
      });
      chat.init();
      lobbyCardAva.classList.add('done');
      chatEl.classList.add('show');
      lobbyEl.classList.remove('show');
    }
  });
  var eyeCurrent = 0;
  var noseCurrent = 0;
  var mouthCurrent = 0;
  var colorCurrent = 0;
  lobbyCardAva.querySelectorAll('.ava-creator .item').forEach(function (item) {
    item.addEventListener('click', function (ev) {
      if (this.parentElement.classList.contains('ava-creator__prev')) {
        if (this.dataset.cntrl === 'eyes' && eyeCurrent !== 0) {
          eyeCurrent--;
        }

        if (this.dataset.cntrl === 'nose' && noseCurrent !== 0) {
          noseCurrent--;
        }

        if (this.dataset.cntrl === 'mouth' && mouthCurrent !== 0) {
          mouthCurrent--;
        }

        loadNewAvaImage();
      }

      if (this.parentElement.classList.contains('ava-creator__next')) {
        if (this.dataset.cntrl === 'eyes' && eyeCurrent < _faces["default"].face.eyes.length - 1) {
          eyeCurrent++;
        }

        if (this.dataset.cntrl === 'nose' && noseCurrent < _faces["default"].face.nose.length - 1) {
          noseCurrent++;
        }

        if (this.dataset.cntrl === 'mouth' && mouthCurrent < _faces["default"].face.mouth.length - 1) {
          mouthCurrent++;
        }

        loadNewAvaImage();
      }
    });
  });
  lobbyCardAva.querySelectorAll('.clr-picker__item').forEach(function (picker) {
    picker.addEventListener('click', function (ev) {
      var _this = this;

      if (!this.classList.contains('selected')) {
        Array.from(this.parentElement.children).forEach(function (chld) {
          return chld.classList.contains('selected') ? chld.classList.remove('selected') : false;
        });
        this.classList.add('selected');

        _faces["default"].face.colors.forEach(function (item, index) {
          return item.slug === _this.dataset.clr ? colorCurrent = index : false;
        });

        loadNewAvaImage();
      }
    });
  });

  function loadNewAvaImage() {
    avaImage.src = "https://api.adorable.io/avatars/face/".concat(_faces["default"].face.eyes[eyeCurrent], "/").concat(_faces["default"].face.nose[noseCurrent], "/").concat(_faces["default"].face.mouth[mouthCurrent], "/").concat(_faces["default"].face.colors[colorCurrent].value, "/100");
  }

  chatHeader.addEventListener('click', function (ev) {
    if (ev.target.classList.contains('menu-list__item')) {
      if (ev.target.dataset.action === 'changeUserName') {
        var _userName = chatHeader.querySelector('.chat-header__title .user-name');

        chatHeader.querySelector('.chat-header__settings .cbx').checked = false;

        _userName.setAttribute('contenteditable', 'true');

        _userName.focus();

        _userName.classList.add('active');

        _userName.addEventListener('keydown', preventEnter);
      } else if (ev.target.dataset.action === 'changeChatName') {
        var chatName = chatHeader.querySelector('.chat-header__title .chat-name');
        chatHeader.querySelector('.chat-header__settings .cbx').checked = false;
        chatName.setAttribute('contenteditable', 'true');
        chatName.focus();
        chatName.classList.add('active');
        chatName.addEventListener('keydown', preventEnter);
      } else if (ev.target.dataset.action === 'exit') {
        chat.exit();
        chatEl.classList.remove('show');
        lobbyEl.classList.add('show');
        lobbyCardName.classList.add('current');
        lobbyCardAva.classList.remove('current', 'done');
      }
    }

    function preventEnter(event) {
      var editField = null;

      if (ev.target.dataset.action === 'changeUserName') {
        editField = chatHeader.querySelector('.chat-header__title .user-name');
      } else if (ev.target.dataset.action === 'changeChatName') {
        editField = chatHeader.querySelector('.chat-header__title .chat-name');
      }

      if (event.key === 'Enter') {
        event.preventDefault();
        editField.blur();
        editField.removeAttribute('contenteditable');
        editField.classList.remove('active');

        if (ev.target.dataset.action === 'changeUserName') {
          chat.setUserName(editField.textContent);
        } else if (ev.target.dataset.action === 'changeChatName') {
          chat.setChatName(editField.textContent);
        }
      }

      if (event.key.length === 1 && (event.key.charCodeAt() >= 97 && event.key.charCodeAt() <= 122 || // a-z
      event.key.charCodeAt() >= 65 && event.key.charCodeAt() <= 90 || // A-Z
      event.key.charCodeAt() >= 48 && event.key.charCodeAt() <= 57 || // 0-9
      event.key.charCodeAt() >= 1040 && event.key.charCodeAt() <= 1103 || // а-яА-Я
      event.key.charCodeAt() === 95)) // _
        {
          if (editField.textContent.length > 19) event.preventDefault();
        } // if (event.key.match(/^[a-zA-Z0-9а-яА-Я]+$/gi) && event.key.match()) { console.log(event.key)}

    }
  });
  chatFooter.addEventListener('click', function (ev) {
    if (ev.target == newMessageInp) {
      newMessageInp.classList.add('active');
    } else if (ev.target == sendNewMessageBtn && newMessageInp.value.trim() !== '') {
      console.dir(newMessageInp);
      chat.sendMessage(newMessageInp.value.trim());
      newMessageInp.classList.remove('active');
      newMessageInp.blur();
      newMessageInp.value = '';
    }
  });
})();
},{"../faces.json":1,"./Chat":2}]},{},[3]);
