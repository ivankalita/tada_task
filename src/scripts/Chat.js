function Chat(options) {
    let messageBox = options.box || document.getElementById('msg-box');
    let host = options.host || 'pm.tada.team';
    let user = options.user || 'test123';
    let userAva = options.userAva || 'https://api.adorable.io/avatars/face/eyes1/nose2/mouth1/F04747/50';
    let chat = options.name || 'Tada.team';
    let chatEl = options.el;
    let ws = new WebSocket(`ws://${host}/ws?name=${user}`);
    let history = [];
    let users = [];

    function connect(rename = null, historyFlag = false) {
        chatEl.querySelector('.chat-header__title .user-name').textContent = user;
        chatEl.querySelector('.chat-header__title .chat-name').textContent = chat;
        chatEl.querySelector('.chat-footer__ava .image').src = userAva;
        onMessage(rename)

        // сохраним текущего пользователя в localStorage
        localStorage.setItem('chatUserName', user)
        localStorage.setItem('chatUserAva', userAva)
        localStorage.setItem('chatName', chat)

        // воссоздаём историю переписки
        if (historyFlag) {
            history = JSON.parse(localStorage.getItem('chatHistory'));

            history.forEach(event => {
                let listItemMsg = null
                if (event.name !== undefined) {
                    if (event.name === user) listItemMsg = templateMsgItem(true, event.name, event.text, event.created);
                    else listItemMsg = templateMsgItem(false, event.name, event.text, event.created);
                } else {
                    listItemMsg = templateSysItem(false, event.text, event.created);
                }

                appendNewMsg(listItemMsg)
            })
        } else {
            messageBox.innerHTML = ''
        }
    }

    function close() {
        ws.close(1000, `${user} покинул чат`);
        localStorage.removeItem('chatUserName');
        localStorage.removeItem('chatUserAva');
        localStorage.removeItem('chatName');
        localStorage.removeItem('chatHistory');
    }

    function setChatName(newName) {
        chat = newName;
        window.document.title = chat;
        localStorage.setItem('chatName', chat)
    }

    function setUserName(newName) {
        if (!newName) {
            return
        }
        else {
            ws.close(1000, `${user} changed name to ${newName}`);
            ws = new WebSocket(`ws://${host}/ws?name=${newName}`);

            connect({
                oldName: user,
                newName
            });

            user = newName;
            chatEl.querySelector('.chat-header__title .user-name').textContent = user;
            localStorage.setItem('chatUserName', user)
        }
    }

    function sendMessage(msg) {
        console.log(msg)
        ws.send(JSON.stringify({
            "text": msg
        }))
    }

    function onMessage(rename) {
        ws.onmessage = function (event) {
            let data = JSON.parse(event.data);
            let listItemMsg = null;
            
            console.log(data)

            history.push(data)
            localStorage.setItem('chatHistory', JSON.stringify(history))

            if (data.typing === true) {
                return
            }
    
            if (data.name !== undefined) {
                if (data.name === user) listItemMsg = templateMsgItem(true, data.name, data.text, data.created);
                else listItemMsg = templateMsgItem(false, data.name, data.text, data.created);
            } else {
                if (rename) listItemMsg = templateSysItem(true, rename, data.created);
                else listItemMsg = templateSysItem(false, data.text, data.created);
            }

            appendNewMsg(listItemMsg)
        };
    }

    function templateMsgItem(own, user, msg, date) {
        let dateCreated = new Date(date);

        let result = `
        <li class="list-msg__item">
            <div class="ava">
                <img src="${own ? userAva : 'https://api.adorable.io/avatars/50/random'}" class="image">
            </div>
            <div class="msg">
                <div class="msg-sender">${user}</div>
                <div class="msg-cnt">${msg}</div>
            </div>
            <div class="date">${dateCreated.getDate()}.${dateCreated.getMonth() + 1 < 10 ? '0' + (dateCreated.getMonth() + 1) : dateCreated.getMonth() + 1}.${dateCreated.getFullYear()}</div>
        </li>`;

        return result;
    }

    function templateSysItem(rename, text, date) {
        let dateCreated = new Date(date);

        let result = null;
        
        if (rename) {
            result = `
            <li class="list-msg__item list-msg__item--system">
                <span>@${text.oldName} переименовался в ${text.newName}</span>
            </li>`;
        } else {
            result = `
            <li class="list-msg__item list-msg__item--system">
                <span>к чату присоединился @${text.slice(8)}, ${dateCreated.getHours()}:${dateCreated.getMinutes() < 10 ? '0' + dateCreated.getMinutes() : dateCreated.getMinutes()}</span>
            </li>`;
        }

        return result;
    }

    function appendNewMsg(template) {
        messageBox.innerHTML += template
    }


    this.getHostName = () => host;
    this.getUserName = () => user;
    this.getChatName = () => chat;

    this.init = connect;
    this.sendMessage = sendMessage;
    this.setUserName = setUserName;
    this.setChatName = setChatName;
    this.exit = close;
}

export default Chat;