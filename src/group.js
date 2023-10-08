const util =  require('./util');
const State = require('./state');

const memberId = '8fd11aa0-5234-42a9-9095-637cb7dff592';

class Group extends State {
    constructor(div, stateMachine) {
        super();
        this.div = div;
        this.stateMachine = stateMachine;
        this.user = {};
    }

    init(args) {
        // recieves the user
        this.user = args;

        util.clearPage(this.div);

        const heading = document.createElement('h3');
        heading.textContent = `Details of user: ${args.name}`

        this.div.appendChild(heading);
        
        this.initializeUI();

        const table = document.createElement('table');
        table.id = 't1';

        const headingT1 = document.createElement('h4');
        headingT1.textContent = `My Groups`

        this.div.appendChild(headingT1);
        this.div.appendChild(table);


        const table2 = document.createElement('table');
        table2.id = 't2';

        const headingT2 = document.createElement('h4');
        headingT2.textContent = `Other Groups`

        this.div.appendChild(headingT2);
        this.div.appendChild(table2);

        document.getElementById('createGroup').addEventListener('click', () => {
            this.createGroup().then(data => {
                const myNode = document.getElementById('t1');
                while (myNode.lastElementChild) {
                    myNode.removeChild(myNode.lastElementChild);
                }
                
                document.getElementById('statusLabel').textContent = 'created succesfully'
                this.getGroups();
            });
        });

        this.getGroups();
        this.getOtherGroups();
    }

    change(group) {
        const data = {user: this.user, group}
        this.stateMachine.setState('eventState', data);
    }

    initializeUI() {
        const button  = util.createButton({ id:'createGroup', text: 'create group', styleClassName: 'outer'});

        const groupName = util.createLabelAndInput({
            label: { id:'groupNameLabel', text: 'group name: '},
            input: { id:'groupName', text: 'group name'},
        });

        const description = util.createLabelAndInput({
            label: { id:'descriptionLabel', text: 'description: '},
            input: { id:'description', text: 'description Name'},
        });

        const size = util.createLabelAndInput({
            label: { id:'sizeLabel', text: 'size: '},
            input: { id:'size', text: 'size id'},
        });

        const status = util.createLabel({ id: 'statusLabel', text: 'no status', styleClassName: 'inner'});

        this.div.appendChild(groupName);
        this.div.appendChild(description);
        this.div.appendChild(size);
        this.div.appendChild(button.div);
        this.div.appendChild(status);
    }

    async getGroups() {
        const response = await fetch(`${util.getBaseUrl()}/member/group?memberId=${this.user.userId}`, {
            method: 'GET',
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
        });

        
        response.json().then(response => {
            const table = document.getElementById('t1');
            while (table.lastElementChild) {
                table.removeChild(table.lastElementChild);
            }
            util.createTableHeading(
                table,
                ['group_id', 'name', 'description'],
            )
    
            for (let i = 0; i < response.data.length; i++) {
                const element = response.data[i];
                const row = util.createTableRow([
                    element.groupId,
                    element.name,
                    element.description,
                ]);
                
                row.addEventListener('click', () => {
                    console.log('element.groupId', element.groupId);
                    this.change(element);
                });
    
                table.appendChild(row);
            }
        }).catch(e => {
            const errorLabel = util.createLabel({id: 'errorLabel', text: 'Error getting events' });
            this.div.appendChild(errorLabel);
        });
    }

    async getOtherGroups() {
        const response = await fetch(`${util.getBaseUrl()}/groups`, {
            method: 'GET',
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
        });

        response.json().then(response => {
            const table = document.getElementById('t2');
            util.createTableHeading(
                table,
                ['group id', 'name', 'description', 'join'],
            )
    
            for (let i = 0; i < response.data.length; i++) {
                const element = response.data[i];
                const row = util.createTableRow([
                    element.groupId,
                    element.name,
                    element.description,
                ]);

                const joinButton  = util.createButton({ id:'createEvent', text: 'join', styleClassName: 'outer'});
                const td = document.createElement('td');
                td.appendChild(joinButton.div);
                row.appendChild(td);

                joinButton.button.addEventListener('click', () => {
                    this.joinGroup(element.groupId).then(data => {
                        if (data.Status && data.Status > 200) {
                            document.getElementById('statusLabel').textContent = data.Message;
                        } else {
                            this.getGroups();
                        }
                        
                    }).catch(e => {
                        console.log('error while parsing response',e);
                    });
                });
                    
                table.appendChild(row);
            }
    
            // this.div.appendChild(table);
        }).catch(e => {
            const errorLabel = util.createLabel({id: 'errorLabel', text: 'Error getting events' });
            this.div.appendChild(errorLabel);
        });
    }

    async createGroup() {
        const name = document.getElementById('groupName').value;
        const description = document.getElementById('description').value;
        const size = document.getElementById('size').value;

        const body = {
            groupInfo: {
                name,
                description,
                size: parseInt(size),
            },
            members: [
                {
                    memberId: this.user.userId,
                }
            ]
        }
    
        const result = await fetch(`${util.getBaseUrl()}/group`, {
            method: 'POST',
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
    
        return result.json();
    }

    async joinGroup(groupId) {
        const body = {
            groupId,
            members: [
                {
                    memberId: this.user.userId,
                }
            ]
        }
    
        const result = await fetch(`${util.getBaseUrl()}/group/members`, {
            method: 'POST',
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        return result.json();
    }
};

module.exports = Group;
