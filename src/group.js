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
        heading.textContent = `Details of user: ${args.userId}`

        this.div.appendChild(heading);
        
        this.initializeUI();

        const table = document.createElement('table');
        table.id = 't1';

        this.div.appendChild(table);

        document.getElementById('createGroup').addEventListener('click', () => {
        });

        this.getGroups();
    }

    change(args) {
        args.userId = this.user.userId;
        this.stateMachine.setState('eventState', args);
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
    
            this.div.appendChild(table);
        }).catch(e => {
            const errorLabel = util.createLabel({id: 'errorLabel', text: 'Error getting events' });
            this.div.appendChild(errorLabel);
        });
    }
};

module.exports = Group;
