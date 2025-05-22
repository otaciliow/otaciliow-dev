import { useState, useEffect, useContext } from 'react';
import { db } from '../../services/firebaseConnection';
import { collection, onSnapshot } from 'firebase/firestore';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/scrollbar';
import 'swiper/css/pagination';

import { UserContext } from '../../contexts/userContext';
import { ThemeContext } from '../../contexts/themeContext';

import { ReposProps } from "../../interfaces/IReposProps"

import { Container } from "../../components/container"
import { ScrollToTopButton } from '../../components/scrollButton';

import { Github, Linkedin, LoaderCircle, ExternalLink } from 'lucide-react';

export function Home() {
    const user = useContext(UserContext);
    const { theme } = useContext(ThemeContext);
    const [repos, setRepos] = useState<ReposProps[]>([])
    const [selectedRepo, setSelectedRepo] = useState<ReposProps | null>(null)

    const openModal = (repo: ReposProps) => {setSelectedRepo(repo), document.body.classList.add('no-scroll')};
    const closeModal = () => {setSelectedRepo(null), document.body.classList.remove('no-scroll')};

    useEffect(() => {
        const linksRef = collection(db, 'active-display')

        const unsub = onSnapshot(linksRef, (snapshot) => {
            let lista = [] as ReposProps[];

            snapshot.forEach((doc) => {
                lista.push({
                    id: doc.id,
                    name: doc.data().name,
                    description: doc.data().description,
                    url: doc.data().url,
                    topics: doc.data().topics,
                    previewImage: doc.data().previewImage,
                    publishedUrl: doc.data().publishedUrl,
                })

            })
            
            setRepos(lista)
        })

        return () => {
            unsub();
        }
    }, []);

    if (!user) {
        return (
            <Container>
                <div className="flex flex-col items-center justify-center mt-10">
                    <h2>Carregando informações</h2>
                    <LoaderCircle size={40} className="animate-spin" />
                </div>
            </Container>
        ) 
    };

    return(
        <>
            <Container>
                <h1 className="hidden">{`Portfólio de ${user?.name}`}</h1>
                <section className="py-5 my-5 flex flex-col gap-10" id="about">
                    <h2 className={`font-bold text-center text-3xl ${theme === 'light' ? 'text-primary-600' : 'text-primary-400'}`}>Sobre mim</h2>
                    <div className="flex flex-col gap-5 md:flex-row items-center justify-evenly">
                        <div className="flex flex-col justify-center gap-5">
                            <img src={user?.avatar} alt={`foto de perfil de ${user?.name}`} className="border-2 border-primary-500 rounded-full w-3xs" loading="lazy" />
                            <div className="flex items-center justify-center gap-16">
                                <a href={user?.profileUrl} target="_blank" rel="noopener noreferrer" className="bg-primary-500 text-white hover:scale-110 hover:animate-pulse transition-all p-1 rounded-md"><Github size={30} /></a>
                                <a href={user?.profileLinkedin} target="_blank" rel="noopener noreferrer" className="bg-primary-500 text-white hover:scale-110 hover:animate-pulse transition-all p-1 rounded-md"><Linkedin size={30} /></a>
                            </div>
                        </div>
                        <div className="flex flex-col px-2 md:px-0">
                            <p className="max-w-xl mb-5">{`Olá! me chamo ${user?.name}!`}</p>
                            <p className="max-w-xl">{user?.profileDescription}</p>
                        </div>
                    </div>
                </section>
                <section id="projects" className={`py-5 my-5 mb-20 flex flex-col gap-10 ${theme === 'light' ? 'bg-primary-100/50' : 'bg-primary-100/10'}`}>
                    <h2 id="projects" className={`font-bold text-center text-3xl ${theme === 'light' ? 'text-primary-600' : 'text-primary-400'}`}>Projetos</h2>
                    <p className="text-center">Aqui estão alguns dos meus projetos. Clique nos cards para exibir mais informações e seus respectivos links</p>
                    <Swiper
                        modules={[Mousewheel, Pagination, Autoplay]}
                        spaceBetween={30}
                        slidesPerView={1}
                        slidesPerGroup={1}
                        mousewheel={true}
                        pagination={{clickable: true}}
                        autoplay={{delay: 6000, pauseOnMouseEnter: true}}
                        className={`w-full rounded-md items-stretch`}
                        breakpoints={
                            {768: {
                                slidesPerView: 2,
                                slidesPerGroup: 2,
                            },}
                        }
                    >
                        {repos.map((repo, i) => (
                            <SwiperSlide key={i} className="pb-5">
                                <button onClick={() => openModal(repo)} className="w-full h-full flex items-center px-14 justify-center text-white hover:scale-105 transition-all cursor-pointer">
                                    <div className="flex gap-4 w-full h-full flex-col items-center justify-center p-5 bg-primary-400 rounded-md">
                                        <p className={`font-bold text-xl text-shadow-md`}>
                                            {repo.name}
                                        </p>
                                        <p className="text-shadow-md text-center flex-grow">{repo.description}</p>
                                        <div className="flex flex-wrap justify-evenly gap-2 flex-grow">
                                            {repo.topics.map((topic, i) => (
                                                <span key={i} className="bg-primary-600 rounded-full py-1 px-3">{topic}</span>
                                            ))}
                                        </div>
                                    </div>
                                </button>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    {selectedRepo && (
                        <div onClick={(e) => {if (e.target === e.currentTarget) {closeModal()}}} className="fixed inset-0 px-4 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                            <div role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()} className="bg-primary-500 text-white drop-shadow-2xl flex flex-col items-center justify-center gap-5 rounded-lg p-6 max-w-xl w-full shadow-lg relative">
                                <button aria-label="fechar modal" onClick={() => closeModal()} className="cursor-pointer absolute top-2 right-4 text-white hover:text-gray-400 transition-colors text-2xl">
                                    &times;
                                </button>
                                <h3 className="text-xl font-bold text-shadow-md text-center">{selectedRepo.name}</h3>
                                <input type="hidden" name={selectedRepo.previewImage} />
                                {selectedRepo.previewImage && (
                                    <img src={`/projects/${selectedRepo.previewImage}.png`} alt={`preview da tela inicial do projeto ${selectedRepo.name}`} className="rounded-md" />
                                )}
                                <p className="text-shadow-md text-center">{selectedRepo.description || 'Sem descrição disponível.'}</p>
                                <p className="text-shadow-md ">Principais tecnologias utilizadas:</p>
                                <div className="flex items-center flex-wrap gap-2 justify-evenly">
                                    {selectedRepo.topics.map((topic, i) => (
                                        <span key={i} className="bg-primary-600 rounded-full py-1 px-3 hover:animate-bounce cursor-default">{topic}</span>
                                    ))}
                                </div>
                                <span className="h-0.5 w-full bg-primary-100 rounded-md" />
                                <div className="flex items-center justify-center gap-5">
                                    <a href={selectedRepo.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 p-2 drop-shadow-2xl rounded-md transition-all text-primary-600 font-bold bg-white hover:scale-110">Repositório <ExternalLink size={14}/></a>
                                    {selectedRepo.publishedUrl && (
                                        <a href={selectedRepo.publishedUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 p-2 drop-shadow-2xl rounded-md transition-all text-primary-600 font-bold bg-white hover:scale-110">Visitar site<ExternalLink size={14}/></a>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </Container>
            <ScrollToTopButton />
            <footer className={`text-center text-sm text-shadow-md py-10 ${theme === 'light' ? 'bg-primary-100/50' : 'bg-primary-100/10'}`}>
                {`Copyright © ${new Date().getFullYear()} - Todos os direitos reservados.`}
            </footer>
        </>
    )
}