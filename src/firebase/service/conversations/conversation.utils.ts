export const generateConversationID = ({
	guest_id,
	owner_id,
}: {
	guest_id: string
	owner_id: string
}): string => {
	return owner_id + '-and-' + guest_id
}
