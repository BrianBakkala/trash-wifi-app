import React from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { INetwork } from '@particle/react-native-ble-setup-library';
import { Style } from '../styles';

export interface WiFiCredentialsArguments {
	onBack: () => void,
	onContinue: () => void,
	selectedNetwork?: INetwork,
	wifiPassword?: string,
	setWifiPassword: React.Dispatch<string|undefined>
}

const humanReadableSecurity: {[key: number]: string} = {
	0: 'No security',
	1: 'WEP',
	2: 'WPA PSK',
	3: 'WPA2 PSK',
	4: 'WPA/WPA2 PSK'
};

// eslint-disable-next-line
export const WiFiCredentials = ({ onBack, onContinue, selectedNetwork, wifiPassword, setWifiPassword }: WiFiCredentialsArguments): React.ReactElement => {
	const passwordGoodEnough = wifiPassword && wifiPassword.length >= 8;

	if (!selectedNetwork || typeof selectedNetwork.security === 'undefined') {
		return (
			<View style={Style.nav}>
				<Pressable style={Style.button} onPress={onBack}>
					<Text style={Style.buttonText}>Back</Text>
				</Pressable>
			</View>
		);
	}

	return (
		<KeyboardAvoidingView
			style={Style.vertical}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View style={Style.vertical}>
					<Text style={Style.h2}>Password for: {selectedNetwork.ssid}</Text>
					<View>
						<Text style={Style.label}>{humanReadableSecurity[selectedNetwork.security]} Password</Text>
						<TextInput
							style={Style.input}
							secureTextEntry={true}
							onChangeText={setWifiPassword}
							value={wifiPassword}
						/>	
					</View>
					<View>
						<Pressable
							style={passwordGoodEnough ? Style.button : Style.buttonDisabled}
							onPress={onContinue}
							disabled={!passwordGoodEnough}>
							<Text style={Style.buttonText}>Save</Text><Text style={Style.buttonIconMd}>✓</Text>
						</Pressable>
							
					</View>
					<View style={Style.leftNav}>
						<Pressable style={Style.buttonSecondary} onPress={onBack}>
							<Text style={Style.buttonIconSm}>←</Text><Text style={Style.buttonText}>Back</Text>
						</Pressable> 
					</View>
				</View>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
};
