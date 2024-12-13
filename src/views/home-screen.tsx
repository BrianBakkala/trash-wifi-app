import React, { useState, useEffect } from 'react';
import { View, Image, Text, ActivityIndicator, Pressable, StyleSheet, ScrollView } from 'react-native';
import { Style } from '../styles';
import { apiFetch } from '../util/utility';
import { bindicatorIdentifier } from './device-prefs';

export interface HomeScreenArguments
{
	deviceUUID: string;
	onContinue: () => void;
	onNavigateToDevicePrefs: (identifier: bindicatorIdentifier) => void;
}


interface BindicatorListProps
{
	bData: BindicatorGroup; // Explicitly type bData as an array of strings
	onNavigateToDevicePrefs: (identifier: bindicatorIdentifier) => void;


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


export const HomeScreen = ({ deviceUUID, onContinue, onNavigateToDevicePrefs }: HomeScreenArguments): React.ReactElement =>
{
	const [bindicatorData, setBindicatorData] = useState<BindicatorGroup | null>(null);
	const [loading, setLoading] = useState(false); // Initially not loading
	const [error, setError] = useState<string | null>(null);
	const [refreshKey, setRefreshKey] = useState(0); // New state to control re-running the effect
	const [monitoringUUID, setMonitoringUUID] = useState<string>(""); // New state to control re-running the effect

	useEffect(() =>
	{
		const response = apiFetch('get-bindicators-for-household',
			{
				"household_id": deviceUUID
			}
			, setBindicatorData, setLoading, setError);
	}, [refreshKey]);
	useEffect(() =>
	{

		console.log(bindicatorData)
		if (bindicatorData && bindicatorData.bindicators && bindicatorData.bindicators.length > 0)
		{
			setMonitoringUUID(bindicatorData.bindicators[0].monitoring_uuid)
		}
	}, [bindicatorData]);


	const isPasswordVisible = true;
	return (
		<View style={Style.vertical}>

			<View style={styles.bListWrapper}>
				<View>
					<Text style={[{ textAlign: 'center', }, Style.h2]}>My BBBBBs</Text>
				</View>

				{loading && <ActivityIndicator size="large" color="#ffffff" />}
				{error && <Text style={styles.errorText}>{error}</Text>}

				{bindicatorData && (

					<ScrollView>
						<View style={styles.bList}>

							{bindicatorData.bindicators.map((item, index) =>
							{
								const identifier = { "monitoring_uuid": item.monitoring_uuid };
								return (


									<View key={index}  >
										<Pressable style={styles.bListItem} onPress={() => onNavigateToDevicePrefs(identifier)}>
											<Image
												source={require('../../assets/bindicator_censored.png')}
												style={Style.smallBindicatorImage}
											/>
											<Text style={styles.bListItemText}>
												{item.device_name} {/* Ensure you are using the correct key name */}
											</Text>
										</Pressable>
									</View>

								)
							})
							}

						</View >
						<View style={[Style.simpleFlexRow, { marginTop: 35 }]}>
							<Pressable style={Style.button} onPress={() => setRefreshKey(prev => prev + 1)}>
								<Text style={Style.buttonIcon}>⟳</Text><Text style={Style.buttonText}>Refresh</Text>
							</Pressable>
						</View>
					</ScrollView>

				)}
			</View>

			<View style={Style.navCenterSplit}>

				<Pressable style={Style.button} onPress={() => onNavigateToDevicePrefs({ "monitoring_uuid": monitoringUUID })}>
					<Text style={Style.buttonIconSm}>⚙️</Text><Text style={Style.buttonText}>Settings</Text>
				</Pressable>
				<Pressable style={Style.button} onPress={onContinue}>
					<Text style={Style.buttonIconSm}>+</Text><Text style={Style.buttonText}>Add BBBBB</Text>
				</Pressable>
			</View>
		</View >
	);
};

const styles = StyleSheet.create({

	bListWrapper: {
		marginTop: 40,
	},

	bList: {
		display: 'flex',
		flexDirection: 'column',
		gap: 20,
		alignContent: 'center',
		justifyContent: 'center',
	},
	bListItem: {
		display: 'flex',
		flexDirection: 'row',
		gap: 10,
		alignItems: 'center',
		color: 'white',
		borderRadius: 4,
		padding: 10,
		backgroundColor: '#222222'
	},

	bListItemText: {
		color: 'white',
	},


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
