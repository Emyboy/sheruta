const initialState = {
	sideNav: false,
	notification: false,
	message: false,
	categories: [],
	services: [],
	amenities: [],
	status: [],
	states: [],
	subscriptions: [],
	paymentTypes: [],
	notifications: [],
	blog_categories: []
}

const ViewReducer =  (state = initialState, { type, payload }) => {
    switch (type) {

    case 'SET_VIEW_STATE':
        return { ...state, ...payload }

    default:
        return state
    }
}
export default ViewReducer