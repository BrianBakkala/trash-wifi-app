import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text, Pressable } from 'react-native';
import { useBLESetup } from '@particle/react-native-ble-setup-library';
import { INetwork } from '@particle/device-control-ble-setup-library';
import { Style } from '../styles';
import { ProgressDiagram, apiFetch, createVerificationKey } from '../util/utility';

export interface JoinWiFiArguments
{
	deviceUUID: string,
	setupCode: string,
	onStartOver: () => void,
	selectedNetwork?: INetwork,
	wifiPassword?: string
}

export const JoinWiFi = ({ deviceUUID, setupCode, onStartOver, selectedNetwork, wifiPassword }: JoinWiFiArguments): React.ReactElement =>
{
	const { isJoiningWiFiNetwork, joinWiFiNetwork } = useBLESetup();
	const [hasJoined, setHasJoined] = useState(false);
	const [responseData, setResponseData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() =>
	{
		// Trigger WiFi join process when the component is mounted
		if (!isJoiningWiFiNetwork && selectedNetwork)
		{
			joinWiFiNetwork(selectedNetwork, wifiPassword);
		}
	}, [selectedNetwork, wifiPassword]);

	useEffect(() =>
	{
		// Check if the connection process is completed and call a function ONCE
		if (!isJoiningWiFiNetwork && selectedNetwork && !hasJoined)
		{
			setHasJoined(true);

			console.log("#", "Initiating fetch...")

			apiFetch(
				'post-provision',
				{
					device_uuid: deviceUUID,
					verification_key: createVerificationKey(selectedNetwork.ssid, setupCode),
				},
				setResponseData,
				setLoading,
				setError
			);
		}
	}, [isJoiningWiFiNetwork, selectedNetwork, hasJoined]);

	if (isJoiningWiFiNetwork)
	{
		return (
			<View style={Style.vertical}>
				<ProgressDiagram showLoader={true} numChecks={4} />
				<Text style={Style.h2}>Joining: {selectedNetwork?.ssid} </Text>
			</View>
		);
	}

	return (
		<View style={Style.vertical}>
			<ProgressDiagram numChecks={5} />
			<Text style={Style.h2}>Successfully joined {selectedNetwork?.ssid}!</Text>
			<Text style={Style.paragraph}>!{JSON.stringify(responseData)}!</Text>
			<View style={Style.nav}>
				<Pressable style={Style.buttonSecondary} onPress={onStartOver}>
					<Text style={Style.buttonIconSm}>←</Text>
					<Text style={Style.buttonText}>Start over</Text>
				</Pressable>
			</View>
		</View>
	);
};

