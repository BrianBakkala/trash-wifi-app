import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, useColorScheme } from 'react-native';

import { useBLESetup, BLEStatus } from '@particle/react-native-ble-setup-library';
import { INetwork } from '@particle/device-control-ble-setup-library';

import { DeviceDetails } from './views/device-details';
import { LookForDevice } from './views/look-for-device';
import { ConnectToDevice } from './views/connect-to-device';
import { WiFiList } from './views/wifi-list';
import { WiFiCredentials } from './views/wifi-credentials';
import { JoinWiFi } from './views/join-wifi';
import { ErrorModal } from './views/error-modal';
import { Style } from './styles';
import { HomeScreen } from './views/home-screen';
import { DevicePrefs, bbbbbIdentifier } from './views/device-prefs';
import { HolidaySetup } from './views/holiday-setup';
import * as SecureStore from 'expo-secure-store';


export enum SetupStep
{
	HolidaySetup,
	DevicePrefs,
	HomeScreen,
	EnterDeviceDetails,
	LookForDevice,
	ConnectToDevice,
	WiFiList,
	WiFiCredentials,
	JoinWiFi,
	UpdateSettings
}


const generateCustomUUID = () =>
{
	const timestamp = Date.now(); // Get the current time in milliseconds
	const randomValue = Math.random().toString(36).substring(2, 15); // Generate a random string
	return `${timestamp}-${randomValue}`; // Combine them to form a "UUID"
};


const getOrCreateUUID = async () =>
{
	try
	{
		let deviceUUID = await SecureStore.getItemAsync('device_uuid');

		if (!deviceUUID)
		{
			// If UUID is not found, generate a new one
			deviceUUID = generateCustomUUID();
			await SecureStore.setItemAsync('device_uuid', deviceUUID); // Store it securely
		}

		return deviceUUID;
	} catch (error)
	{
		console.error('Error retrieving or creating UUID', error);
		return "";
	}
};

