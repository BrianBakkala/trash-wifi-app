import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

export interface HomeScreenArguments {
	onContinue: () => void;
}

export const HomeScreen = ({ onContinue }: HomeScreenArguments): React.ReactElement => {
	// State to store the fetched data
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Fetch data from the API
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch('https://bindicator-439415.ue.r.appspot.com/test');
				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}
				const result = await response.json();
				setData(result);
			} catch (err:any) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []); // Empty dependency array ensures the effect runs once when the component mounts.

	return (
		<View style={styles.container}>
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
	errorText: {
		color: 'red',
		fontSize: 16,
	},
	title: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 8,
	},
});
