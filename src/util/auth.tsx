import { getFirestore, collection, getDocs, getDoc, doc } from "firebase/firestore";
import app from "../../firebaseConfig";

const db = getFirestore(app);

export interface APIAuthProps
{
    api_key_1: string;
    api_key_2: string;
    basic_auth_user: string;
    basic_auth_password: string;
}

export interface APIEndpointProps
{
    url: string;
}

export async function getAPIAuth(): Promise<APIAuthProps | null>
{
    // Fetch the document
    const docSnap = await getDoc(doc(db, "api_auth", "auth"));
    if (docSnap)
    {
        const authData = docSnap.data() as APIAuthProps;
        return authData;
    }
    return null; // Handle the case where no document exists
}

export async function getAPIEndpoint(): Promise<String | null>
{
    const docSnap = await getDoc(doc(db, "api_auth", "endpoint"));
    if (docSnap)
    {
        const authData = docSnap.data() as APIEndpointProps;
        return authData.url;
    }
    return null; // Handle the case where no document exists
}
