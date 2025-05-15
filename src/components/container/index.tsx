import { ReactNode } from "react";
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/themeContext';

export function Container({children}: {children: ReactNode}) {
    const {theme, toggleTheme} = useTheme();
    return (
        <main className="w-full max-w-7xl mx-auto px-4 mt-4">
            <div className={`absolute right-2 md:right-40 flex w-16 p-1 rounded-full items-center border transition-all ${theme === 'light' ? 'justify-start border-gray-900' : 'justify-end border-gray-100'}`}>
                <button aria-label="theme switcher" className={`shadow-2xl p-1 rounded-full border`} onClick={toggleTheme}>
                    { theme === 'light' ? (
                        <Sun size={15} className="text-gray-900"/>
                    ) : (
                        <Moon size={15} className='text-gray-100'/>
                    )}
                </button>
            </div>
            {children}
        </main>
    )
}