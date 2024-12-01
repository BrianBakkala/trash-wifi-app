import React, { useEffect } from 'react';
import { ActivityIndicator, View, Text, Pressable } from 'react-native';
import { useBLESetup } from '@particle/react-native-ble-setup-library';
import { INetwork } from '@particle/device-control-ble-setup-library';
import { Style } from '../styles';

export interface JoinWiFiArguments {
	onStartOver: () => void,
	selectedNetwork?: INetwork,
	wifiPassword?: string
}

// eslint-disable-next-line
export const JoinWiFi = ({ onStartOver, selectedNetwork, wifiPassword }: JoinWiFiArguments): React.ReactElement => {
	const { isJoiningWiFiNetwork, joinWiFiNetwork } = useBLESetup();

	useEffect(() => {
		if (!isJoiningWiFiNetwork && selectedNetwork) {
			joinWiFiNetwork(selectedNetwork, wifiPassword);
		}
	}, []);

	if (isJoiningWiFiNetwork) {
		return (
			<View style={Style.vertical}>
				<Text style={Style.indicatorIcons}>✓✓✓✓<ActivityIndicator size="large" color="#ffffff" /></Text>
				<Text style={Style.h2}>Joining: {selectedNetwork?.ssid} </Text>
			</View>
		);
	}

	return (
		<View style={Style.vertical}>
			<Text style={Style.h2}>Successfully joined {selectedNetwork?.ssid}!</Text>
			<View style={Style.nav}>
				<Pressable style={Style.button} onPress={onStartOver}>
				<Text style={Style.buttonIconSm}>←</Text><Text style={Style.buttonText}>Start over</Text>
				</Pressable>
			</View>
		</View>
	);
};
