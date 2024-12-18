import React from 'react';
import { Modal, View, Text } from 'react-native';
import { Style } from '../styles';
import { BareButton } from '../util/utility';

export interface ErrorModalArguments
{
	visible: boolean,
	error?: Error,
	onClose: () => void
}

// eslint-disable-next-line
export const ErrorModal = ({ visible, error, onClose }: ErrorModalArguments): React.ReactElement =>
{
	return (<Modal
		animationType="fade"
		transparent={true}
		visible={visible}
		onRequestClose={onClose}
	>
		<View style={Style.modalBackground}>
			<View style={Style.modal}>
				<Text style={Style.h2}>{error?.name}</Text>
				<Text style={Style.modalBody}>{error?.message}Please try again.</Text>
				<BareButton
					onPress={onClose}
					text="Dismiss"
				/>
			</View>
		</View>
	</Modal>);
}; 
