import React from 'react';
import { View, Image, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Style } from '../styles';

export interface DeviceDetailsArguments
{
	setupCode: string,
	setSetupCode: React.Dispatch<React.SetStateAction<string>>,
	mobileSecret: string,
	setMobileSecret: React.Dispatch<React.SetStateAction<string>>,
	onContinue: () => void
	onBack: () => void
}

// eslint-disable-next-line
export const DeviceDetails = ({ setupCode, setSetupCode, mobileSecret, setMobileSecret, onContinue, onBack }: DeviceDetailsArguments): React.ReactElement =>
{

	return (
		<KeyboardAvoidingView
			style={Style.vertical}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View style={Style.vertical}>


					<Text style={Style.h2}>Bindicator WiFi Setup</Text>

					<Image
						source={require('../../assets/bindicator_censored.png')}
						style={Style.mainBindicatorImage}
					/>

					<View style={Style.paragraph}>

						<Text style={Style.paragraphText}>Please enter the setup code found on the label on the back of the Bindicator.</Text>

					</View>

					<View>
						<Text style={Style.label}>Setup code</Text>
						<TextInput
							style={Style.input}
							onChangeText={setSetupCode}
							value={setupCode}
						/>
					</View>
					<View style={Style.displayNone}>
						<Text>Mobile secret</Text>
						<TextInput
							style={Style.input}
							onChangeText={setMobileSecret}
							value={mobileSecret}
						/>
					</View>
					<View style={Style.navCenterSplit}>
						<Pressable style={Style.buttonSecondary} onPress={onBack}>
							<Text style={Style.buttonIconSm}>←</Text><Text style={Style.buttonText}>Back</Text>
						</Pressable>
						<Pressable style={Style.button} onPress={() =>
						{
							setSetupCode(setupCode);
							setMobileSecret(mobileSecret);
							onContinue();
						}}>
							<Text style={Style.buttonText}>Continue</Text><Text style={Style.buttonIconSm}>→</Text>
						</Pressable>
					</View>
				</View>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
};
