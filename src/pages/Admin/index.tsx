import { useState, useEffect } from 'react'
import { Octokit } from '@octokit/rest';

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

export function Admin() {
    const [profile, setProfile] = useState<UserDataProps | null>(null)
    const [repos, setRepos] = useState<ReposProps[]>()

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
                    per_page: 30,
                });

                const fetchedRepos: ReposProps[] = data.map((repo) => ({
                    name: repo.name,
                    description: repo.description,
                    url: repo.svn_url,
                    topics: repo.topics || []
                }));

                setRepos(fetchedRepos)

                // data.forEach((repo) => {
                //     if (repo.name == 'react-ecommerce') {
                //         console.log(repo)
                //     }
                // })

                // setRepos(repos)
                
            } catch (error: any) {
                console.log(`Erro" Status: ${error.status}`)
            }
        }

        fetchRepos()
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

            <ul className="flex flex-col gap-5 items-center">
                {repos?.map((repo, index) => (
                    <li key={index} className="border-2 rounded px-2 list-none">
                        <a href={repo.url} target="_blank" rel="noopener noreferrer">{repo.name}</a>
                        <p>{repo.description || "Sem descrição."}</p>

                        {repo.topics.length > 0 && (
                            <ul className="flex flex-wrap gap-2">
                                {repo.topics.map((topic, i) => (
                                    <li key={i} className="">{topic}</li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </Container>
    )
}