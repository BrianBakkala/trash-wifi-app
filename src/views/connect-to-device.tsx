import React, { useEffect } from 'react';
import { ActivityIndicator, View, Text, Pressable } from 'react-native';
import { useBLESetup, ConnectionStatus } from '@particle/react-native-ble-setup-library';
import { Style } from '../styles';

export interface ConnectToDeviceArguments {
	mobileSecret: string,
	setupCode: string,
	onBack: () => void,
	onContinue: () => void
}

// eslint-disable-next-line
export const ConnectToDevice = ({ mobileSecret, setupCode, onBack, onContinue }: ConnectToDeviceArguments): React.ReactElement => {
	const { device, connectionStatus, connect } = useBLESetup();

	useEffect(() => {
		if (!device) {
			onBack();
		}
	}, [device]);

	useEffect(() => {
		if (connectionStatus === ConnectionStatus.Disconnected) {
			connect(mobileSecret);
		}
	}, []);


	if (!device) {
		return (
			<View style={Style.vertical}>
				<Text style={Style.emoji}>🤔️</Text>
				<Text style={Style.h2}>No device selected</Text>
				<View style={Style.nav}>
					<Pressable style={Style.button} onPress={onBack}>
						<Text style={Style.buttonText}>Back</Text>
					</Pressable>
				</View>
			</View>
		);
	}

	if (connectionStatus === ConnectionStatus.Disconnected) {
		return (
			<View style={Style.vertical}>
				<Text style={Style.emoji}></Text>
				<Text style={Style.h2}>Device disconnected</Text>
				<View style={Style.nav}>
					<Pressable style={Style.button} onPress={onBack}>
						<Text style={Style.buttonText}>Back</Text>
					</Pressable>
				</View>
			</View>
		);
	}

	if (connectionStatus === ConnectionStatus.Connecting) {
		return (
			<View style={Style.vertical}>
				<Text style={Style.indicatorIcons}>✓<ActivityIndicator size="large" color="#ffffff" /></Text>
				<Text style={Style.h2}>Connecting to Bindicator {setupCode}...</Text>
			</View>
		);
	}

	return (
		<View style={Style.vertical}>
			<Text style={Style.indicatorIcons}>✓✓</Text>
			<Text style={Style.h2}>Connected to Bindicator {setupCode}!</Text>
			<View>
				<Pressable style={Style.button} onPress={onContinue}>
					<Text style={Style.buttonText}>Continue</Text>
				</Pressable>
			</View>
			<View style={Style.nav}>
				<Pressable style={Style.button} onPress={onBack}>
					<Text style={Style.buttonText}>Back</Text>
				</Pressable>
			</View>
		</View>
	);
};
