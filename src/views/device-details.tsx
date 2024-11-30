import React from 'react';
import { View, Image, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Style } from '../styles';
import Svg, { Circle, Rect, RNSVGCircle } from 'react-native-svg';

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
						style={Style.image}
					/> 

					<View>

						<Text style={Style.paragraph}>Please enter the setup code found on the label on the back of the Bindicator.</Text>

						<Svg height="50%" width="50%" viewBox="0 0 100 100"  >
      <Circle cx="50" cy="50" r="45" stroke="blue" strokeWidth="2.5" fill="green" />
      <Rect x="15" y="15" width="70" height="70" stroke="red" strokeWidth="2" fill="yellow" />
    </Svg>
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
							<Text style={Style.buttonText}>Continue</Text>
						</Pressable>
					</View>
				</View>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
};
