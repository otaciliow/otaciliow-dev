import { useContext } from 'react'
import { UserContext } from '../../contexts/userContext';
import { Sun, Moon, FileDown } from 'lucide-react';
import { useTheme } from '../../contexts/themeContext';

export function Header() {
    const user = useContext(UserContext)
    const {theme, toggleTheme} = useTheme();

    function smoothScrollToSection(section: string) {
        let targetSection = document.getElementById(section);
        targetSection?.scrollIntoView({behavior: 'smooth'});
    }

    return (
        <header className={`mx-auto p-5 flex items-center justify-center shadow-xl ${theme === 'light' ? 'bg-primary-100/50' : 'bg-primary-100/10'}`}>
            <div className="w-7xl md:px-5 flex flex-col gap-5 md:flex-row md:gap-0 items-center">
                { user ? (
                    <h2 className="gradient-text text-2xl font-bold md:w-32 hover:animate-pulse cursor-default transition-all">{`<${user?.name?.split(' ')[0]}/>`}</h2>
                ) : (
                    <h2 className="blur-sm gradient-text md:w-32 text-2xl font-bold">{`<Name/>`}</h2>
                )}
                <div className="flex items-center gap-5 mx-auto">
                    <button onClick={() => smoothScrollToSection('about')} className={`${theme === 'light' ? 'text-primary-600 hover:text-primary-500' : 'text-primary-100 hover:text-white'} cursor-pointer transition-colors font-bold text-shadow-md`} aria-label="link para a seção 'Sobre Mim'">Sobre mim</button>
                    <button onClick={() => smoothScrollToSection('projects')} className={`${theme === 'light' ? 'text-primary-600 hover:text-primary-500' : 'text-primary-100 hover:text-white'} cursor-pointer transition-colors font-bold text-shadow-md`} arial-label="link para a seção 'Projetos'">Projetos</button>
                    <a href="https://bit.ly/otaciliow" target="_blank" rel="noopener noreferrer" className={`${theme === 'light' ? 'text-primary-600 hover:text-primary-500' : 'text-primary-100 hover:text-white'} flex items-center gap-1 cursor-pointer transition-colors font-bold text-shadow-md`} aria-label="link para download do currículo">Currículo<FileDown size={16}/></a>
                </div>
                <div className={`absolute right-5 top-6 md:relative md:top-0 md:right-0 flex w-11 h-6 rounded-full cursor-pointer shadow-inner items-center border ${theme === 'light' ? 'border-primary-500' : 'border-primary-100'} justify-around`}>
                    <Sun size={15} className="text-primary-100" onClick={toggleTheme}/>
                    <Moon size={15} className='text-primary-600' onClick={toggleTheme}/>
                    <button aria-label="botão para trocar o esquema de cores" className={`absolute cursor-pointer shadow-md h-4 w-4 left-0.5 transition-transform duration-300 rounded-full ${theme === 'light' ? 'translate-x-0 bg-primary-500' : 'translate-x-5 bg-primary-100'}`} onClick={toggleTheme}></button>
                </div>
            </div>
        </header>
    )
}