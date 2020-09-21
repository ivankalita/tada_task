function Chat(options) {
    let messageBox = options.box || document.getElementById('msg-box');
    let host = options.host || 'pm.tada.team';
    let name = options.name || 'test123';
    let ws = new WebSocket(`ws://${host}/ws?name=${name}`);
    let history = [];
    let users = [];

    function connect(rename = null) {
        onMessage(rename)
    }

    function setUserName(newName) {
        if (!newName) {
            return
        }
        else {
            ws.close(1000, `${name} changed name to ${newName}`);
            ws = new WebSocket(`ws://${host}/ws?name=${newName}`);

            connect({
                oldName: name,
                newName
            });

            name = newName
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
    
            console.log('message:', data);
    
            if (data.typing === true) {
                return
            }
    
            if (data.name !== undefined) {
                listItemMsg = templateMsgItem(data.name, data.text, data.created);
            } else {
                if (rename) listItemMsg = templateSysItem(true, rename, data.created);
                else listItemMsg = templateSysItem(false, data.text, data.created);
            }

            appendNewMsg(listItemMsg)
        };
    }

    function templateMsgItem(user, msg, date) {
        let dateCreated = new Date(date);

        let result = `
        <li class="list-msg__item">
            <div class="ava">
                <img src="https://api.adorable.io/avatars/50/abott@adorable.png" class="image">
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
                <span>к чату присоединился @${text.slice(8)}, ${dateCreated.getHours()}:${dateCreated.getMinutes()}</span>
            </li>`;
        }

        return result;
    }

    function appendNewMsg(template) {
        messageBox.innerHTML += template
    }


    this.getHost = () => host;
    this.getName = () => name;

    this.init = connect;
    this.sendMessage = sendMessage;
    this.setUserName = setUserName;
}

export default Chat;