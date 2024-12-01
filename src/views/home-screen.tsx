import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { Style } from '../styles';
import { apiFetch } from '../util/utility'; // Adjust the path if necessary

export interface HomeScreenArguments
{
	deviceUUID: string; // Change this from a function to a value
	onContinue: () => void;

}


interface BindicatorListProps
{
	bData: BindicatorGroup; // Explicitly type bData as an array of strings
}

interface BindicatorGroup
{
	count: number;
	bindicators: Bobject[];
}

interface Bobject
{
	photon_id: string;
	household_id: string;
}



const BindicatorList: React.FC<BindicatorListProps> = ({ bData }) =>
{
	const data = bData.bindicators;
	if (!Array.isArray(data))
	{
		return null; // Optionally render an error message or fallback
	}


	return (
		<View style={Style.bList}>
			{data.map((item, index) => (


				<Text key={index} style={Style.bListItem}>
					{item.photon_id} {/* Ensure you are using the correct key name */}
				</Text>



			))}
		</View>
	);
};

export const HomeScreen = ({ deviceUUID, onContinue }: HomeScreenArguments): React.ReactElement =>
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


	return (
		<View style={Style.vertical}>

			<View>
				<Text style={Style.h2}>My BBBBBs</Text>
			</View>

			{loading && <ActivityIndicator size="large" color="#0000ff" />}
			{error && <Text style={styles.errorText}>{error}</Text>}

			{bindicatorData && (

				<View>
					<BindicatorList bData={bindicatorData} />
				</View>

			)}

			<View style={Style.rightNav}>
				<Pressable style={Style.button} onPress={onContinue}>
					<Text style={Style.buttonIconSm}>+</Text><Text style={Style.buttonText}>Add BBBB</Text>
				</Pressable>
			</View>
		</View>
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
