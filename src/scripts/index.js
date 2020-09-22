import Chat from './Chat';
import Faces from '../faces.json';

(function() {
    let lobbyEl = document.getElementById('lobby-one');
    let lobbyCardName = lobbyEl.querySelector('.lobby-card--name');
    let lobbyCardAva = lobbyEl.querySelector('.lobby-card--ava');
    let avaImage = document.getElementById('ava-image');
    let chatEl = document.getElementById('chat-one');
    let sendNewMessageBtn = document.getElementById('sndBtn');
    let chatHeader = chatEl.querySelector('.chat-header');
    let chatFooter = chatEl.querySelector('.chat-footer');
    let newMessageInp = document.getElementById('input-msg');

    let chat = null;
    let userName = 'test123';

    // проверим localStorage на сохраненный вход
    if (localStorage.getItem('chatUserName')) {
        chat = new Chat({
            user: localStorage.getItem('chatUserName'),
            userAva: localStorage.getItem('chatUserAva'),
            box: chatEl.querySelector('.list-msg'),
            el: document.getElementById('chat-one')
        })

        chat.init(null, true)
        lobbyEl.classList.remove('show')
        lobbyCardName.classList.remove('current')
        chatEl.classList.add('show')
    }

    lobbyCardName.querySelector('[lobby-next]').addEventListener('click', () => {
        if (lobbyCardName.querySelector('.inp').value.trim().length !== 0 && !lobbyCardName.querySelector('.inp').value.trim().match(/[^a-zA-Z0-9а-яА-Я_]+/g)) {
            userName = lobbyCardName.querySelector('.inp').value.trim();
            lobbyCardName.querySelector('.inp-error').classList.remove('show')
            lobbyCardName.classList.remove('current')
            lobbyCardAva.classList.add('current')
        } else if (lobbyCardName.querySelector('.inp').value.trim().match(/[^a-zA-Z0-9а-яА-Я_]+/g)) {
            lobbyCardName.querySelector('.inp-error').textContent = 'Только буквы, цифры и _';
            lobbyCardName.querySelector('.inp-error').classList.add('show')
        }
        else {
            lobbyCardName.querySelector('.inp-error').textContent = 'Нельзя оставить пустым';
            lobbyCardName.querySelector('.inp-error').classList.add('show')
        }
    })

    lobbyCardName.querySelector('.inp').addEventListener('input', ev => {
        if (ev.target.value.trim().length > 20) {
            ev.target.value = userName;
            lobbyCardName.querySelector('.inp-error').textContent = 'Не более 20 символов';
            lobbyCardName.querySelector('.inp-error').classList.add('show')
        } else if (ev.data && ev.data.match(/^[^a-zA-Z0-9а-яА-Я_]+$/g)) {
            lobbyCardName.querySelector('.inp-error').textContent = 'Только буквы, цифры и _';
            lobbyCardName.querySelector('.inp-error').classList.add('show')
        } else {
            userName = ev.target.value;
            lobbyCardName.querySelector('.inp-error').classList.remove('show')
        }
    })

    lobbyCardAva.addEventListener('click', ev => {
        if (ev.target == lobbyCardAva.querySelector('[lobby-prev]')) {
            lobbyCardAva.classList.remove('current')
            lobbyCardName.classList.add('current')
        } else if (ev.target == lobbyCardAva.querySelector('[lobby-accept]')) {
            chat = new Chat({
                user: userName,
                userAva: avaImage.src.replace('/100', '/50'),
                box: chatEl.querySelector('.list-msg'),
                el: document.getElementById('chat-one')
            })
        
            chat.init()
            lobbyCardAva.classList.add('done')
            chatEl.classList.add('show')
            lobbyEl.classList.remove('show')

        }
    })

    let eyeCurrent = 0;
    let noseCurrent = 0;
    let mouthCurrent = 0;
    let colorCurrent = 0;

    lobbyCardAva.querySelectorAll('.ava-creator .item').forEach(item => {
        item.addEventListener('click', function(ev) {
            if (this.parentElement.classList.contains('ava-creator__prev')) {
                if (this.dataset.cntrl === 'eyes' && eyeCurrent !== 0) {
                    eyeCurrent--
                }
                if (this.dataset.cntrl === 'nose' && noseCurrent !== 0) {
                    noseCurrent--
                }
                if (this.dataset.cntrl === 'mouth' && mouthCurrent !== 0) {
                    mouthCurrent--
                }
                loadNewAvaImage()
            }
            if (this.parentElement.classList.contains('ava-creator__next')) {
                if (this.dataset.cntrl === 'eyes' && eyeCurrent < Faces.face.eyes.length - 1) {
                    eyeCurrent++
                }
                if (this.dataset.cntrl === 'nose' && noseCurrent < Faces.face.nose.length - 1) {
                    noseCurrent++
                }
                if (this.dataset.cntrl === 'mouth' && mouthCurrent < Faces.face.mouth.length - 1) {
                    mouthCurrent++
                }
                loadNewAvaImage()
            }
        })
    })

    lobbyCardAva.querySelectorAll('.clr-picker__item').forEach(picker => {
        picker.addEventListener('click', function(ev) {
            if (!this.classList.contains('selected')) {
                Array.from(this.parentElement.children).forEach(chld => chld.classList.contains('selected') ? chld.classList.remove('selected') : false)
                this.classList.add('selected')
                Faces.face.colors.forEach((item, index) => item.slug === this.dataset.clr ? colorCurrent = index : false);
                loadNewAvaImage()
            }
        })
    })

    function loadNewAvaImage() {
        avaImage.src = `https://api.adorable.io/avatars/face/${Faces.face.eyes[eyeCurrent]}/${Faces.face.nose[noseCurrent]}/${Faces.face.mouth[mouthCurrent]}/${Faces.face.colors[colorCurrent].value}/100`;
    }

    chatHeader.addEventListener('click', ev => {

        if (ev.target.classList.contains('menu-list__item')) {
            if (ev.target.dataset.action === 'changeUserName') {
                let userName = chatHeader.querySelector('.chat-header__title .user-name');

                chatHeader.querySelector('.chat-header__settings .cbx').checked = false;
                userName.setAttribute('contenteditable', 'true');
                userName.focus();
                userName.classList.add('active');

                userName.addEventListener('keydown', preventEnter)
            } else if (ev.target.dataset.action === 'changeChatName') {
                let chatName = chatHeader.querySelector('.chat-header__title .chat-name');

                chatHeader.querySelector('.chat-header__settings .cbx').checked = false;
                chatName.setAttribute('contenteditable', 'true');
                chatName.focus();
                chatName.classList.add('active');

                chatName.addEventListener('keydown', preventEnter)
            } else if (ev.target.dataset.action === 'exit') {
                chat.exit();
                chatEl.classList.remove('show')
                lobbyEl.classList.add('show')
                lobbyCardName.classList.add('current')
                lobbyCardAva.classList.remove('current', 'done')
            }
        }

        function preventEnter(event) {
            let editField = null;

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
                    chat.setUserName(editField.textContent)
                } else if (ev.target.dataset.action === 'changeChatName') {
                    chat.setChatName(editField.textContent)
                }
            }
    
            if (event.key.length === 1 &&
                (event.key.charCodeAt() >= 97 && event.key.charCodeAt() <= 122 ||      // a-z
                event.key.charCodeAt() >= 65 && event.key.charCodeAt() <= 90 ||       // A-Z
                event.key.charCodeAt() >= 48 && event.key.charCodeAt() <= 57 ||       // 0-9
                event.key.charCodeAt() >= 1040 && event.key.charCodeAt() <= 1103 ||   // а-яА-Я
                event.key.charCodeAt() === 95))                                        // _
                {
                    if (editField.textContent.length > 19) event.preventDefault()
                }
    
            // if (event.key.match(/^[a-zA-Z0-9а-яА-Я]+$/gi) && event.key.match()) { console.log(event.key)}
        }


    })

    chatFooter.addEventListener('click', ev => {
        if (ev.target == newMessageInp) {
            newMessageInp.classList.add('active')
        }
        else if (ev.target == sendNewMessageBtn && newMessageInp.value.trim() !== '') {
            console.dir(newMessageInp)
            chat.sendMessage(newMessageInp.value.trim())
            newMessageInp.classList.remove('active')
            newMessageInp.blur()
            newMessageInp.value = '';
        }
    })
})()


