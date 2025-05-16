import { ReactNode } from "react";
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/themeContext';

export function Container({children}: {children: ReactNode}) {
    const {theme, toggleTheme} = useTheme();
    return (
        <main className="w-full max-w-7xl mx-auto px-4 mt-4">
            <div className={`absolute right-2 md:right-40 flex w-11 h-6 rounded-full shadow-inner items-center border border-purple-500 justify-around`}>
                <Sun size={15} className="text-gray-100" onClick={toggleTheme}/>
                <Moon size={15} className='text-gray-900' onClick={toggleTheme}/>
                <button aria-label="theme switcher" className={`absolute shadow-md h-4 w-4 left-0.5 bg-purple-400 transition-transform duration-300 rounded-full ${theme === 'light' ? 'translate-x-0' : 'translate-x-5'}`} onClick={toggleTheme}></button>
            </div>
            {children}
        </main>
    )
}