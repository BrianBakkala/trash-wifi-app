

import { View, Text, ActivityIndicator } from 'react-native';
import { Style } from '../styles';

const VERIFICATION_KEY_DELIMITER = ":: ::";

const ProgressDiagram = ({ numChecks = 0, showLoader = false }) =>
{
    const checkmarks = Array.from({ length: numChecks });
    return (
        <View style={Style.simpleFlexRow}>
            {checkmarks.map((_, index) => (
                <Text
                    key={index} // Use a unique key for each item
                    style={Style.progressDiagramText}
                >
                    ✓
                </Text>
            ))}
            {showLoader && <ActivityIndicator size={32} color={"white"} />}
        </View>
    );
};


export default ProgressDiagram;


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

        const result = await response.json();
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
