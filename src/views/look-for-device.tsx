import React, { useEffect } from 'react';
import { ActivityIndicator, View, Text, Pressable } from 'react-native';
import { useBLESetup } from '@particle/react-native-ble-setup-library';
import { Style } from '../styles';

export interface LookForDeviceArguments {
	setupCode: string,
	onBack: () => void,
	onContinue: () => void
}

// eslint-disable-next-line
export const LookForDevice = ({ setupCode, onBack, onContinue }: LookForDeviceArguments): React.ReactElement => {
	const { searchDevices, isSearchingDevices, device } = useBLESetup();

	const retry = () => {
		searchDevices({ setupCode });
	};
	useEffect(() => retry(), []);

	if (isSearchingDevices) {
		return (
			<View style={Style.vertical}>
				<ActivityIndicator size="large" color="#ffffff" />
				<Text style={Style.h2}>Looking for {setupCode}...</Text>
			</View>
		);
	} else if (device) {
		return (
			<View style={Style.vertical}> 
				<Text style={Style.indicatorIcons}>✓</Text>
				<Text style={Style.h2}>Found BBBBB {setupCode}!</Text>
				<View>
					<Pressable style={Style.button} onPress={onContinue}>
						<Text style={Style.buttonIconMd}>⎋</Text><Text style={Style.buttonText}>Connect</Text>
					</Pressable>
				</View>
				<View style={Style.leftNav}>
					<Pressable style={Style.buttonSecondary} onPress={onBack}>
					<Text style={Style.buttonIconSm}>←</Text><Text style={Style.buttonText}>Back</Text>
					</Pressable>
				
				</View>
			</View>
		);
	} else {
		return (
			<View style={Style.vertical}>
				<Text style={Style.indicatorIcons}>𐄂</Text>
				<Text style={Style.h2}>{setupCode} not found</Text>
				<View>
					<Pressable style={Style.button} onPress={retry}>
						<Text style={Style.buttonIcon}>⟳</Text><Text style={Style.buttonText}>Try again</Text>
					</Pressable>
				</View>
				<View style={Style.leftNav}>
					<Pressable style={Style.buttonSecondary} onPress={onBack}>
						<Text style={Style.buttonIconSm}>←</Text><Text style={Style.buttonText}>Back</Text>
					</Pressable>
				</View>
			</View>
		);
	}
};
