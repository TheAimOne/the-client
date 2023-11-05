const util =  require('./util');
const State = require('./state');

class UserState extends State {
    constructor(div, stateMachine) {
        super();
        this.div = div;
        this.stateMachine = stateMachine;
    }

    init(args) {
        util.clearPage(this.div);

        this.initializeUI();

        const table = document.createElement('table');
        table.id = 't1';

        this.div.appendChild(table);

        document.getElementById('createUser').addEventListener('click', () => {
            this.createUser().then(data => {
                const myNode = document.getElementById('t1');
                while (myNode.lastElementChild) {
                    myNode.removeChild(myNode.lastElementChild);
                }
                
                document.getElementById('statusLabel').textContent = 'created succesfully'
                this.getUsers();
            });
            
        });

        this.getUsers();
    }

    change(args) {
        this.stateMachine.setState('groupState', args);
    }

    initializeUI() {
        const button  = util.createButton({ id:'createUser', text: 'create user', styleClassName: 'outer'});

        const userName = util.createLabelAndInput({
            label: { id:'userNameLabel', text: 'user name: '},
            input: { id:'userName', text: 'user name'},
        });

        const shortName = util.createLabelAndInput({
            label: { id:'shortNameLabel', text: 'short name: '},
            input: { id:'shortName', text: 'short name'},
        });

        const email = util.createLabelAndInput({
            label: { id:'emailLabel', text: 'email: '},
            input: { id:'email', text: 'email id'},
        });

        const mobile = util.createLabelAndInput({
            label: { id:'mobileLabel', text: 'mobile: '},
            input: { id:'mobile', text: 'mobile'},
        });

        const status = util.createLabel({ id: 'statusLabel', text: 'no status', styleClassName: 'inner'});

        this.div.appendChild(userName);
        this.div.appendChild(shortName);
        this.div.appendChild(email);
        this.div.appendChild(mobile);
        this.div.appendChild(button.div);
        this.div.appendChild(status);
    }

    async createUser() {
        const userName = document.getElementById('userName').value;
        const shortName = document.getElementById('shortName').value;
        const email = document.getElementById('email').value;
        const mobile = document.getElementById('mobile').value;
    
        const body = {
            name: userName,
            shortName,
            email,
            mobile,
        }

        const result = await fetch(`${util.getBaseUrl()}/user`, {
            method: 'POST',
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
    
        return result.json();
    }

    async getUsers() {
        console.log("furrr", this.stateMachine.cache['auth']);
        const response = await fetch(`${util.getBaseUrl()}/users`, {
            method: 'GET',
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "x-auth": this.stateMachine.cache['auth'].token,
            },
        });

        response.json().then(response => {
            const table = document.getElementById('t1');
            util.createTableHeading(
                table,
                ['user id', 'name', 'short name'],
            )
    
            for (let i = 0; i < response.data.length; i++) {
                const element = response.data[i];
                const row = util.createTableRow([
                    element.userId,
                    element.name,
                    element.shortName,
                ]);
                
                row.addEventListener('click', () => {
                    console.log('element.userId', element.userId);
                    this.change(element);
                });
    
                table.appendChild(row);
            }
    
            this.div.appendChild(table);
        }).catch(e => {
            const errorLabel = util.createLabel({id: 'errorLabel', text: 'Error getting events' });
            this.div.appendChild(errorLabel);
        });
    }
}

module.exports = UserState;
