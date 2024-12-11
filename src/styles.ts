import { StyleSheet } from 'react-native';

export const Style = StyleSheet.create({
	centered: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20
	},

	vertical: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column',
		width: '100%',
		backgroundColor: 'black',
		color: 'white'
	},



	modalBackground: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)'
	},
	modal: {
		margin: 20,
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 35,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
		width: '90%'
	},
	modalBody: {
		marginBottom: 20,
		textAlign: 'center'
	},




	nav: {
		bottom: 20,
		position: 'absolute',
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',
		flexDirection: 'row',
		width: '100%'

	},

	navSpace: {
		bottom: 20,
		position: 'absolute',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		width: '100%'

	},

	navCenter: {
		bottom: 20,
		position: 'absolute',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		width: '100%'

	},
	navLeft: {
		bottom: 20,
		position: 'absolute',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',

		padding: 20,
		width: '100%'
	},
	navRight: {
		bottom: 20,
		position: 'absolute',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',

		padding: 20,
		width: '100%'
	},





	button: {
		display: 'flex',
		flexDirection: 'row',
		gap: 10,
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 12,
		marginHorizontal: 8,
		paddingHorizontal: 20,
		borderRadius: 50,
		elevation: 3,
		backgroundColor: '#0090b0',
		color: 'white'
	},
	buttonSecondary: {
		display: 'flex',
		flexDirection: 'row',
		gap: 10,
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 12,
		marginHorizontal: 8,
		paddingHorizontal: 20,
		elevation: 3,
		backgroundColor: 'transparent',
		color: 'white'
	},
	buttonIcon: {
		fontSize: 35,
		lineHeight: 30,
		color: 'white'
	},
	buttonIconLg: {
		fontSize: 30,
		color: 'white'
	},
	buttonIconMd: {
		fontSize: 25,
		lineHeight: 30,
		color: 'white'
	},
	buttonIconSm: {
		fontSize: 20,
		lineHeight: 30,
		color: 'white'
	},
	buttonDisabled: {
		display: 'flex',
		flexDirection: 'row',
		gap: 10,
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 12,
		paddingHorizontal: 20,
		marginHorizontal: 8,
		borderRadius: 50,
		elevation: 3,
		backgroundColor: '#ccc',
		color: 'white'
	},
	buttonText: {
		fontSize: 16,
		lineHeight: 21,
		fontWeight: 'bold',
		letterSpacing: 0.25,
		color: 'white',
	},


	toggleVisibilityButton: {
		display: 'flex',
		flexDirection: 'row',
		gap: 10,
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 12,
		paddingHorizontal: 16,
		marginHorizontal: 8,
		borderRadius: 4,
		elevation: 3,
		backgroundColor: 'transparent',
		color: 'white'
	},



	visibilityIcon: {
		width: 33,
		height: 20,
	},





	input: {
		height: 40,
		width: 200,
		marginBottom: 20,
		borderWidth: 1,
		borderRadius: 4,
		padding: 10,
		color: 'white',
		borderColor: 'white',
	},




	inputNoMargin: {
		height: 40,
		width: 200,
		borderWidth: 1,
		borderRadius: 4,
		padding: 10,
		color: 'white',
		borderColor: 'white',
	},




	paragraph: {
		color: 'white',
		marginBottom: 30,
		marginTop: 30,

	},
	headerParagraph: {
		color: 'white',
		marginBottom: 30,
	},


	label: {
		color: 'white',
	},
	h2: {
		color: 'white',
		fontSize: 22,
		lineHeight: 30,
		marginTop: 20,
		fontWeight: 'bold',
		marginBottom: 20,
	},




	simpleFlexRow: {
		display: 'flex',
		flexDirection: 'row',
		gap: 5,
		justifyContent: 'center',
		alignItems: 'center',
	},





	emoji: {
		fontSize: 96,
		marginBottom: 20
	},



	list: {
		flex: 1,
		alignSelf: 'stretch',
		margin: 20,
		marginBottom: 85,
		color: 'white'
	},
	listItem: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 10,
		fontSize: 18,
		color: 'white'
	},
	listItemSelected: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 10,
		fontSize: 18,
		borderRadius: 4,
		backgroundColor: '#005c70',
		color: 'white',
	},
	listItemText: {
		color: 'white'
	},

	bList: {
		display: 'flex',
		flexDirection: 'column',
		gap: 20,
		alignContent: 'center',
		justifyContent: 'center',
	},
	bListItem: {
		display: 'flex',
		flexDirection: 'row',
		gap: 10,
		alignItems: 'center',
		color: 'white',
		borderRadius: 4,
		padding: 10,
		backgroundColor: '#222222'
	},

	bListItemText: {
		color: 'white',
	},



	displayNone: {
		display: 'none'
	},
	mainBBBBBImage: {
		height: 100,
		margin: 10,
		resizeMode: 'contain'
	},
	smallBBBBBImage: {
		height: 30,
		width: 30,
		resizeMode: 'contain'
	},

	error: {
		color: 'red'
	},

});
