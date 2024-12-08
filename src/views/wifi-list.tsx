import React, { useEffect } from 'react';
import { ActivityIndicator, View, Text, Pressable, FlatList, TouchableOpacity } from 'react-native';
import { useBLESetup } from '@particle/react-native-ble-setup-library';
import { INetwork } from '@particle/device-control-ble-setup-library';
import { Style } from '../styles';
import ProgressDiagram, { apiFetch } from '../util/utility';


export interface ListNetworksArguments
{
	onBack: () => void,
	onContinue: () => void,
	selectedNetwork?: INetwork,
	setSelectedNetwork: React.Dispatch<INetwork | undefined>
}

export interface RenderNetworkThunkArguments
{
	selectedNetwork?: INetwork,
	setSelectedNetwork: React.Dispatch<INetwork | undefined>
}

export const renderNetworkThunk = ({ selectedNetwork, setSelectedNetwork }: RenderNetworkThunkArguments) =>
{
	return ({ item }: { item: INetwork }): React.ReactElement<INetwork> =>
	{
		const isSelected = item.ssid === selectedNetwork?.ssid;
		const getSignalStrength = function (rssi: number)
		{
			if (rssi > -50)
			{
				return "Strong";
			} else if (rssi > -60)
			{
				return "Good";
			} else if (rssi > -70)
			{
				return "Weak";
			} else if (rssi > -80)
			{
				return "Poor";
			} else
			{
				return "Very Poor";
			}
		}

		return (
			<TouchableOpacity
				style={isSelected ? Style.listItemSelected : Style.listItem}
				testID='button'
				onPress={() => setSelectedNetwork(item)}>
				<Text style={[{ fontWeight: 'bold' }, Style.listItemText]}>{`${item.ssid}`}</Text>
				<Text style={Style.listItemText}>{`: ${getSignalStrength(item.rssi)}`}</Text>
			</TouchableOpacity>
		);
	};
};

// eslint-disable-next-line
export const WiFiList = ({ onBack, onContinue, selectedNetwork, setSelectedNetwork }: ListNetworksArguments): React.ReactElement =>
{
	const { scanForWiFiNetworks, isScanningWiFiNetworks, foundWiFiNetworks } = useBLESetup();

	const scan = () =>
	{
		setSelectedNetwork(undefined);
		scanForWiFiNetworks();
	};

	useEffect(() =>
	{
		if (!isScanningWiFiNetworks)
		{
			scan();
		}
	}, []);

	const renderNetwork = renderNetworkThunk({ selectedNetwork, setSelectedNetwork });
	const networkKeyExtractor = (network: INetwork) => network.ssid ? network.ssid : '';

	const content = isScanningWiFiNetworks ?
		(
			<View style={Style.vertical}>
				<ProgressDiagram showLoader={true} numChecks={2} />
				<Text style={Style.h2}>Scanning for networks...</Text>
			</View>
		)
		:
		(
			<View style={Style.vertical}>
				<Text style={Style.h2}>Found networks</Text>
				<FlatList
					data={foundWiFiNetworks}
					renderItem={renderNetwork}
					keyExtractor={networkKeyExtractor}
					extraData={selectedNetwork}
					style={Style.list} />
			</View>
		);

	return (
		<View style={Style.vertical}>
			{content}
			<View style={Style.navSpace}>
				<Pressable style={Style.buttonSecondary} onPress={onBack}>
					<Text style={Style.buttonIconSm}>←</Text><Text style={Style.buttonText}>Back</Text>
				</Pressable>
				<Pressable
					style={isScanningWiFiNetworks ? Style.buttonDisabled : Style.button}
					onPress={scan}
					disabled={isScanningWiFiNetworks}>
					<Text style={Style.buttonIcon}>⟳</Text><Text style={Style.buttonText}>Rescan</Text>
				</Pressable>
				<Pressable
					style={selectedNetwork ? Style.button : Style.buttonDisabled}
					onPress={onContinue}
					disabled={!selectedNetwork} >
					<Text style={Style.buttonText}>Continue</Text><Text style={Style.buttonIconSm}>→</Text>
				</Pressable>
			</View>
		</View>
	);
};
