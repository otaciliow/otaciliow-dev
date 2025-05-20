import { useContext } from 'react';
import { RegisterOptions, UseFormRegister } from 'react-hook-form';

import { ThemeContext } from '../../contexts/themeContext';

interface InputProps {
    type: string;
    placeholder: string;
    name: string;
    register: UseFormRegister<any>;
    error?: string
    rules?: RegisterOptions;
    label?: string;
}

export function Input({type, placeholder, name, register, error, rules, label}: InputProps) {
    const { theme } = useContext(ThemeContext);
    return (
        <>
            <div className="flex items-center gap-2">
                <label htmlFor={name} className={`${theme === 'light' ? 'text-primary-500' :'text-white'} ${label ? 'font-medium' : 'hidden'}`}>{label}</label>
                {error && (
                    <p className="text-red-500 m-0">{error}</p>
                )}
            </div>
            <input type={type} placeholder={placeholder} id={name} {...register(name, rules)} className="w-full border-2 border-primary-500 rounded-md h-11 px-2 placeholder-gray-400 outline-primary-100" />
        </>
    )
}