import { useState, useEffect, useContext } from 'react';
import { db } from '../../services/firebaseConnection';
import { collection, onSnapshot } from 'firebase/firestore';

import { UserContext } from '../../contexts/userContext';

import { ReposProps } from "../../interfaces/IReposProps"

import { Container } from "../../components/container"

export function Home() {
    const user = useContext(UserContext);
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
            <h2 id="about">Sobre mim</h2>
            <p>{user?.profileDescription}</p>
            <h2 id="projects">Projetos:</h2>
            {repos.map((repo, i) => (
                <h2 key={i}>{repo.name}</h2>
            ))}
        </Container>
    )
}