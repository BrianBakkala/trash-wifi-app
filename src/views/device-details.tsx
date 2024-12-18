import React from 'react';
import { View, Image, Text, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Style } from '../styles';
import { IconButton } from '../util/utility';

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

					<Image
						source={require('../../assets/bindicator.png')}
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

						<IconButton
							onPress={onBack}
							icon="arrow-left"
							iconStyle="solid"
							text="Back"
							buttonType='secondary'
						/>
						<IconButton
							onPress={() =>
							{
								setSetupCode(setupCode);
								setMobileSecret(mobileSecret);
								onContinue();
							}}
							icon="arrow-right"
							iconStyle="solid"
							text="Continue"
						/>
					</View>
				</View>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
};
