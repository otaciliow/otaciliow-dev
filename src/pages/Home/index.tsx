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

import { ReposProps } from "../../interfaces/IReposProps"

import { Container } from "../../components/container"

import { Github, Linkedin } from 'lucide-react';

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
            <h1 className="hidden">{`Portfólio de ${user?.name}`}</h1>
            <section className="py-5 my-5 flex flex-col gap-10" id="about">
                <h2 className="font-bold text-center text-3xl text-primary-100">Sobre mim</h2>
                <div className="flex items-center justify-evenly">
                    <div className="flex flex-col justify-center gap-5">
                        <img src={user?.avatar} alt={`foto de perfil de ${user?.name}`} className="border-2 border-primary-500 rounded-full w-3xs" />
                        <div className="flex items-center justify-center gap-16">
                            <a href={user?.profileUrl} target="_blank" rel="noopener noreferrer" className="bg-primary-500 hover:scale-110 hover:animate-pulse transition-all p-1 rounded-md"><Github size={30} /></a>
                            <a href={user?.profileLinkedin} target="_blank" rel="noopener noreferrer" className="bg-primary-500 hover:scale-110 hover:animate-pulse transition-all p-1 rounded-md"><Linkedin size={30} /></a>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <p className="max-w-xl mb-5">{`Olá! me chamo ${user?.name}!`}</p>
                        <p className="max-w-xl">{user?.profileDescription}</p>
                    </div>
                </div>
            </section>
            <section id="projects" className="py-5 my-5 flex flex-col gap-10">
                <h2 id="projects" className="font-bold text-center text-3xl text-primary-100">Projetos</h2>
                <Swiper
                    modules={[Mousewheel, Pagination, Autoplay]}
                    spaceBetween={30}
                    slidesPerView={2}
                    slidesPerGroup={2}
                    mousewheel={true}
                    pagination={{clickable: true}}
                    autoplay={{delay: 6000, pauseOnMouseEnter: true}}
                    className="w-full"
                >
                    {repos.map((repo, i) => (
                        <SwiperSlide className="py-5">
                            <div className="w-full flex items-center justify-center">
                                <h2 key={i} className="text-center p-5 bg-primary-500 w-xl rounded-md">{repo.name}</h2>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </section>
        </Container>
    )
}