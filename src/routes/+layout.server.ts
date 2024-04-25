export const load = ({ session }) => {
	return {
		isUserLoggedIn: session !== null,
	};
}