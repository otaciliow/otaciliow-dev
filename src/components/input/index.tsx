import { RegisterOptions, UseFormRegister } from 'react-hook-form';

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
    return (
        <>
            <div className="flex items-center gap-2">
                <label htmlFor={name} className={`text-purple-500 ${label ? 'font-medium' : 'hidden'}`}>{label}</label>
                {error && (
                    <p className="text-red-500 m-0">{error}</p>
                )}
            </div>
            <input type={type} placeholder={placeholder} id={name} {...register(name, rules)} className="w-full border-2 border-purple-500 rounded-md h-11 px-2 placeholder-gray-400 outline-purple-800" />
        </>
    )
}