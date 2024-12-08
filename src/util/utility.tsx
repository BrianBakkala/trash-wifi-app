/*

// State to store the fetched data
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false); // Initially not loading
    const [error, setError] = useState<string | null>(null);

    const response = apiFetch('get-bindicators-for-household', {data:"hello"}, setData, setLoading, setError);

*/
const VERIFICATION_KEY_DELIMITER = ":: ::";



export const apiFetch = async (path: string, body: Object, setData: Function, setLoading: Function, setError: Function) =>
{
    setLoading(true); // Start loading
    setError(null); // Reset error state
    try
    {
        const response = await fetch('https://bindicator-439415.ue.r.appspot.com/hooks/' + path,
            {
                'method': 'POST',
                'headers': { 'Content-Type': 'application/json', },
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
        return btoa(btoa(ssid) + VERIFICATION_KEY_DELIMITER + btoa(setupCode));
    }

    return "";

}

function parseVerificationKey(verificationKey: string)
{
    const [ssid, setup_code] = atob(verificationKey).split(VERIFICATION_KEY_DELIMITER)
        .map(x => atob(x));

    return { ssid, setup_code };
}
