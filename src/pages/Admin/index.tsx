import { useState, useEffect, useMemo } from 'react'
import { Octokit } from '@octokit/rest';
import { ChevronLeft, ChevronRight } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast';

import { doc, collection, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';

import { Container } from '../../components/container'
import { Link } from 'react-router-dom';

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
    const [theme, setTheme] = useState(['#ffffff', '#000000'])

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

    const notifyAdd = (text: string) => toast.success(text, {
        duration: 2000,
        position: 'top-center',
    });

    const notifyRemove = (text: string) => toast.error(text, {
        duration: 2000,
        position: 'top-center'
    })

    const handleCheckTheme = () => {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark').matches) {
            setTheme(['#333333', '#ffffff'])
        }
    }

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
        handleCheckTheme()
    }, [])

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
            
            setActiveRepos(lista)
        })

        return () => {
            unsub();
        }
    }, [])

    const handleRepoClick = async (repoName: string | null) => {
        const name = repoName;

        if (name) {
            const repoData = repos.find(item => item.name === name);
    
            if (repoData) {
                setIsLoading(true);
                
                const docId = repoData.name;

                if (activeRepos.find(item => item.name === docId)) {
                    const repoDocRef = doc(collection(db, 'active-display'), `${docId}`)

                    deleteDoc(repoDocRef)
                    .then(() => {
                        setIsLoading(false)
                        notifyRemove('Repositório removido do portfólio')
                    })
                    .catch (err => {
                        setIsLoading(false)
                        console.error(`Erro ao deletar repositório ${docId}: ${err}`)
                    })
                } else {
                    const repoDocRef = doc(collection(db, 'active-display'), `${docId}`);
    
                    setDoc(repoDocRef, {
                        name: repoData.name,
                        description: repoData.description,
                        url: repoData.url,
                        topics: repoData.topics,
                    })
                    .then(() => {
                        setIsLoading(false);
                        notifyAdd('Repositório adicionado ao portfólio')
                    })
                    .catch((err) => {
                        setIsLoading(false)
                        console.error(`Erro ao adicionar ou atualizar o documento ${docId}: ${err}`)
                    })
                }
            }
        }
    }

    if (!profile) {
        return (
            <Container>
                <h1 className="text-center my-10">Carregando informações...</h1>
            </Container>
        )
    }

    return (
        <Container>
            <div className="flex flex-col gap-5 items-center">
                <h1 className="text-center font-bold text-2xl">Opa {profile.name?.split(' ')[0]}, bão?</h1>
                <Link to='/'>
                    <img src={profile.avatar} alt={`Imagem de perfil de ${profile.name}`} className="max-w-50 rounded-full border-purple-600 border-2" />
                </Link>
            </div>
            <p className="text-center my-5">Selecione os repositórios que serão exibidos na LP:</p>
            <ul className={`flex items-center justify-center mt-5${isLoading ? ' blur-sm' : ''}`}>
                <div className="flex flex-wrap gap-4 justify-center md:max-w-4xl">
                    {paginatedRepos?.map((repo, index) => (
                        <li key={index} className={`border-2 rounded p-2 text-center min-w-3xs list-none cursor-pointer hover:scale-105 transition-all${activeRepos.find(item => item.name === repo.name) ? ' border-purple-600' : ''}`} data-name={repo.name} onClick={() => handleRepoClick(repo.name)}>
                            <span>
                                {repo.name}
                            </span>
                        </li>
                    ))}
                </div>
            </ul>

            <div className="flex justify-center gap-10 w-full my-5">
                <button className="cursor-pointer rounded-full hover:not-disabled:bg-purple-600 transition-all disabled:opacity-9 " onClick={handlePrevious} disabled={currentPage === 1}><ChevronLeft size={20} color="#ffffff" /></button>
                <span>{currentPage} de {totalPages}</span>
                <button className="cursor-pointer rounded-full hover:not-disabled:bg-purple-600 transition-all disabled:opacity-9" onClick={handleNext} disabled={currentPage === totalPages}><ChevronRight size={20} color="#ffffff" /></button>
            </div>

            <Toaster toastOptions={{style: {background: theme[0], color: theme[1]}}}/>
            
        </Container>
    )
}