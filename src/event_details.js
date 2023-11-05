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
        this.data = args;

        const heading = document.createElement('h3');
        heading.textContent = `Details of event: ${args.event.name}, group: ${args.group.name}, user: ${args.user.name}`

        this.div.appendChild(heading);

        const backToEventButton = util.createButton({ id: 'backToUsersButton', text: 'back to users', styleClassName: 'outer' });
        this.div.appendChild(backToEventButton.div);
        backToEventButton.button.addEventListener('click', () => {
            this.change();
        })

        const status = util.createLabel({ id: 'statusLabel', text: 'no status', styleClassName: 'inner'});
        this.div.appendChild(status);

        const joinEventButton = util.createButton({ id: 'joinEventButton', text: 'join event', styleClassName: 'outer' });
        this.div.appendChild(joinEventButton.div);
        joinEventButton.button.addEventListener('click', () => {
            this.joinEvent()
                .then(res => {
                    if (res.Status && res.Status > 200) {
                        status.textContent = res.Message;
                    } else {
                        const myNode = document.getElementById('event_member_table');
                        while (myNode.lastElementChild) {
                            myNode.removeChild(myNode.lastElementChild);
                        }
                        this.updateEventMembers();
                    }
                });
        });

        const table = document.createElement('table');
        table.id = 'event_member_table';
        this.div.appendChild(table);

        this.updateEventMembers();
    }

    change(args) {
        this.stateMachine.setState('usersState');
    }

    async updateEventMembers() {
        const response = await fetch(`${util.getBaseUrl()}/events/members?eventId=${this.data.event.eventId}`, {
            method: 'GET',
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "x-auth": this.stateMachine.cache['auth'].token,
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
            eventId: this.data.event.eventId,
            memberId: this.data.user.userId,
            groupId: this.data.event.groupId,
            action: 'JOIN',
        };

        const result = await fetch(`${util.getBaseUrl()}/events/members`, {
            method: 'POST',
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "x-auth": this.stateMachine.cache['auth'].token,
            },
            body: JSON.stringify(data),
        });
    
        return result.json();
    }
}

module.exports = EventDetailState;