/*

// State to store the fetched data
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false); // Initially not loading
    const [error, setError] = useState<string | null>(null);

    const response = apiFetch('get-bindicators-for-household', {data:"hello"}, setData, setLoading, setError);

*/
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