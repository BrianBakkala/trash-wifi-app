import React, { useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Pressable } from 'react-native';
import { Style } from '../styles';
import { getAPIAuth, APIAuthProps, getAPIEndpoint } from './auth';
import { getIcon } from '../util/icons';

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

interface BaseButtonProps
{
    text: string;
    onPress?: () => void;
    preContent?: JSX.Element;
    buttonType?: "primary" | "secondary" | "disabled"
    color?: string
}

const deadEle = (<Text style={{ display: 'none' }} />);

const BaseButton = ({ text, onPress, preContent = deadEle, buttonType, color = "#0090b0" }: BaseButtonProps) =>
{
    return (
        <Pressable style={
            [(buttonType === "secondary"
                ? buttonStyles.buttonSecondary
                : buttonType === "disabled"
                    ? buttonStyles.buttonDisabled
                    : buttonStyles.button),
            (buttonType !== "disabled" && buttonType !== "secondary" ? { backgroundColor: color } : {})]
        }

            onPress={buttonType !== "disabled" ? onPress : undefined}
        >

            {preContent}
            <Text style={buttonStyles.buttonText}>{text}</Text>

        </Pressable>
    );
};

export const BareButton = ({ text, onPress = () => { }, buttonType }: BaseButtonProps) =>
{
    return <BaseButton
        buttonType={buttonType}
        text={text}
        onPress={onPress}
    />;
};



interface IconButtonProps extends BaseButtonProps
{
    text: string;
    icon: string;
    iconStyle?: "regular" | "solid" | "brand" | undefined;
}

export const IconButton = (
    { text, icon, iconStyle = "regular", onPress, buttonType, color }: IconButtonProps) =>
{
    return (
        <BaseButton
            buttonType={buttonType}
            text={text}
            color={color}
            onPress={onPress}
            preContent={getIcon(icon, 12, iconStyle)}
        />
    );
};


export const IconHeading = ({ icon }: { icon: string }) =>
{
    return (
        <View>
            <Text style={styles.iconWrapper}>
                {getIcon(icon, 50)}
            </Text>
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

    const apiAuth = await getAPIAuth();
    const apiEndpoint = await getAPIEndpoint();

    if (apiAuth)
    {
        try
        {
            const response = await fetch(apiEndpoint + '/hooks/' + path,
                {
                    'method': 'POST',
                    'headers': {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic ' + base64Encode(`${apiAuth.basic_auth_user}:${apiAuth.basic_auth_password}`),
                        'API-Key-1': apiAuth.api_key_1,
                        'API-Key-2': apiAuth.api_key_2,
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

    }
};

const base64Encode = (input: string) => Buffer.from(input).toString('base64');


export function createVerificationKey(ssid: string | null | undefined, setupCode: string)
{
    if (typeof ssid == "string")
    {

        return base64Encode(
            base64Encode(setupCode.toLowerCase()) +
            VERIFICATION_KEY_DELIMITER +
            base64Encode(ssid)
        );
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


const buttonStyles = StyleSheet.create({

    button: {
        display: 'flex',
        flexDirection: 'row',
        gap: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 8,
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 40,
        elevation: 3,
        color: 'white',
        textAlign: 'center'
    },
    buttonSecondary: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        marginHorizontal: 8,
        paddingHorizontal: 20,
        elevation: 3,
        backgroundColor: 'transparent',
        color: 'white'
    },
    buttonIcon: {
        fontSize: 35,
        lineHeight: 30,
        color: 'white'
    },
    buttonIconLg: {
        fontSize: 30,
        color: 'white'
    },
    buttonIconMd: {
        fontSize: 25,
        lineHeight: 30,
        color: 'white'
    },
    buttonIconSm: {
        fontSize: 20,
        lineHeight: 30,
        color: 'white'
    },
    buttonDisabled: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginHorizontal: 8,
        borderRadius: 50,
        elevation: 3,
        backgroundColor: '#ccc',
        color: 'white'
    },
    buttonText: {
        fontSize: 20,
        lineHeight: 21,
        fontFamily: 'Inter',
        color: 'white',
    },
    buttonTextWrapper: {
        fontSize: 20,
        lineHeight: 21,
        fontFamily: 'Inter',
        color: 'white',
        display: 'flex',
        flexDirection: 'row',
        gap: 15,
    },


})


const styles = StyleSheet.create({


    iconWrapper: {
        fontSize: 50,
        lineHeight: 50
    },

    progressDiagramText: {
        fontSize: 40,
        color: 'white'
    },



});
