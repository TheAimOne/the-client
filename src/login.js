const util =  require('./util');
const State = require('./state');

class LoginState extends State {
    constructor(div, stateMachine) {
        super();
        this.div = div;
        this.stateMachine = stateMachine;
    }

    init(args) {
        util.clearPage(this.div);

        this.initializeUI();

        document.getElementById('authenticate').addEventListener('click', () => {
            this.authenticate().then(e => {
                if (!e.data) {
                    const errorLabel = util.createLabel({id: 'errorLabel', text: 'Error authenticating' });
                    this.div.appendChild(errorLabel);
                } else {
                    this.stateMachine.cache['auth'] = e.data;
                    console.log('dainga ', e.data);
                    this.change();
                }
            });
        });
    }

    change(args) {
        this.stateMachine.setState('usersState', args);
    }

    initializeUI() {
        const button  = util.createButton({ id:'authenticate', text: 'Authenticate', styleClassName: 'outer'});

        const userId = util.createLabelAndInput({
            label: { id:'userIdLabel', text: 'user id: '},
            input: { id:'userId', text: 'user Id'},
        });

        const password = util.createLabelAndInput({
            label: { id:'passwordLabel', text: 'password: '},
            input: { id:'password', text: 'password', type: 'password' },
        });

        this.div.appendChild(userId);
        this.div.appendChild(password);
        this.div.appendChild(button.div);
    }

    async authenticate() {
        const userId = document.getElementById('userId').value;
        const password = document.getElementById('password').value;
 
        const body = {
            userId,
            password,
            type: 'email'
        }

        const result = await fetch(`${util.getBaseUrl()}/user/authenticate`, {
            method: 'POST',
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        return result.json();
    }
}

module.exports = LoginState;
