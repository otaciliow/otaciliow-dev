import { useState, useEffect, useMemo } from 'react'
import { Octokit } from '@octokit/rest';
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { doc, collection, getDocs, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';

import { Container } from '../../components/container'

interface UserDataProps {
    login: string;
    name: string | null;
    avatar: string;
    profileUrl: string;
}

interface ReposProps {
    name: string | null;
    description: string | null;
    url: string;
    topics: string[];
}

const itens_per_page = 9;

export function Admin() {
    const [profile, setProfile] = useState<UserDataProps | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [repos, setRepos] = useState<ReposProps[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeRepos, setActiveRepos] = useState<ReposProps[]>([])

    const totalPages = Math.ceil(repos.length / itens_per_page)
    
    const handleNext = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };
    
    const handlePrevious = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    }

    const paginatedRepos = useMemo(() => {
        const start = (currentPage - 1) * itens_per_page;
        return repos?.slice(start, start + itens_per_page);
    }, [currentPage, repos]);

    useEffect(() => {
        const fetchRepos = async () => {
            const octokit = new Octokit({
                auth: import.meta.env.VITE_GITHUB_TOKEN
            })

            try {
                const { data: user } = await octokit.rest.users.getAuthenticated();

                const userInfos: UserDataProps = {
                    login: user.login,
                    name: user.name,
                    avatar: user.avatar_url,
                    profileUrl: user.html_url
                }

                setProfile(userInfos)

            } catch (error: any) {
                console.log(`Erro" Status: ${error.status}`)
            }
    
            try {
                const data = await octokit.paginate(octokit.rest.repos.listForAuthenticatedUser, {
                    per_page: 100,
                });

                const fetchedRepos: ReposProps[] = data.map((repo) => ({
                    name: repo.name,
                    description: repo.description,
                    url: repo.svn_url,
                    topics: repo.topics || []
                }));

                setRepos(fetchedRepos)
                
            } catch (error: any) {
                console.log(`Erro" Status: ${error.status}`)
            }
        }

        fetchRepos()
    }, [])

    const handleRepoClick = (repoName: string | null) => {
        const name = repoName;
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
            
            setActiveRepos(lista)
        })

        if (name) {
            const repoData = activeRepos.find(item => item.name === name);
    
            if (repoData) {
                setIsLoading(true);
                
            }
        }

        return () => {
            unsub();
        }
    }

    useEffect(() => {
        console.log(activeRepos)
    }, [])

    if (!profile) {
        return (
            <Container>
                <h1 className="text-center my-10">Carregando informações...</h1>
            </Container>
        )
    }

    return (
        <Container>
            <h1 className="text-center">Página Admin - {profile.name}</h1>
            <div className="flex flex-col gap-5 items-center">
                <img src={profile.avatar} alt={`Imagem de perfil de ${profile.name}`} className="max-w-50 rounded-full border-purple-600 border-2" />
                <span>{profile.name}</span>
                <span>A.K.A {profile.login}</span>
                <a href={profile.profileUrl} target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>

            <ul className={`flex items-center justify-center mt-5${isLoading ? ' blur-sm' : ''}`}>
                <div className="flex flex-wrap gap-2 md:gap-5 max-w-xl">
                    {paginatedRepos?.map((repo, index) => (
                        <li key={index} className="border-2 rounded p-2 list-none hover:scale-105 transition-all" data-name={repo.name} onClick={handleRepoClick(repo.name)}>
                            <span>
                                {repo.name}
                            </span>
                            {/* <span>{repo.description}</span>
                            <span>{repo.url}</span>
                            <span>{repo.topics}</span> */}
                        </li>
                    ))}
                </div>
            </ul>

            <div className="flex justify-center gap-10 w-full mt-5">
                <button className="cursor-pointer rounded-full hover:not-disabled:bg-purple-600 transition-all disabled:opacity-9 " onClick={handlePrevious} disabled={currentPage === 1}><ChevronLeft size={20} color="#ffffff" /></button>
                <span>{currentPage} de {totalPages}</span>
                <button className="cursor-pointer rounded-full hover:not-disabled:bg-purple-600 transition-all disabled:opacity-9" onClick={handleNext} disabled={currentPage === totalPages}><ChevronRight size={20} color="#ffffff" /></button>
            </div>
            
        </Container>
    )
}