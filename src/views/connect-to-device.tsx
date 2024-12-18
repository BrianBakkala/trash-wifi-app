import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useBLESetup, ConnectionStatus } from '@particle/react-native-ble-setup-library';
import { Style } from '../styles';
import { ProgressDiagram, IconButton } from '../util/utility';

export interface ConnectToDeviceArguments
{
	mobileSecret: string,
	setupCode: string,
	onBack: () => void,
	onContinue: () => void
}

// eslint-disable-next-line
export const ConnectToDevice = ({ mobileSecret, setupCode, onBack, onContinue }: ConnectToDeviceArguments): React.ReactElement =>
{
	const { device, connectionStatus, connect } = useBLESetup();

	useEffect(() =>
	{
		if (!device)
		{
			onBack();
		}
	}, [device]);

	useEffect(() =>
	{
		if (connectionStatus === ConnectionStatus.Disconnected)
		{
			connect(mobileSecret);
		}
	}, []);


	if (!device)
	{
		return (
			<View style={Style.vertical}>
				<Text style={Style.emoji}>🤔️</Text>
				<Text style={Style.h3}>No device selected</Text>
				<View style={Style.nav}>
					<IconButton
						onPress={onBack}
						icon="arrow-left"
						buttonType="secondary"
						iconStyle="solid"
						text="Back"
					/>
				</View>
			</View>
		);
	}

	if (connectionStatus === ConnectionStatus.Disconnected)
	{
		return (
			<View style={Style.vertical}>
				<Text style={Style.emoji}></Text>
				<Text style={Style.h3}>Device disconnected</Text>
				<View style={Style.nav}>
					<IconButton
						onPress={onBack}
						icon="arrow-left"
						buttonType="secondary"
						iconStyle="solid"
						text="Back"
					/>
				</View>
			</View>
		);
	}

	if (connectionStatus === ConnectionStatus.Connecting)
	{
		return (
			<View style={Style.vertical}>
				<ProgressDiagram showLoader={true} numChecks={1} />
				<Text style={Style.h3}>Connecting to Bindicator {setupCode}...</Text>
			</View>
		);
	}


	return (
		<View style={Style.vertical}>
			<ProgressDiagram numChecks={2} />
			<Text style={Style.h3}>Connected to Bindicator {setupCode}!</Text>

			<View style={Style.navSpace}>
				<IconButton
					onPress={onBack}
					icon="arrow-left"
					iconStyle="solid"
					buttonType="secondary"
					text="Back"
				/>
				<IconButton
					onPress={onContinue}
					icon="arrow-right"
					iconStyle="solid"
					text="Set up WiFi"
				/>
			</View>

		</View>
	);
};
