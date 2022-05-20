

const initialState = {
    properties: [],
    loading: false,
	pending_agents: []
}

const AgentReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case 'SET_AGENT_STATE':
			return { ...state, ...payload }

		default:
			return state
	}
}

export default AgentReducer;
