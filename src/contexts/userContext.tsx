import { useState, useEffect, createContext, ReactNode } from 'react';
import { UserDataProps } from '../interfaces/IUserDataProps';

import { db } from '../services/firebaseConnection';
import { getDoc, doc } from 'firebase/firestore';

interface UserContentProviderProps {
    children: ReactNode;
}

interface UserContentProps extends UserDataProps {
    profileDescription: string | null;
    profileLinkedin: string;
}

export const UserContext = createContext<UserContentProps | null>(null);

function UserContentProvider({children}: UserContentProviderProps) {
    const [userContent, setUserContent] = useState<UserContentProps | null>(null);

    useEffect(() => {
        function loadUserContent() {
            const docRef = doc(db, 'user', 'user-info');

            getDoc(docRef)
            .then((snapshot) => {
                if (snapshot.data() !== undefined) {
                    setUserContent({
                        login: snapshot.data()?.login,
                        name: snapshot.data()?.name,
                        avatar: snapshot.data()?.avatar,
                        profileUrl: snapshot.data()?.profileUrl,
                        profileLinkedin: snapshot.data()?.profileLinkedin,
                        profileDescription: snapshot.data()?.description
                    } as UserContentProps)
                }
            })
        }

        loadUserContent();
    }, [])

    return (
        <UserContext.Provider value={userContent}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContentProvider;