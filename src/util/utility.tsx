

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Style } from '../styles';

const VERIFICATION_KEY_DELIMITER = ":: ::";

export const ProgressDiagram = ({ numChecks = 0, showLoader = false }) =>
{
    const checkmarks = Array.from({ length: numChecks });
    return (
        <View style={Style.simpleFlexRow}>
            {checkmarks.map((_, index) => (
                <Text
                    key={index} // Use a unique key for each item
                    style={styles.progressDiagramText}
                >
                    ✓
                </Text>
            ))}
            {showLoader && <ActivityIndicator size={32} color={"white"} />}
        </View>
    );
};

interface WeekdayPickerProps
{
    locked: string; // The currently selected weekday
    onWeekdaySelect?: (selectedDay: string) => void; // Callback to handle weekday selection
}

export const WeekdayPicker: React.FC<WeekdayPickerProps> = ({ locked, onWeekdaySelect }) =>
{
    const weekdays = ["Su", "M", "T", "W", "Th", "F", "Sa"]

    const [selectedDay, setSelectedDay] = useState<string>(locked);

    const handlePress = (day: string) =>
    {
        console.log(locked, day)
        setSelectedDay(day);
        if (onWeekdaySelect)
        {
            onWeekdaySelect(day);
        }
    };

    return (
        <View style={styles.container}>
            {weekdays.map((day) => (
                <TouchableOpacity
                    key={day}
                    style={[
                        styles.weekdayButton,
                        locked === day && styles.lockedButton,
                        selectedDay === day && styles.selectedButton,
                    ]}
                    onPress={() => handlePress(day)}
                >
                    <Text style={styles.weekdayText}>{day}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default { ProgressDiagram, WeekdayPicker };


export const apiFetch = async (path: string, body: Object, setData: Function, setLoading: Function, setError: Function) =>
{
    setLoading(true); // Start loading
    setError(null); // Reset error state
    try
    {
        const response = await fetch(process.env.EXPO_PUBLIC_API_ENDPOINT + '/hooks/' + path,
            {
                'method': 'POST',
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa(process.env.EXPO_PUBLIC_BASIC_AUTH_USER + ':' + process.env.EXPO_PUBLIC_BASIC_AUTH_PASSWORD)
                },
                'body': JSON.stringify(body)
            }
        );
        if (!response.ok)
        {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let result = await response.json();
        if (result.result)
        {
            result = result.result;
        }
        setData(result);

    } catch (err: any)
    {
        setError(err.message);
    } finally
    {
        setLoading(false); // Stop loading
    }
};



export function createVerificationKey(ssid: string | null | undefined, setupCode: string)
{
    if (typeof ssid == "string")
    {
        return btoa(btoa(setupCode.toLowerCase()) + VERIFICATION_KEY_DELIMITER + btoa(ssid));
    }

    return "";

}

function parseVerificationKey(verificationKey: string)
{
    const [ssid, setup_code] = atob(verificationKey).split(VERIFICATION_KEY_DELIMITER)
        .map(x => atob(x));

    return { ssid, setup_code };
}



const styles = StyleSheet.create({




    progressDiagramText: {
        fontSize: 40,
        color: 'white'
    },


    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        marginVertical: 10,
    },
    weekdayButton: {
        padding: 10,
        margin: 5,
        borderRadius: 5,
        backgroundColor: "#f0f0f0",
        borderWidth: 1,
        borderColor: "#ccc",
    },
    lockedButton: {
        backgroundColor: "red",
        borderColor: "blue",
    },
    selectedButton: {
        backgroundColor: "#4CAF50",
        borderColor: "#4CAF50",
    },
    weekdayText: {
        color: "#000",
    },
});
