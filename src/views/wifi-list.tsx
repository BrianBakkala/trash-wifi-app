import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useBLESetup } from '@particle/react-native-ble-setup-library';
import { INetwork } from '@particle/device-control-ble-setup-library';
import { Style } from '../styles';
import { ProgressDiagram, IconButton } from '../util/utility';

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
				<Text style={[{ fontFamily: 'bold', fontSize: 20 }, Style.listItemText]}>{`${item.ssid}`}</Text>
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
				<Text style={Style.h3}>Scanning for networks...</Text>
			</View>
		)
		:
		(
			<View style={Style.vertical}>
				<Text style={Style.h3}>Found networks</Text>
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
				<IconButton
					onPress={onBack}
					icon="arrow-left"
					buttonType="secondary"
					iconStyle="solid"
					text="Back"
				/>
				<IconButton
					onPress={scan}
					icon="arrow-rotate-right"
					buttonType={!isScanningWiFiNetworks ? "primary" : "disabled"}
					iconStyle="solid"
					text="Rescan"
				/>
				<IconButton
					onPress={onContinue}
					icon="key"
					buttonType={selectedNetwork ? "primary" : "disabled"}
					iconStyle="solid"
					text="Connect"
				/>
			</View>
		</View>
	);
};
