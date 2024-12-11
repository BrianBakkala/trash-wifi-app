import React, { useState, useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { Style } from '../styles';
import { apiFetch } from '../util/utility';
import { bbbbbIdentifier } from './device-prefs';

export interface HolidaySetupArguments
{
    deviceUUID: String | undefined;
    onBack: () => void;
}

interface HolidayList
{
    holidays: Hobject[]
}
interface Hobject
{
    name: string,
    datestamps: string[],
    formatted_date: string,
    is_selected: boolean,
}






export const HolidaySetup = ({ deviceUUID, onBack }: HolidaySetupArguments): React.ReactElement => 
{
    const [holidayData, setHolidayData] = useState<HolidayList>({ holidays: [] });
    const [loading, setLoading] = useState(false); // Initially not loading
    const [error, setError] = useState<string | null>(null);
    const [pulledHolidays, setPulledHolidays] = useState<boolean>(false);
    const [addedCurrentHolidays, setAddedCurrentHolidays] = useState<boolean>(false);
    const [selectedHolidays, setSelectedHolidays] = useState<string[]>([]);




    const handlePress = (item: string) =>
    {
        setSelectedHolidays((prev: string[]) =>
        {
            let updated = [];

            if (prev.includes(item))
            {
                // Remove item if it exists in the array
                updated = prev.filter((i) => i !== item);
            } else
            {
                // Add item if it doesn't exist in the array
                updated = [...prev, item];
            }

            console.log("#", "Saving holiday data")
            console.log({
                device_uuid: deviceUUID,
                selected_holidays: updated
            })
            apiFetch('save-holiday-data',
                {
                    device_uuid: deviceUUID,
                    selected_holidays: updated
                }
            );

            return updated;
        });
    };


    useEffect(() =>
    {
        if (deviceUUID && !pulledHolidays)
        {
            console.log("#", "Pulling holiday data")
            console.log({
                device_uuid: deviceUUID
            })
            const response = apiFetch('get-holiday-data',
                {
                    device_uuid: deviceUUID
                }
                , setHolidayData, setLoading, setError);
            setPulledHolidays(true)

        }

    }, []);


    useEffect(() =>
    {
        if (pulledHolidays && !addedCurrentHolidays)
        {
            selectedHolidays.push(

                ...holidayData.holidays
                    .filter(x => x.is_selected)
                    .map(x => x.name)
            )
            setAddedCurrentHolidays(true)
        }

    }, [holidayData]);



    return (
        <View style={Style.vertical}>

            <Text style={Style.headerParagraph}>Collections will be moved one day later following the selected holidays:</Text>

            {holidayData &&
                holidayData.holidays.map((holiday, index) =>
                {

                    return (

                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.holidayButton,
                                selectedHolidays.includes(holiday.name) && styles.selectedHoliday,
                            ]}
                            onPress={() => handlePress(holiday.name)}
                        >
                            <Text style={[styles.holidayText, { fontWeight: 'bold' }]}>{holiday.name}</Text>
                            <Text style={styles.holidayText}>{holiday.formatted_date}</Text>
                        </TouchableOpacity>


                    )
                })
            }

            <View style={Style.navLeft}>
                <Pressable style={Style.buttonSecondary} onPress={onBack}>
                    <Text style={Style.buttonIconSm}>←</Text>
                    <Text style={Style.buttonText}>Back</Text>
                </Pressable>
            </View>


        </View>

    )
};


const styles = StyleSheet.create({

    holidayText: {
        color: "#fff",
    },
    holidayButton: {
        marginHorizontal: 8,
        padding: 10,
        backgroundColor: "#777",
        borderRadius: 8,
        alignItems: "center",
    },
    selectedHoliday: {
        backgroundColor: 'blue'
    }



});
