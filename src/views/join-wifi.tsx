import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useBLESetup } from '@particle/react-native-ble-setup-library';
import { INetwork } from '@particle/device-control-ble-setup-library';
import { Style } from '../styles';
import { ProgressDiagram, apiFetch, createVerificationKey, IconButton } from '../util/utility';

export interface JoinWiFiArguments
{
	deviceUUID: string,
	setupCode: string,
	onStartOver: () => void,
	onContinue: () => void,
	selectedNetwork?: INetwork,
	wifiPassword?: string
}

export const JoinWiFi = ({ deviceUUID, setupCode, onStartOver, onContinue, selectedNetwork, wifiPassword }: JoinWiFiArguments): React.ReactElement =>
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
				<Text style={Style.h3}>Joining: {selectedNetwork?.ssid} </Text>
			</View>
		);
	}

	return (
		<View style={Style.vertical}>
			<ProgressDiagram numChecks={5} />
			<Text style={Style.h3}>Successfully joined {selectedNetwork?.ssid}!</Text>
			<View style={Style.navCenterSplit}>
				<IconButton
					onPress={onStartOver}
					icon="house"
					buttonType="secondary"
					iconStyle="solid"
					text="Home"
				/>
				<IconButton
					onPress={onContinue}
					icon="calendar-days"
					iconStyle="solid"
					text="Set up schedule"
				/>
			</View>
		</View>
	);
};

