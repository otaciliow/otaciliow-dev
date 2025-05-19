import { useContext } from 'react'
import { UserContext } from '../../contexts/userContext';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/themeContext';

export function Header() {
    const user = useContext(UserContext)
    const {theme, toggleTheme} = useTheme();

    function smoothScrollToSection(section: string) {
        let targetSection = document.getElementById(section);
        targetSection?.scrollIntoView({behavior: 'smooth'});
    }

    return (
        <header className="mx-auto p-5 flex justify-center shadow-2xl">
            <div className="w-7xl flex items-center justify-between">
                { user ? (
                    <h2 className="gradient-text text-2xl font-bold md:w-32 hover:animate-pulse cursor-pointer transition-all">{`<${user?.name?.split(' ')[0]}/>`}</h2>
                ) : (
                    <h2 className="blur-sm gradient-text md:w-32 text-2xl font-bold">{`<Name/>`}</h2>
                )}
                <div className="flex items-center gap-5">
                    <button onClick={() => smoothScrollToSection('about')} className={`${theme === 'light' ? 'text-primary-600 hover:text-primary-500' : 'text-primary-500 hover:text-primary-100'} cursor-pointer transition-colors`}>Sobre mim</button>
                    <button onClick={() => smoothScrollToSection('projects')} className={`${theme === 'light' ? 'text-primary-600 hover:text-primary-500' : 'text-primary-500 hover:text-primary-100'} cursor-pointer transition-colors`}>Projetos</button>
                    <button onClick={() => smoothScrollToSection('placeholder')} className={`${theme === 'light' ? 'text-primary-600 hover:text-primary-500' : 'text-primary-500 hover:text-primary-100'} cursor-pointer transition-colors`}>Placeholder</button>
                </div>
                <div className={`relative flex w-11 h-6 rounded-full cursor-pointer shadow-inner items-center border border-primary-500 justify-around`}>
                    <Sun size={15} className="text-primary-100" onClick={toggleTheme}/>
                    <Moon size={15} className='text-primary-600' onClick={toggleTheme}/>
                    <button aria-label="theme switcher" className={`absolute cursor-pointer shadow-md h-4 w-4 left-0.5 bg-primary-500 transition-transform duration-300 rounded-full ${theme === 'light' ? 'translate-x-0' : 'translate-x-5'}`} onClick={toggleTheme}></button>
                </div>
            </div>
        </header>
    )
}