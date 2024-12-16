import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, Text, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { Style } from '../styles';
import { apiFetch, IconButton, BareButton } from '../util/utility';
import { getIcon } from '../util/icons';

export interface GlobalPrefsArguments
{
    deviceUUID: string | undefined;
    onBack: () => void;
    navigateToHolidaySetup: () => void;
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
    const iconName = lowerName == "trash" ? "trash-can" : lowerName
    const days = previewDays ? previewDays[lowerName + '_days'] : [];

    return (
        <View style={styles.settingsChunk}>

            <View style={styles.settingHeader}>
                <Text style={styles.settingHeaderText}>{displayName}</Text>
                <Text>{getIcon(iconName, 20, 'solid', color)}</Text>
            </View>
            <WeekdayPicker
                locked={bindicatorDeviceData[lowerName == 'trash' ? 'trash_schedule' : 'recycle_schedule']}
                color={color}
                onWeekdaySelect={async (day = "W") =>
                {
                    setSelectedCollectionDay(day);
                }}
            />
            <SchemePicker
                locked={bindicatorDeviceData[lowerName == 'trash' ? 'trash_scheme' : 'recycle_scheme']}
                color={color}
                onFrequencySelect={(frequency = "weekly", startOption = "this") =>
                {
                    setSelectedCollectionScheme(frequency);
                    setSelectedCollectionStartOption(startOption);
                }}
            />
            {previewDays && (

                <Text style={[{ fontSize: 20 }, Style.paragraph]}>{(days ? days : []).join(", ")}, ...</Text>
            )}

        </View>
    );
};




export const GlobalPrefs = ({ deviceUUID, onBack, navigateToHolidaySetup }: GlobalPrefsArguments): React.ReactElement => 
{
    const [bindicatorDeviceData, setBindicatorDeviceData] = useState<bindicatorFirebaseDocument | null>(null);
    const [deviceLoading, setDeviceLoading] = useState(false); // Initially not loading
    const [error, setError] = useState<string | null>(null);


    const [pulledSettings, setPulledSettings] = useState(false);

    const [previewLoading, setPreviewLoading] = useState(false); // Initially not loading
    const [previewDays, setPreviewDays] = useState<previewDaysObj | null | undefined>(null);

    const [selectedTrashDay, setSelectedTrashDay] = useState("W");
    const [selectedTrashScheme, setSelectedTrashScheme] = useState("weekly");
    const [selectedTrashStartOption, setSelectedTrashStartOption] = useState<string>("this"); // For biweekly options

    const [selectedRecycleDay, setSelectedRecycleDay] = useState("W");
    const [selectedRecycleScheme, setSelectedRecycleScheme] = useState("weekly");
    const [selectedRecycleStartOption, setSelectedRecycleStartOption] = useState<string>("this"); // For biweekly options


    useEffect(() =>
    {
        if (deviceUUID && !pulledSettings)
        {
            console.log("#", "Pulling current settings", {
                household_id: deviceUUID,
            })
            const response = apiFetch('get-global-settings',
                {
                    household_id: deviceUUID,
                }
                , setBindicatorDeviceData, setDeviceLoading, setError);
            setPulledSettings(true)

        }

    }, []);

    useEffect(() =>
    {
        if (deviceUUID)
        {
            const body = {
                device_uuid: deviceUUID,

                trash_day: selectedTrashDay,
                trash_scheme: selectedTrashScheme,
                trash_start_option: selectedTrashStartOption,
                recycle_day: selectedRecycleDay,
                recycle_scheme: selectedRecycleScheme,
                recycle_start_option: selectedRecycleStartOption,
            }
            console.log("#", "Saving settings", body)

            const response = apiFetch('save-settings', body
                , setPreviewDays, setPreviewLoading, setError);
        }

    }, [selectedTrashDay, selectedTrashScheme, selectedTrashStartOption, selectedRecycleDay, selectedRecycleScheme, selectedRecycleStartOption]);

    if (!bindicatorDeviceData)
    {
        return (
            <View style={Style.vertical}>
                <ActivityIndicator size={32} color={"white"} />
                <View style={Style.navLeft}>
                    <IconButton
                        onPress={onBack}
                        icon="house"
                        buttonType="secondary"
                        iconStyle="solid"
                        text="Home"
                    />
                </View>
            </View>
        )
    }


    return (
        <View style={Style.vertical}>
            {deviceLoading && <ActivityIndicator size="large" color="#ffffff" />}
            {error && <Text style={Style.error}>{error}</Text>}


            <SettingsChunk
                name="Trash"
                displayName="Trash"
                color="#0965dc"
                bindicatorDeviceData={bindicatorDeviceData}
                previewDays={previewDays}
                setSelectedCollectionDay={setSelectedTrashDay}
                setSelectedCollectionScheme={setSelectedTrashScheme}
                setSelectedCollectionStartOption={setSelectedTrashStartOption}

            />
            <SettingsChunk
                name="Recycle"
                displayName="Recycling"
                color="#46a049"
                bindicatorDeviceData={bindicatorDeviceData}
                previewDays={previewDays}
                setSelectedCollectionDay={setSelectedRecycleDay}
                setSelectedCollectionScheme={setSelectedRecycleScheme}
                setSelectedCollectionStartOption={setSelectedRecycleStartOption}

            />


            <View style={[{ marginTop: 30 }, { marginBottom: 30 }]}>
            </View>


            <View style={Style.navCenterSplit}>
                <IconButton
                    onPress={onBack}
                    icon="house"
                    buttonType="secondary"
                    iconStyle="solid"
                    text="Home"
                />
                <IconButton
                    onPress={() => navigateToHolidaySetup()}
                    icon="calendar-day"
                    iconStyle="solid"
                    text="Manage Holidays"
                />
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
    settingsChunk: {
        marginBottom: 40,
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
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',

        gap: 10,

        marginTop: 20,
        marginBottom: 10,
    },
    settingHeaderText: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
    },
});
