import React, { useState } from 'react';
import { View, Text, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { Style } from '../styles';

export interface HomeScreenArguments {
	onContinue: () => void;
}

export const HomeScreen = ({}: HomeScreenArguments): React.ReactElement => {
	// State to store the fetched data
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false); // Initially not loading
	const [error, setError] = useState<string | null>(null);

	// Fetch data from the API
	const fetchData = async () => {
		setLoading(true); // Start loading
		setError(null); // Reset error state
		try {
			const response = await fetch('https://bindicator-439415.ue.r.appspot.com/test');
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			const result = await response.json();
			setData(result);
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false); // Stop loading
		}
	};

	return (
		<View style={styles.container}>
			<Pressable style={styles.button} onPress={fetchData}>
				<Text style={styles.buttonText}>Fetch Data</Text>
			</Pressable>

			{loading && <ActivityIndicator size="large" color="#0000ff" />}
			{error && <Text style={styles.errorText}>{error}</Text>}
			{data && (
				<View>
					<Text style={styles.title}>Fetched Data:</Text>
					<Text>{JSON.stringify(data, null, 2)}</Text>
				</View>
			)}
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
