

import React, { useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
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





export const apiFetch = async (path: string, body: Object, setData?: Function, setLoading?: Function, setError?: Function) =>
{
    if (setLoading)
    {
        setLoading(true); // Start loading
    }
    if (setError)
    {
        setError(null); // Reset error state
    }

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

        // console.log(result)  
        if (setData)
        {
            setData(result);
        }

    } catch (err: any)
    {
        if (setError)
        {
            setError(err.message);
        }
    } finally
    {
        if (setLoading)
        {
            setLoading(false); // Stop loading
        }
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

export function capitalize(str: string)
{
    return str.charAt(0).toUpperCase() + str.slice(1);
}



const styles = StyleSheet.create({




    progressDiagramText: {
        fontSize: 40,
        color: 'white'
    },



});
