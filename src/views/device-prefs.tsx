import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, TextInput, Text, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { Style } from '../styles';
import { apiFetch, IconButton, BareButton } from '../util/utility';
import { getIcon } from '../util/icons';


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
    success?: string;
    monitoring_uuid?: string;
    bindicator_name?: string;
    photon_id?: string;
    trash_on?: boolean;
    recycle_on?: boolean;
}

export const DevicePrefs = ({ deviceUUID, deviceIdentifier, onBack }: DevicePrefsArguments): React.ReactElement => 
{
    const [bindicatorDeviceData, setBindicatorDeviceData] = useState<bindicatorFirebaseDocument | null>(null);
    const [deviceLoading, setDeviceLoading] = useState(false); // Initially not loading
    const [error, setError] = useState<string | null>(null);
    const [isEditingName, setIsEditingName] = useState<boolean>(false);
    const [editedName, setEditedName] = useState<string>("");

    const updateBindicatorDeviceData = (
        newData: Partial<bindicatorFirebaseDocument>
    ) =>
    {
        setBindicatorDeviceData((prevData) => ({
            ...prevData,
            ...newData,
        }));
    };


    const handleEditName = () =>
    {
        if (bindicatorDeviceData)
        {
            setEditedName(bindicatorDeviceData.bindicator_name || ""); //prefill with current name
        }
        setIsEditingName(true);
    };

    const handleSaveName = () =>
    {
        const body = { bindicator_name: editedName }

        updateBindicatorDeviceData(body);
        setIsEditingName(false);

        //call API  
        pushUpdatedData(body);

    };

    const pushUpdatedData = (
        newData: Partial<bindicatorFirebaseDocument>
    ) =>
    {
        let body;
        if (!bindicatorDeviceData)
        {
            return;
        }
        if (!bindicatorDeviceData.photon_id)
        {
            body = {
                monitoring_uuid: bindicatorDeviceData.monitoring_uuid,
                ...newData
            };
        }
        else
        {
            body = {
                photon_id: bindicatorDeviceData.photon_id,
                ...newData
            };
        }

        apiFetch('update-bindicator-data', body)

        console.log("#", "Saving name.", body)

    }

    const handleTrashToggle = () =>
    {
        if (bindicatorDeviceData)
        {
            const body = { trash_on: !bindicatorDeviceData.trash_on }
            updateBindicatorDeviceData(body);
            pushUpdatedData(body);
        }
    };

    const handleCollectionToggle = (key: "trash_on" | "recycle_on") =>
    {
        if (bindicatorDeviceData)
        {
            const body = { [key]: !bindicatorDeviceData[key] }
            updateBindicatorDeviceData(body);
            pushUpdatedData(body);
        }
    };


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


            {!isEditingName &&
                (
                    <View style={Style.simpleFlexRow}>
                        <Text style={Style.h2}>{bindicatorDeviceData.bindicator_name}</Text>
                        <Pressable
                            style={Style.toggleVisibilityButton}
                            onPress={handleEditName} // edit mode
                        >
                            {getIcon("pen-to-square")}
                        </Pressable>
                    </View>
                )
            }
            {
                isEditingName &&
                (
                    <View style={Style.simpleFlexRow}>
                        <TextInput
                            style={[Style.input, { marginBottom: 0 }]}
                            value={editedName}
                            onChangeText={setEditedName}
                        />
                        <Pressable
                            style={Style.toggleVisibilityButton}
                            onPress={handleSaveName}
                        >
                            {getIcon("check")}
                        </Pressable>
                    </View>
                )
            }

            {/* <Text style={Style.paragraph}>{JSON.stringify(bindicatorDeviceData)}</Text> */}
            (
            bindicatorDeviceData.photon_id &&
            <View style={[Style.simpleFlexColumn, { marginTop: 50 }]}>
                <View style={(bindicatorDeviceData.trash_on ? styles.buttonOnGlowBlue : styles.buttonOffGlow)}>
                    <IconButton
                        onPress={() => handleCollectionToggle("trash_on")}
                        icon="trash-can"
                        iconStyle="solid"
                        text={"Trash: " + (bindicatorDeviceData.trash_on ? "on" : "off")}
                        color={(bindicatorDeviceData.trash_on ? "#0965dc" : "#021631")}
                    />
                </View>

                <View style={[(bindicatorDeviceData.recycle_on ? styles.buttonOnGlowGreen : styles.buttonOffGlow)]}>
                    <IconButton
                        onPress={() => handleCollectionToggle("recycle_on")}
                        icon="recycle"
                        iconStyle="solid"
                        text={"Recycle: " + (bindicatorDeviceData.recycle_on ? "on" : "off")}
                        color={(bindicatorDeviceData.recycle_on ? "#46a049" : "#0f2410")}
                    />
                </View>
            </View>
            )


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
};




const styles = StyleSheet.create({

    buttonOnGlowBlue: {
        shadowColor: "#549bf8",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 1,
        shadowRadius: 13,

        marginVertical: 10

    },
    buttonOnGlowGreen: {
        shadowColor: "#83c985",

        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 1,
        shadowRadius: 13,

        marginVertical: 10

    },

    buttonOffGlow: {
        shadowColor: "transparent",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.41,
        shadowRadius: 9.11,

        marginVertical: 10

    }
    ,

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
    },
});
