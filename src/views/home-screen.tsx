import React, { useState, useEffect } from 'react';
import { View, Image, Text, ActivityIndicator, Pressable, StyleSheet, ScrollView } from 'react-native';
import { Style } from '../styles';
import { apiFetch, IconButton, BareButton } from '../util/utility';
import { bindicatorIdentifier } from './device-prefs';

export interface HomeScreenArguments
{
	deviceUUID: string;
	onContinue: () => void;
	onNavigateToDevicePrefs: (identifier: bindicatorIdentifier) => void;
	onNavigateToGlobalPrefs: () => void;
}

interface BindicatorGroup
{
	count: number;
	bindicators: Bobject[];
}

interface Bobject
{
	bindicator_name: string;
	household_id: string;
	monitoring_uuid: string;
}


export const HomeScreen = ({ deviceUUID, onContinue, onNavigateToDevicePrefs, onNavigateToGlobalPrefs }: HomeScreenArguments): React.ReactElement =>
{
	const [bindicatorData, setBindicatorData] = useState<BindicatorGroup | null>(null);
	const [loading, setLoading] = useState(false); // Initially not loading
	const [error, setError] = useState<string | null>(null);
	const [refreshKey, setRefreshKey] = useState(0); // New state to control re-running the effect
	const [monitoringUUID, setMonitoringUUID] = useState<string>(""); // New state to control re-running the effect
	const [bindicatorCount, setBindicatorCount] = useState<number>(0); // New state to control re-running the effect

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
		if (bindicatorData && bindicatorData.bindicators && bindicatorData.bindicators.length > 0)
		{
			setMonitoringUUID(bindicatorData.bindicators[0].monitoring_uuid)
			setBindicatorCount(bindicatorData.count)
		}
	}, [bindicatorData]);


	const isPasswordVisible = true;
	return (
		<View style={Style.vertical}>

			<View style={styles.bListWrapper}>
				<View>
					<Text style={[{ textAlign: 'center', fontFamily: 'bold' }, Style.h2]}>My BBBBBs</Text>
				</View>
				<ScrollView>
					<View  >

						{loading && <ActivityIndicator size="large" color="#ffffff" />}

						{!loading && bindicatorCount == 0 && <Text style={Style.paragraphText}>No BBBBBs found.</Text>}

						{error && <Text style={styles.errorText}>{error}</Text>}
					</View>

					{bindicatorData && (

						<View >
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
													{item.bindicator_name}
												</Text>
												<Text  >→</Text>
											</Pressable>
										</View>

									)
								})
								}


							</View >
							<View style={[Style.simpleFlexRow, { marginTop: 35 }]}>

								<IconButton
									onPress={() => setRefreshKey(prev => prev + 1)}
									icon="arrow-rotate-right"
									iconStyle="solid"
									text="Refresh"
								/>

							</View>
						</View>

					)}
				</ScrollView>
			</View>

			<View style={Style.navCenterSplit}>

				<IconButton
					onPress={() => onNavigateToGlobalPrefs()}
					icon="calendar-days"
					buttonType={bindicatorCount > 0 ? "primary" : "disabled"}
					iconStyle="solid"
					text="Schedule"
				/>

				<IconButton
					onPress={onContinue}
					icon="plus"
					iconStyle="solid"
					text="New BBBBB"
				/>
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
		justifyContent: 'center',
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
	errorText: {
		color: 'red',
		marginTop: 10,
	},
	title: {
		fontSize: 18,
		fontFamily: 'bold',
		marginVertical: 10,
	},
});
