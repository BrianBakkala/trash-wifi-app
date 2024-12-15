import React, { useEffect } from 'react';
import { ActivityIndicator, View, Text, Pressable } from 'react-native';
import { useBLESetup } from '@particle/react-native-ble-setup-library';
import { Style } from '../styles';
import { ProgressDiagram, apiFetch, IconButton, BareButton, IconHeading } from '../util/utility';
import { getIcon } from '../util/icons';

export interface LookForDeviceArguments
{
	setupCode: string,
	onBack: () => void,
	onContinue: () => void
}

// eslint-disable-next-line
export const LookForDevice = ({ setupCode, onBack, onContinue }: LookForDeviceArguments): React.ReactElement =>
{
	const { searchDevices, isSearchingDevices, device } = useBLESetup();

	const retry = () =>
	{
		searchDevices({ setupCode });
	};
	useEffect(() => retry(), []);

	if (isSearchingDevices)
	{
		return (
			<View style={Style.vertical}>
				<ActivityIndicator size="large" color="#ffffff" />
				<Text style={Style.h3}>Looking for {setupCode}...</Text>
			</View>
		);
	} else if (device)
	{
		return (
			<View style={Style.vertical}>
				<ProgressDiagram numChecks={1} />
				<Text style={Style.h3}>Found BBBBB {setupCode}!</Text>
				<View style={Style.navSpace}>
					<IconButton
						onPress={onBack}
						buttonType="secondary"
						icon="arrow-left"
						iconStyle="solid"
						text="Back"
					/>
					<IconButton
						onPress={onContinue}
						icon="bluetooth-b"
						iconStyle="brand"
						text="Connect"
					/>
				</View>
			</View>
		);
	} else
	{
		return (
			<View style={Style.vertical}>
				<IconHeading icon="xmark" />
				<Text style={Style.h3}>  BBBBB {setupCode} not found</Text>
				<View>
					<IconButton
						onPress={retry}
						icon="arrow-rotate-right"
						iconStyle="solid"
						text="Try again"
					/>
				</View>
				<View style={Style.navLeft}>
					<IconButton
						onPress={onBack}
						buttonType="secondary"
						icon="arrow-left"
						iconStyle="solid"
						text="Back"
					/>
				</View>
			</View>
		);
	}
};
