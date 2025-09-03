import { OAuthProvider, Query, ID, Permission, Role } from 'appwrite';
import {account, appwriteConfig, database} from './client';
import { redirect } from 'react-router';

export const loginWithGoogle = async () => {
    try {
+        await account.createOAuth2Session(
            OAuthProvider.Google,
            `${window.location.origin}/dashboard`,
            `${window.location.origin}/sign-in`
        );
    } catch (error) {
        console.error("Login with Google failed", error);
        
    }
}

export const logout = async () => {
    try {
        await account.deleteSession('current');
        return true;
    } catch (error) {
        console.error("Logout failed", error);
        return false;
    }
}

export const getUser = async () => {
    try {
        const user = await account.get();
        if (!user) return redirect("/sign-in");

        const { documents } = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [
                Query.equal("accountId", user.$id),
                Query.select(["name", "email", "imageUrl", "joinedAt", "accountId"]),
            ]
        );

        return documents.length > 0 ? documents[0] : redirect("/sign-in");
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
};

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
        console.log("Failed to fetch Google picture");
    }

    const data = await response.json();

    const photoUrl = data.photos && data.photos.length > 0 ? data.photos[0].url : null;

    return photoUrl;
}
    catch (error) {
        console.error("Get Google picture failed", error);
    }
}

export const storeUserData = async () => {
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
    }
}

export const getExistingUser = async (accountId: string) => {
    try {
        const {documents} = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [Query.equal('accountId', [accountId])]
        );

        if(documents.length > 0) {
            return documents[0];
        }

        return null;

    } catch (error) {
        console.error("Get existing user failed", error);
    }
}

export const getAllUser = async (limit: number, offset: number) => {
    try {
        const {documents : users, total} = await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [Query.limit(limit), Query.offset(offset)]
        )

        if(total === 0) return {users: [], total}
        
        return {users, total}
    } catch (e) {
        console.log('Error fetching users' )
        return {users: [], total: 0}
    }
}