import { useContext } from 'react'
import { UserContext } from '../../contexts/userContext';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/themeContext';

export function Header() {
    const user = useContext(UserContext)
    const {theme, toggleTheme} = useTheme();

    return (
        <header className="mx-auto p-5 flex justify-center shadow-2xl">
            <div className="w-7xl flex items-center justify-between">
                { user && (
                    <h2 className="gradient-text text-2xl font-bold hover:animate-pulse cursor-pointer transition-all">{`<${user?.name?.split(' ')[0]}/>`}</h2>
                )}
                <div className="flex items-center gap-5">
                    <a href="#about" className={`${theme === 'light' ? 'text-primary-600 hover:text-primary-500' : 'text-primary-500 hover:text-primary-100'} transition-colors`}>Sobre mim</a>
                    <a href="#projects" className={`${theme === 'light' ? 'text-primary-600 hover:text-primary-500' : 'text-primary-500 hover:text-primary-100'} transition-colors`}>Projetos</a>
                    <a href="#placeholder" className={`${theme === 'light' ? 'text-primary-600 hover:text-primary-500' : 'text-primary-500 hover:text-primary-100'} transition-colors`}>Placeholder</a>
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