import React, { useState, useEffect } from 'react';
import { View, Image, Text, ActivityIndicator, Pressable, StyleSheet, GestureResponderEvent } from 'react-native';
import { Style } from '../styles';
import ProgressDiagram, { apiFetch } from '../util/utility';
import { bbbbbIdentifier } from './device-prefs';

export interface HomeScreenArguments
{
	deviceUUID: string;
	onContinue: () => void;
	onNavigateToDevicePrefs: (identifier: bbbbbIdentifier) => void;
}


interface BindicatorListProps
{
	bData: BindicatorGroup; // Explicitly type bData as an array of strings
	onNavigateToDevicePrefs: (identifier: bbbbbIdentifier) => void;


}

interface BindicatorGroup
{
	count: number;
	bindicators: Bobject[];
}

interface Bobject
{
	device_name: string;
	household_id: string;
	monitoring_uuid: string;
}



const BindicatorList: React.FC<BindicatorListProps> = ({ bData, onNavigateToDevicePrefs }) =>
{
	const data = bData.bindicators;
	if (!Array.isArray(data))
	{
		return null; // Optionally render an error message or fallback
	}

	return (
		<View style={Style.bList}>

			{data.map((item, index) =>
			{


				const identifier = { "monitoring_uuid": item.monitoring_uuid };


				return (


					<View key={index}  >
						<Pressable  style={Style.bListItem} onPress={() => onNavigateToDevicePrefs(identifier)}>
							<Image
								source={require('../../assets/bindicator_censored.png')}
								style={Style.smallBBBBBImage}
							/>
							<Text style={Style.bListItemText}>
								{item.device_name} {/* Ensure you are using the correct key name */}
							</Text>
						</Pressable>
					</View>

				)
			})
			}

		</View >
	);
};

export const HomeScreen = ({ deviceUUID, onContinue, onNavigateToDevicePrefs }: HomeScreenArguments): React.ReactElement =>
{
	const [bindicatorData, setBindicatorData] = useState<BindicatorGroup | null>(null);
	const [loading, setLoading] = useState(false); // Initially not loading
	const [error, setError] = useState<string | null>(null);

	useEffect(() =>
	{
		const response = apiFetch('get-bindicators-for-household',
			{
				"household_id": deviceUUID
			}
			, setBindicatorData, setLoading, setError);
	}, []);


	const isPasswordVisible = true;
	return (
		<View style={Style.vertical}>

			<View>
				<Text style={Style.h2}>My BBBBBs</Text>
			</View>

			{loading && <ActivityIndicator size="large" color="#ffffff" />}
			{error && <Text style={styles.errorText}>{error}</Text>}

			{bindicatorData && (

				<View>
					<BindicatorList bData={bindicatorData} onNavigateToDevicePrefs={onNavigateToDevicePrefs} />
				</View>

			)}

			<View style={Style.navRight}>
				<Pressable style={Style.button} onPress={onContinue}>
					<Text style={Style.buttonIconSm}>+</Text><Text style={Style.buttonText}>Add BBBB</Text>
				</Pressable>
			</View>
		</View >
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 16,
	},
	button: {
		backgroundColor: '#007bff',
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 5,
		marginBottom: 20,
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold',
	},
	errorText: {
		color: 'red',
		marginTop: 10,
	},
	title: {
		fontSize: 18,
		fontWeight: 'bold',
		marginVertical: 10,
	},
});
