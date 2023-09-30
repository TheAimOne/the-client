const util = require('./util');
const State = require('./state');

class EventDetailState extends State {
    constructor(div, stateMachine) {
        super();
        this.div = div;
        this.stateMachine = stateMachine;
    }

    init(args) {
        util.clearPage(this.div);
        this.eventDetails = args;

        const heading = document.createElement('h3');
        heading.textContent = `Details of event: ${args.eventId}, group: ${args.groupId}, user: ${args.userId}`

        this.div.appendChild(heading);

        console.log('dinga furrr', args);

        const backToEventButton = util.createButton({ id: 'backToEventButton', text: 'back to events', styleClassName: 'outer' });
        this.div.appendChild(backToEventButton.div);
        backToEventButton.button.addEventListener('click', () => {
            this.change();
        })

        const joinEventButton = util.createButton({ id: 'joinEventButton', text: 'join event', styleClassName: 'outer' });
        this.div.appendChild(joinEventButton.div);
        joinEventButton.button.addEventListener('click', () => {
            const myNode = document.getElementById('event_member_table');
            while (myNode.lastElementChild) {
                myNode.removeChild(myNode.lastElementChild);
            }
            this.joinEvent()
                .then(res => {
                    console.log('dinga hou', res);
                    this.updateEventMembers();
                });
        });

        const table = document.createElement('table');
        table.id = 'event_member_table';
        this.div.appendChild(table);

        this.updateEventMembers();
    }

    change(args) {
        this.stateMachine.setState('initialState');
    }

    async updateEventMembers() {
        const response = await fetch(`${util.getBaseUrl()}/events/members?eventId=${this.eventDetails.eventId}`, {
            method: 'GET',
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
        });

        response.json().then(response => {
            const table = document.getElementById('event_member_table');
            util.createTableHeading(
                table,
                ['member_id', 'action', 'name', 'status'],
            )

            for (let i = 0; i < response.data.length; i++) {
                const element = response.data[i];
                const row = util.createTableRow([
                    element.memberId,
                    element.action,
                    element.name,
                    element.status,
                ]);

                table.appendChild(row);
            }

        }).catch(e => {
            const errorLabel = util.createLabel({id: 'errorLabel', text: 'Error getting events' });
            app.appendChild(errorLabel);
        });
    }

    async joinEvent() {
        const data = {
            eventId: this.eventDetails.eventId,
            memberId: this.eventDetails.creatorId,
            groupId: this.eventDetails.groupId,
            action: 'JOIN',
        };

        const result = await fetch(`${util.getBaseUrl()}/events/members`, {
            method: 'POST',
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
    
        return result.json();
    }
}

module.exports = EventDetailState;