export const Root: React.FC<{ defaultCurrentStep?: SetupStep }> = ({
	defaultCurrentStep = SetupStep.HomeScreen
}) =>
{

	const scheme = useColorScheme();
	const [setupCode, setSetupCode] = useState<string>('');
	const [mobileSecret, setMobileSecret] = useState<string>('');
	const [currentStep, setCurrentStep] = useState<SetupStep>(defaultCurrentStep);
	const [selectedNetwork, setSelectedNetwork] = useState<INetwork | undefined>(undefined);
	const [wifiPassword, setWifiPassword] = useState<string | undefined>(undefined);
	const [deviceUUID, setUUID] = useState<string>('');
	const [deviceIdentifierObject, setDeviceIdentifierObject] = useState<bbbbbIdentifier>();




	useEffect(() =>
	{
		const fetchUUID = async () =>
		{
			const deviceUUID = await getOrCreateUUID();
			setUUID(deviceUUID); // Store it in state to display
		};

		fetchUUID();
	}, []);


	// Get the status from the setup context
	const { status, device, disconnect, error, clearLastError } = useBLESetup();

	// Go to the beginning if we encounter any errors like disconnection
	useEffect(() =>
	{
		if (!device && error)
		{
			setCurrentStep(SetupStep.HomeScreen);
		}
	}, [device, error]);

	// Make sure we can use BLE
	if (status !== BLEStatus.PoweredOn)
	{
		const messages = {
			[BLEStatus.Unknown]: 'Initializing BLE',
			[BLEStatus.Unsupported]: 'BLE is not supported',
			[BLEStatus.Unauthorized]: 'This app needs permission for precise location. Please go to Settings > Apps and turn them on',
			[BLEStatus.Resetting]: 'BLE is resetting',
			[BLEStatus.PoweredOff]: 'BLE is turned off',
		};
		return (
			<View style={Style.centered}>
				<Text>{messages[status]}</Text>
			</View>
		);
	}

	const navigateToDevicePrefs = (identifier: bbbbbIdentifier) =>
	{
		setDeviceIdentifierObject(identifier); // Set the identifier for DevicePrefs
		setCurrentStep(SetupStep.DevicePrefs); // Navigate to the DevicePrefs step
	};


	// Rudimentary routing
	let step;
	// Step -2: Holiday Setup
	if (currentStep === SetupStep.HolidaySetup)
	{
		step = <HolidaySetup
			deviceUUID={deviceUUID}
			onBack={() => setCurrentStep(SetupStep.DevicePrefs)}
		/>;


		// Step -1: Device Settings
	} else if (currentStep === SetupStep.DevicePrefs)
	{
		step = <DevicePrefs
			deviceUUID={deviceUUID}
			deviceIdentifier={deviceIdentifierObject}
			onBack={() => setCurrentStep(SetupStep.HomeScreen)}
			navigateToHolidaySetup={() => setCurrentStep(SetupStep.HolidaySetup)}

		/>;

		// Step 0: Home
	} else if (currentStep === SetupStep.HomeScreen)
	{
		step = <HomeScreen
			deviceUUID={deviceUUID}
			onContinue={() => setCurrentStep(SetupStep.EnterDeviceDetails)}
			onNavigateToDevicePrefs={navigateToDevicePrefs}
		/>;

		// Step 1: Enter the device setup code and mobile secret
		// This data should be retreived from the backend
	} else if (currentStep === SetupStep.EnterDeviceDetails)
	{
		step = <DeviceDetails
			setupCode="052BF8"
			// setupCode={setupCode}
			setSetupCode={setSetupCode}
			mobileSecret="AAAAAAAAAAAAAAA"
			setMobileSecret={setMobileSecret}
			onContinue={() => setCurrentStep(SetupStep.LookForDevice)}
		/>;
		// Step 2: Search for BLE devices in provisioning mode, matching UUIDs
		// we specified.
	} else if (currentStep === SetupStep.LookForDevice)
	{
		step = <LookForDevice
			// setupCode="052BF8"
			setupCode={setupCode}
			onBack={() => setCurrentStep(SetupStep.EnterDeviceDetails)}
			onContinue={() => setCurrentStep(SetupStep.ConnectToDevice)}
		/>;
		// Step 3: Connect to the device, handshake and establish secure connection
	} else if (currentStep === SetupStep.ConnectToDevice)
	{
		step = <ConnectToDevice
			mobileSecret="AAAAAAAAAAAAAAA"
			setupCode={setupCode}
			onBack={() => setCurrentStep(SetupStep.EnterDeviceDetails)}
			onContinue={() => setCurrentStep(SetupStep.WiFiList)}
		/>;
		// Step 4: Request a list of available WiFi networks and present it
		// to the user.
	} else if (currentStep === SetupStep.WiFiList)
	{
		step = <WiFiList
			onBack={() => setCurrentStep(SetupStep.ConnectToDevice)}
			onContinue={() => setCurrentStep(SetupStep.WiFiCredentials)}
			selectedNetwork={selectedNetwork}
			setSelectedNetwork={setSelectedNetwork}
		/>;
		// (optional) Step 5: Enter credentials for WiFi network
	} else if (currentStep === SetupStep.WiFiCredentials)
	{
		step = <WiFiCredentials
			onBack={() => setCurrentStep(SetupStep.WiFiList)}
			onContinue={() => setCurrentStep(SetupStep.JoinWiFi)}
			selectedNetwork={selectedNetwork}
			wifiPassword={wifiPassword}
			setWifiPassword={setWifiPassword}
		/>;
	} else if (currentStep === SetupStep.JoinWiFi)
	{
		step = <JoinWiFi
			setupCode={setupCode}
			deviceUUID={deviceUUID}
			onStartOver={async () =>
			{
				await disconnect();
				setSelectedNetwork(undefined);
				setWifiPassword(undefined);
				setCurrentStep(SetupStep.EnterDeviceDetails);
			}}
			selectedNetwork={selectedNetwork}
			wifiPassword={wifiPassword}
		/>;
	}
	return (
		<SafeAreaView style={Style.centered}>
			{step}
			<ErrorModal visible={!!error} error={error} onClose={clearLastError} />
		</SafeAreaView>
	);
};
