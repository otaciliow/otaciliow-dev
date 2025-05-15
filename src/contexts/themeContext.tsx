import { ReactNode, createContext, useState, useEffect, useContext } from 'react'

interface ThemeContextProps {
    children: ReactNode
}

type ThemeContextData = {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

// export const ThemeContext = createContext<ThemeContextProps | null>(null);
export const ThemeContext = createContext({} as ThemeContextData);

function ThemeProvider({children}: ThemeContextProps) {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        const storedTheme = localStorage.getItem('theme');
        return storedTheme === 'dark' ? 'dark' : 'light';
    })

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    }

    useEffect(() => {
        localStorage.setItem('theme', theme);

        if (theme === 'dark') {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, [theme]);

    const value = {
        theme, toggleTheme
    }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
    }

    return context;
}

export default ThemeProvider;