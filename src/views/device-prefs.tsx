import React, { useState, useEffect } from 'react';
import { View, Image, Text, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { Style } from '../styles';
import { apiFetch, WeekdayPicker } from '../util/utility';

export interface DevicePrefsArguments
{
    deviceIdentifier: bbbbbIdentifier | undefined;
    onBack: () => void;
}

export interface bbbbbIdentifier
{
    photon_id?: string;
    monitoring_uuid?: string;
    verification_key?: string;
}
export interface bbbbbFirebaseDocument
{
    success: string;
    trash_schedule: string;
}

export const DevicePrefs = ({ deviceIdentifier, onBack }: DevicePrefsArguments): React.ReactElement => 
{
    const [bindicatorDeviceData, setBindicatorDeviceData] = useState<bbbbbFirebaseDocument | null>(null);
    const [deviceLoading, setDeviceLoading] = useState(false); // Initially not loading
    const [error, setError] = useState<string | null>(null);
    const [selectedDay, setSelectedDay] = useState("W");

    useEffect(() =>
    {
        if (deviceIdentifier)
        {
            const response = apiFetch('get-bindicator-settings',
                {
                    ...deviceIdentifier
                }
                , setBindicatorDeviceData, setDeviceLoading, setError);

        }
    }, []);

    if (!bindicatorDeviceData)
    {
        return <ActivityIndicator size={32} color={"white"} />
    }

    return (
        <View style={Style.vertical}>
            {deviceLoading && <ActivityIndicator size="large" color="#ffffff" />}
            {error && <Text style={Style.error}>{error}</Text>}
            {
                bindicatorDeviceData && (
                    <View>
                        {/* <Text style={Style.paragraph}>{JSON.stringify(bindicatorDeviceData)}</Text> */}
                        {/* <Text style={Style.paragraph}>{JSON.stringify(bindicatorDeviceData.trash_schedule)}</Text> */}
                    </View>
                )
            }
            <WeekdayPicker
                locked={bindicatorDeviceData.trash_schedule}
                onWeekdaySelect={(day = "W") => setSelectedDay(day)}
            />

            <View style={Style.navLeft}>
                <Pressable style={Style.buttonSecondary} onPress={onBack}>
                    <Text style={Style.buttonIconSm}>←</Text><Text style={Style.buttonText}>Home</Text>
                </Pressable>
            </View>


        </View>

    )
};
