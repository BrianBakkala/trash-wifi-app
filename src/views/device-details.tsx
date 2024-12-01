import React from 'react';
import { View, Image, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Style } from '../styles';

export interface DeviceDetailsArguments {
	setupCode: string,
	setSetupCode: React.Dispatch<React.SetStateAction<string>>,
	mobileSecret: string,
	setMobileSecret: React.Dispatch<React.SetStateAction<string>>,
	onContinue: () => void
}

// eslint-disable-next-line
export const DeviceDetails = ({ setupCode, setSetupCode, mobileSecret, setMobileSecret, onContinue }: DeviceDetailsArguments): React.ReactElement => {
	 
	return (
		<KeyboardAvoidingView
			style={Style.vertical}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View style={Style.vertical}>
			

					<Text style={Style.h2}>BBBBB WiFi Setup</Text>

					<Image
						source={require('../../assets/bindicator_censored.png')}
						style={Style.mainBBBBBImage}
					/> 

					<View>

						<Text style={Style.paragraph}>Please enter the setup code found on the label on the back of the BBBBB.</Text>
 
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
					<View style={Style.nav}>
						<Pressable style={Style.button} onPress={() => {
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
