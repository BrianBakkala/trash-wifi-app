import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Image } from 'react-native';
import { INetwork } from '@particle/device-control-ble-setup-library';
import { Style } from '../styles';
import { getIcon } from '../util/icons';
import { apiFetch, IconButton, BareButton } from '../util/utility';

export interface WiFiCredentialsArguments
{
	onBack: () => void,
	onContinue: () => void,
	selectedNetwork?: INetwork,
	wifiPassword?: string,
	setWifiPassword: React.Dispatch<string | undefined>
}

const humanReadableSecurity: { [key: number]: string } = {
	0: 'No security',
	1: 'WEP',
	2: 'WPA PSK',
	3: 'WPA2 PSK',
	4: 'WPA/WPA2 PSK'
};

// eslint-disable-next-line
export const WiFiCredentials = ({ onBack, onContinue, selectedNetwork, wifiPassword, setWifiPassword }: WiFiCredentialsArguments): React.ReactElement =>
{
	const passwordGoodEnough = wifiPassword && wifiPassword.length >= 8;
	const [isPasswordVisible, setPasswordVisible] = useState(false);

	if (!selectedNetwork || typeof selectedNetwork.security === 'undefined')
	{
		return (
			<View style={Style.nav}>
				<IconButton
					onPress={onBack}
					icon="arrow-left"
					buttonType="secondary"
					iconStyle="solid"
					text="Back"
				/>
			</View>
		);
	}

	return (
		<KeyboardAvoidingView
			style={Style.vertical}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View style={Style.vertical}>
					<Text style={Style.h3}>Password for: {selectedNetwork.ssid}</Text>

					<View>
						<View style={Style.simpleFlexRow}>

							<TextInput
								style={Style.inputNoMargin}

								value={wifiPassword}
								onChangeText={setWifiPassword}
								secureTextEntry={!isPasswordVisible} // Toggles password visibility

								placeholder="Password"
								placeholderTextColor="#aaa"
							/>


							<Pressable style={Style.toggleVisibilityButton} onPress={() => setPasswordVisible(!isPasswordVisible)}  >
								{getIcon((isPasswordVisible ? "eye-slash" : "eye"))}
							</Pressable>


						</View>

						<View>
							<Text style={Style.label}>(Security: {humanReadableSecurity[selectedNetwork.security]})</Text>
						</View>
					</View>
					<View style={Style.navSpace}>

						<IconButton
							onPress={onBack}
							icon="arrow-left"
							buttonType="secondary"
							iconStyle="solid"
							text="Back"
						/>
						<IconButton
							onPress={onContinue}
							icon="wifi"
							buttonType={selectedNetwork ? "primary" : "disabled"}
							iconStyle="solid"
							text="Continue"
						/>

					</View>
				</View>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
};
