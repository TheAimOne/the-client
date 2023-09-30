const UserState = require('./src/user');
const GroupState = require('./src/group');
const EventState = require('./src/event');
const EventDetailsState = require('./src/event_details');

class StateMachine {
    constructor(app) {
        this.app = app;
        this.states = {};

        this.initialState = new UserState(app, this);
        this.addState('initialState', this.initialState);
        this.addState('groupState', new GroupState(app, this));
        this.addState('eventState', new EventState(app, this))
        this.addState('eventDetailsState', new EventDetailsState(app, this))
        this.state = this.initialState;
    }

    addState(stateName, state, isFirst) {
        this.states[stateName] = {
            state,
            isFirst,
        }
    }

    setState(stateName, args) {
        this.state = this.states[stateName].state;
        this.state.init(args);
    }

    init(args) {
        this.state.init(args);
    }

    change(args) {
        this.state.change(args);
    }
}

const sm = new StateMachine(document.getElementById('app'));
sm.init();
