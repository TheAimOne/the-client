const util = require('./util');

class MessageHandler {

    constructor(args) {
        this.data = args[0];
        this.eventId = this.data.event.eventId;
        this.groupId = this.data.group.groupId;
        this.name = this.data.user.name;

        this.auth = args[1];

        const chatDiv = document.getElementById('chat');
        const div = document.createElement('div');
        div.id = 'scroll-div';
        chatDiv.append(div);
        div.className = 'scroll';

        const input = util.createInput({ id: 'chatInput', text: 'type message'});
        input.div.className = 'todo';
        chatDiv.append(input.div);

        const sendButton = util.createButton({id: 'sendMsg', text: 'send'});
        chatDiv.append(sendButton.div);

        sendButton.button.addEventListener('click', () => {
            console.log('send message dinga.....');
            this.isSendingMessage = true;
            this.sendMessage().then(res => {
                const message = document.getElementById('chatInput').value;
                console.log('chat input', message);
                console.log('user...', this.name);

                const date = new Date();
                let time = date.getTime();
                
                const m = {
                    content: message,
                    name: this.name,
                    createTime: time,
                };

                const d = this.createChatMessage(m, 0);
                this.scrollDiv.append(d);

                document.getElementById('chatInput').value = '';
                this.scrollDiv.scrollTop = this.scrollDiv.scrollHeight;
                this.isSendingMessage = false;
                this.offset += 1;
            });
        });

        this.chatDiv = chatDiv;
        this.scrollDiv = div;
        this.offset = 0;

        setInterval(() => {
            this.loadChat()
                .then(res => {
                    if (res.Status && res.Status > 200) {
                        //status.textContent = res.Message;
                    } else {
                        if (!this.isSendingMessage) {
                            this.appendChatMessage(res);
                        }
                    }
                });
        }, 1000);
    }

    appendChatMessage(data) {
        this.offset += data.message.length;

        let j = 0;
        for (let i = 0; i < data.message.length; i++) {
            const m = data.message[i];

            const d = this.createChatMessage(m, j);

            this.scrollDiv.append(d);
            j++;
        }

        this.scrollDiv.scrollTop = this.scrollDiv.scrollHeight;
    }


    createChatMessage(m, j) {
        const d = document.createElement('div');
        d.className = j%2 == 0 ? 'container': 'container darker';

        const p = document.createElement('p');
        p.textContent = `${m.name} :: ${m.content}`;

        const span = document.createElement('span');
        span.className = j%2 == 0 ? 'time-left': 'time-right';
        span.textContent = m.createTime;

        d.append(p);
        d.append(span);
        
        return d;
    }

    async loadChat() {
        const eventId = this.eventId;
        const offset = this.offset || 0;

        const result = await fetch(`${util.getBaseUrl()}/groups/events/messages?eventId=${eventId}&offset=${offset}`, {
            method: 'GET',
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "x-auth": this.auth,
            },
        });
    
        return result.json();
    }

    async sendMessage() {
        const message = document.getElementById('chatInput').value;
        const eventId = this.eventId;
        const groupId = this.groupId;
        const name = this.name;

        console.log('dasd', message);
        console.log('dasd', eventId);
        console.log('dasd', groupId);
        console.log('dasd', name);

        const data = {
            eventId: eventId,
            groupId: groupId,
            memberId: this.data.user.userId,
            name: name,
            content: message,
        }

        const result = await fetch(`${util.getBaseUrl()}/groups/events/messages`, {
            method: 'POST',
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "x-auth": this.auth,
            },
            body: JSON.stringify(data),
        });

        return result.json();
    }
}

module.exports = MessageHandler;
