class StateMachine {
    constructor(app) {
        this.app = app;
        this.states = {};

        this.initialState = new GroupState(app, this);
        this.addState('initialState', this.initialState, true);
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

module.exports = StateMachine;
