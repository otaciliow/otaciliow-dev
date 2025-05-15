import { useState, useEffect } from 'react';
import { db } from '../../services/firebaseConnection';
import { collection, onSnapshot } from 'firebase/firestore';

import { ReposProps } from "../../interfaces/IReposProps"

import { Container } from "../../components/container"

export function Home() {
    const [repos, setRepos] = useState<ReposProps[]>([])

    useEffect(() => {
        const linksRef = collection(db, 'active-display')

        const unsub = onSnapshot(linksRef, (snapshot) => {
            let lista = [] as ReposProps[];

            snapshot.forEach((doc) => {
                lista.push({
                    name: doc.data().name,
                    description: doc.data().description,
                    url: doc.data().url,
                    topics: doc.data().topics
                })

            })
            
            setRepos(lista)
        })

        return () => {
            unsub();
        }
    }, [])

    return(
        <Container>
            <h1>Home page</h1>
            {repos.map((repo) => (
                <h2>{repo.name}</h2>
            ))}
        </Container>
    )
}