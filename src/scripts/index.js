import Chat from './Chat';

(function() {
    // let ws = new WebSocket('ws://pm.tada.team' + "/ws?name=test123");
    let chatEl = document.getElementById('chat-one');
    // let changeNameBtn = document.getElementById('setNewName');
    // let changeNameInp = document.getElementById('newName');
    let sendNewMessageBtn = document.getElementById('sndBtn');
    let chatHeader = chatEl.querySelector('.chat-header');
    let chatFooter = chatEl.querySelector('.chat-footer');
    let newMessageInp = document.getElementById('input-msg');


    let chat = new Chat({
        box: chatEl.querySelector('.list-msg')
    })

    chat.init()



    

    // changeNameBtn.addEventListener('click', () => {
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
    chatHeader.addEventListener('click', ev => {

        if (ev.target.classList.contains('menu-list__item')) {
            if (ev.target.dataset.action === 'changeUserName') {
                let userName = chatHeader.querySelector('.chat-header__title .user-name');

                chatHeader.querySelector('.chat-header__settings .cbx').checked = false;
                userName.setAttribute('contenteditable', 'true');
                userName.focus();
                userName.classList.add('active');

                userName.addEventListener('keydown', preventEnter)
            }
        }
    })

    function preventEnter(event) {
        let userName = chatHeader.querySelector('.chat-header__title .user-name');



        if (event.key === 'Enter') {
            event.preventDefault();
            userName.blur();
            userName.removeAttribute('contenteditable');
            userName.classList.remove('active');
            chat.setUserName(userName.textContent)
        }

        if (event.key.length === 1 &&
            (event.key.charCodeAt() >= 97 && event.key.charCodeAt() <= 122 ||      // a-z
            event.key.charCodeAt() >= 65 && event.key.charCodeAt() <= 90 ||       // A-Z
            event.key.charCodeAt() >= 48 && event.key.charCodeAt() <= 57 ||       // 0-9
            event.key.charCodeAt() >= 1040 && event.key.charCodeAt() <= 1103 ||   // а-яА-Я
            event.key.charCodeAt() === 95))                                        // _
            {
                if (userName.textContent.length > 19) event.preventDefault()
            }

        // if (event.key.match(/^[a-zA-Z0-9а-яА-Я]+$/gi) && event.key.match()) { console.log(event.key)}
    }

    chatFooter.addEventListener('click', ev => {
        if (ev.target == newMessageInp || ev.target == newMessageInp.querySelector('[edit]')) {
            newMessageInp.classList.add('active')
            newMessageInp.querySelector('[edit]').setAttribute('contenteditable', 'true')
            newMessageInp.querySelector('[edit]').focus()
        }
        else if (ev.target == sendNewMessageBtn) {
            
            chat.sendMessage(newMessageInp.textContent)
        }
        console.log(ev.target)
    })
})()


