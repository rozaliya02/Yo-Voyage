import { OAuthProvider, Query, ID } from 'appwrite';
import {account, appwriteConfig, database} from './client';
import { redirect } from 'react-router';

export const loginWithGoogle = async () => {
    try {
        await account.createOAuth2Session(OAuthProvider.Google);
    } catch (error) {
        console.error("Login with Google failed", error);
        throw error;
    }
}

export const logout = async () => {
    try {
        await account.deleteSession('current');
        return true;
    } catch (error) {
        console.error("Logout failed", error);
        throw error;
    }
}

export const getUser = async () => {
    try {
        const user = await account.get();
        if(!user) {
            return redirect('/sign-in');
        }

        const {documents} = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [
                Query.equal('accountId', [user.$id]),
                Query.select(['name', 'email', 'imageUrl', 'joinedAt', 'accountId'])
            ]
        );
    } catch (error) {
        console.error("Get current user failed", error);
        throw error;
    }
}

export const getGooglePicture = async () => {
try {
    const session = await account.getSession('current');

    const OAuthToken = session.providerAccessToken;

    if(!OAuthToken) {
        throw new Error("No OAuth token found");
        return null;
    }

    const response = await fetch(`https://www.googleapis.com/v1/people/me?personFields=photos`,
        {
            headers: {  
                Authorization: `Bearer ${OAuthToken}`,
            },  
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch Google picture");
    }

    const data = await response.json();

    const photoUrl = data.photos && data.photos.length > 0 ? data.photos[0].url : null;

    return photoUrl;
}
    catch (error) {
        console.error("Get Google picture failed", error);
        throw error;
    }
}

export const storaUserData = async () => {
    try {
        const user = await account.get();

        if(!user) return null;
        const {documents} = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [Query.equal('accountId', [user.$id])]
        );

        if(documents.length > 0) {
            return documents[0];
        }

        const imageUrl = await getGooglePicture();

        const newUser = await database.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            ID.unique(),
            {
                accountId: user.$id,
                name: user.name,
                email: user.email,
                imageUrl: imageUrl || null,
                joinedAt: new Date().toISOString(),
            }
        );    
        return newUser;

    } catch (error) {
        console.error("Store user data failed", error);
        throw error;
    }
}