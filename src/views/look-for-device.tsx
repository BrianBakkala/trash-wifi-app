import React, { useEffect } from 'react';
import { ActivityIndicator, View, Text, Pressable } from 'react-native';
import { useBLESetup } from '@particle/react-native-ble-setup-library';
import { Style } from '../styles';
import ProgressDiagram from '../util/utility';


export interface LookForDeviceArguments
{
	setupCode: string,
	onBack: () => void,
	onContinue: () => void
}

// eslint-disable-next-line
export const LookForDevice = ({ setupCode, onBack, onContinue }: LookForDeviceArguments): React.ReactElement =>
{
	const { searchDevices, isSearchingDevices, device } = useBLESetup();

	const retry = () =>
	{
		searchDevices({ setupCode });
	};
	useEffect(() => retry(), []);

	if (isSearchingDevices)
	{
		return (
			<View style={Style.vertical}>
				<ActivityIndicator size="large" color="#ffffff" />
				<Text style={Style.h2}>Looking for {setupCode}...</Text>
			</View>
		);
	} else if (device)
	{
		return (
			<View style={Style.vertical}>
				<ProgressDiagram numChecks={1} />
				<Text style={Style.h2}>Found BBBBB {setupCode}!</Text>
				<View style={Style.navSpace}>
					<Pressable style={Style.buttonSecondary} onPress={onBack}>
						<Text style={Style.buttonIconSm}>←</Text><Text style={Style.buttonText}>Back</Text>
					</Pressable>
					<Pressable style={Style.button} onPress={onContinue}>
						<Text style={Style.buttonText}>Connect</Text><Text style={Style.buttonIconSm}>→</Text>
					</Pressable>
				</View>
			</View>
		);
	} else
	{
		return (
			<View style={Style.vertical}>
				<Text style={Style.h2}>𐄂 {setupCode} not found</Text>
				<View>
					<Pressable style={Style.button} onPress={retry}>
						<Text style={Style.buttonIcon}>⟳</Text><Text style={Style.buttonText}>Try again</Text>
					</Pressable>
				</View>
				<View style={Style.navLeft}>
					<Pressable style={Style.buttonSecondary} onPress={onBack}>
						<Text style={Style.buttonIconSm}>←</Text><Text style={Style.buttonText}>Back</Text>
					</Pressable>
				</View>
			</View>
		);
	}
};
