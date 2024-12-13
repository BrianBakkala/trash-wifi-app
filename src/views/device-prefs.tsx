import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, Text, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { Style } from '../styles';
import { apiFetch } from '../util/utility';

export interface DevicePrefsArguments
{
    deviceUUID: string | undefined;
    deviceIdentifier: bindicatorIdentifier | undefined;
    onBack: () => void;
}

export interface bindicatorIdentifier
{
    photon_id?: string;
    monitoring_uuid?: string;
    verification_key?: string;
}
export interface bindicatorFirebaseDocument
{
    success: string;

    trash_schedule: string;
    trash_scheme: string;

    recycle_schedule: string;
    recycle_scheme: string;
}
interface previewDaysObj
{
    trash_days: string[];
    recycle_days: string[];
    [key: string]: string[] | undefined;
}

interface WeekdayPickerProps
{
    locked: string; // The currently selected weekday
    color: string;
    onWeekdaySelect?: (selectedDay: string) => void; // Callback to handle weekday selection
}

export const WeekdayPicker: React.FC<WeekdayPickerProps> = ({ locked, color, onWeekdaySelect }) =>
{
    const weekdays = ["Su", "M", "T", "W", "Th", "F", "Sa"]

    const [selectedDay, setSelectedDay] = useState<string>(locked);

    const handlePress = (day: string) =>
    {
        setSelectedDay(day);
        if (onWeekdaySelect)
        {
            onWeekdaySelect(day);
        }
    };

    return (
        <View style={styles.horizontalContainer}>
            {weekdays.map((day) => (
                <TouchableOpacity
                    key={day}
                    style={[
                        styles.weekdayButton,
                        locked === day && styles.lockedButton,
                        selectedDay === day && { backgroundColor: color },
                    ]}
                    onPress={() => handlePress(day)}
                >
                    <Text style={styles.weekdayText}>{day}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export const SchemePicker: React.FC<{
    locked?: string; // Optional prop to lock the selection
    color: string,
    onFrequencySelect?: (frequency: string, startOption?: string) => void; // Callback for when a selection is made
}> = ({ locked, color, onFrequencySelect }) =>
    {
        const frequencies = ["weekly", "biweekly"];
        const biweeklyStartOptions = ["this", "next"];

        const [selectedFrequency, setSelectedFrequency] = useState<string>(locked || "");
        const [selectedStartOption, setSelectedStartOption] = useState<string>("");

        //button presses
        const handleFrequencyPress = (frequency: string) =>
        {
            setSelectedFrequency(frequency);
            setSelectedStartOption("this"); // Reset start option if frequency changes

            if (onFrequencySelect)
            {
                onFrequencySelect(frequency);
            }
        };

        const handleStartOptionPress = (option: string) =>
        {
            setSelectedStartOption(option);
            if (onFrequencySelect)
            {
                onFrequencySelect("biweekly", option);
            }
        };

        return (
            <View style={[styles.verticalContainer, { marginTop: 12 }]}>
                <View style={styles.horizontalContainer}>
                    {/* Frequency Options */}
                    {frequencies.map((frequency) => (
                        <TouchableOpacity
                            key={frequency}
                            style={[
                                styles.frequencyButton,
                                locked === frequency && styles.lockedButton,
                                selectedFrequency === frequency && { backgroundColor: color },
                            ]}
                            onPress={() => handleFrequencyPress(frequency)}
                        >
                            <Text style={styles.frequencyText}>{frequency}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Biweekly Start Options */}
                {/* {1 == 1 && ( */}
                {selectedFrequency === "biweekly" && (
                    <View style={styles.horizontalContainer}>
                        {biweeklyStartOptions.map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={[
                                    styles.startOptionButton,
                                    selectedStartOption === option && { backgroundColor: color },
                                ]}
                                onPress={() => handleStartOptionPress(option)}
                            >
                                <Text style={styles.startOptionText}>Starting {option} week</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>
        );
    };


interface SettingsChunkProps
{
    name: string,
    displayName: string,
    color: string,
    bindicatorDeviceData: bindicatorFirebaseDocument,
    previewDays: previewDaysObj | null | undefined
    setSelectedCollectionDay: (value: React.SetStateAction<string>) => void
    setSelectedCollectionScheme: (value: React.SetStateAction<string>) => void
    setSelectedCollectionStartOption: (value: React.SetStateAction<string>) => void
}



const SettingsChunk: React.FC<SettingsChunkProps> = ({ name, displayName, color, bindicatorDeviceData, previewDays, setSelectedCollectionDay, setSelectedCollectionScheme, setSelectedCollectionStartOption }) =>
{
    const lowerName = name.toLowerCase()
    const days = previewDays ? previewDays[lowerName + '_days'] : [];

    return (
        <View>
            <Text style={styles.settingHeader}>{displayName}</Text>
            <WeekdayPicker
                locked={bindicatorDeviceData.trash_schedule}
                color={color}
                onWeekdaySelect={async (day = "W") =>
                {
                    setSelectedCollectionDay(day);
                }}
            />
            <SchemePicker
                locked={bindicatorDeviceData.trash_scheme} // Pass a locked value if applicable
                color={color}
                onFrequencySelect={(frequency = "weekly", startOption = "this") =>
                {
                    setSelectedCollectionScheme(frequency);
                    setSelectedCollectionStartOption(startOption);
                }}
            />
            {previewDays && <Text style={Style.paragraph}>{(days ? days : []).join(", ")}, ...</Text>}

        </View>
    );
};




export const DevicePrefs = ({ deviceUUID, deviceIdentifier, onBack }: DevicePrefsArguments): React.ReactElement => 
{
    const [bindicatorDeviceData, setBindicatorDeviceData] = useState<bindicatorFirebaseDocument | null>(null);
    const [deviceLoading, setDeviceLoading] = useState(false); // Initially not loading
    const [error, setError] = useState<string | null>(null);


    useEffect(() =>
    {
        if (deviceIdentifier)
        {
            const body = {
                ...deviceIdentifier
            }
            console.log("#", "Pulling Bindicator data", body)
            const response = apiFetch('get-bindicator-data', body, setBindicatorDeviceData, setDeviceLoading, setError);

        }

    }, []);


    if (!bindicatorDeviceData)
    {
        return (
            <View style={Style.vertical}>
                <ActivityIndicator size={32} color={"white"} />
                <View style={Style.navLeft}>
                    <Pressable style={Style.buttonSecondary} onPress={onBack}>
                        <Text style={Style.buttonIconSm}>←</Text><Text style={Style.buttonText}>Home</Text>
                    </Pressable>
                </View>
            </View>
        )
    }


    return (
        <View style={Style.vertical}>
            {deviceLoading && <ActivityIndicator size="large" color="#ffffff" />}
            {error && <Text style={Style.error}>{error}</Text>}


            {/* //TODO */}

            <Text style={Style.paragraph}>{JSON.stringify(bindicatorDeviceData)}</Text>



            <View style={Style.navLeft}>
                <Pressable style={Style.buttonSecondary} onPress={onBack}>
                    <Text style={Style.buttonIconSm}>←</Text><Text style={Style.buttonText}>Home</Text>
                </Pressable>
            </View>


        </View>

    )
};




const styles = StyleSheet.create({
    weekdayButton: {
        marginHorizontal: 8,
        padding: 10,
        borderRadius: 5,
        backgroundColor: "#f0f0f0",
    },

    weekdayText: {
        color: "#000",
    },
    verticalContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    horizontalContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        padding: 16,
        alignItems: "center",
    },

    lockedButton: {
        backgroundColor: "#fff",
    },
    frequencyText: {
        color: "#000",
    },
    biweeklyOptions: {
        marginTop: 16,
        width: "80%",
    },
    frequencyButton: {
        marginHorizontal: 8,
        padding: 12,
        paddingHorizontal: 24,
        backgroundColor: "#777",
        borderRadius: 8,
        alignItems: "center",
    },
    startOptionButton: {
        marginHorizontal: 8,
        padding: 12,
        paddingHorizontal: 24,
        backgroundColor: "#777",
        borderRadius: 8,
        alignItems: "center",
    },
    startOptionText: {
        color: "#333",
    },
    settingHeader: {
        color: 'white',
        fontSize: 22,
        lineHeight: 30,
        marginTop: 20,
        marginBottom: 10,
        fontWeight: 'bold',
    },
});
