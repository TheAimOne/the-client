const util =  require('./util');
const State = require('./state');

class EventState extends State {
    constructor(div, stateMachine) {
        super();
        this.div = div;
        this.stateMachine = stateMachine;
        this.group = {};
    }

    init(args) {
        this.data = args;
        util.clearPage(this.div);

        const heading = document.createElement('h3');
        heading.textContent = `Details of group: ${args.groupId} user ${args.userId}`

        this.div.appendChild(heading);

        initializeUI(this.div);
        
        this.updateEvents(this.data.groupId, this.div);

        const table = document.createElement('table');
        table.id = 't1';

        this.div.appendChild(table);

        document.getElementById('createEvent').addEventListener('click', () => {

            console.log('clicking the button');
            this.postEvent().then(data => {
                const myNode = document.getElementById('t1');
                while (myNode.lastElementChild) {
                    myNode.removeChild(myNode.lastElementChild);
                }
                
                document.getElementById('statusLabel').textContent = 'created succesfully'

                this.updateEvents(this.data.groupId, this.div);
            });
        });
    }

    change(args) {
        args.userId = this.data.userId;
        args.groupId = this.data.groupId;
        this.stateMachine.setState('eventDetailsState', args);
    }

    async updateEvents(groupId, app) {
        const response = await fetch(`${util.getBaseUrl()}/groups/events?groupId=${groupId}`, {
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
                ['name', 'type', 'event_id'],
            )
    
            for (let i = 0; i < response.data.length; i++) {
                const element = response.data[i];
                const row = util.createTableRow([
                    element.name,
                    element.type,
                    element.eventId,
                ]);
                
                row.addEventListener('click', () => {
                    console.log('element.eventId', element.eventId);
                    this.change(element);
                });
    
                table.appendChild(row);
            }
    
            app.appendChild(table);
        }).catch(e => {
            const errorLabel = util.createLabel({id: 'errorLabel', text: 'Error getting events' });
            app.appendChild(errorLabel);
        });
    }

    async postEvent() {
        const name = document.getElementById('eventName').value;
        const type = document.getElementById('typeInput').value;
        const total = document.getElementById('totalInput').value;
        const standby = document.getElementById('standbyInput').value;
    
        const body = {
            groupId: this.data.groupId,
            creatorId: this.data.userId,
            name,
            type,
            params: {
                total,
                standby,
            }
        }
    
        const result = await fetch(`${util.getBaseUrl()}/events`, {
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

function initializeUI(element) {
    const button  = util.createButton({ id:'createEvent', text: 'create Event', styleClassName: 'outer'});
    
    const eventName = util.createLabelAndInput({
        label: { id:'eventNameLabel', text: 'event Name id: '},
        input: { id:'eventName', text: 'event Name id'},
    });
    
    const typeId = util.createLabelAndInput({
        label: { id:'typeLabel', text: 'type: '},
        input: { id:'typeInput', text: 'type'},
    });
    
    const totalId = util.createLabelAndInput({
        label: { id:'totalLabel', text: 'total: '},
        input: { id:'totalInput', text: 'total'},
    });
    
    const standby = util.createLabelAndInput({
        label: { id:'standbyLabel', text: 'standby: '},
        input: { id:'standbyInput', text: 'standby'},
    });
    
    const status = util.createLabel({ id: 'statusLabel', text: 'no status', styleClassName: 'inner'});
    
    element.appendChild(eventName);
    element.appendChild(typeId);
    element.appendChild(totalId);
    element.appendChild(standby);
    element.appendChild(button.div);
    element.appendChild(status);
}

module.exports = EventState;
