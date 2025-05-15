import { useEffect } from 'react';
import { useTheme } from '../../contexts/themeContext';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../../services/firebaseConnection';

import { Container } from '../../components/container';
import { Input } from '../../components/input';

const schema = z.object({
    email: z.string().email('Insira o seu e-mail').nonempty('O campo e-mail é obrigatório'),
    password: z.string().nonempty('O campo senha é obrigatório')
})

type formData = z.infer<typeof schema>

export function Login() {
    const navigate = useNavigate()
    const { theme } = useTheme();

    const { register, handleSubmit, formState: {errors} } = useForm<formData>({
        resolver: zodResolver(schema),
        mode: "onChange",
    })

    useEffect(() => {
        async function handleLogOut() {
            await signOut(auth);
        }
        handleLogOut();
    }, []);

    async function onSubmit(data: formData) {
        signInWithEmailAndPassword(auth, data.email, data.password)
        .then(() => {
            console.log('Login com sucesso!');
            navigate('/admin', {replace: true});
        })
        .catch(error => {
            console.log(`Erro ao fazer login!: ${error}`)
        })
    }

    return (
        <Container>
            <div className="w-full min-h-screen flex justify-center items-center flex-col gap-4">
                <Link to='/' className='mb-6 max-w-sm w-full'>
                    Ir para Home
                </Link>
                <form action="" className={`max-w-xl border border-purple-500 w-full rounded-lg p-5`} onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <Input type="email" placeholder="Digite seu e-mail" label="E-mail" name="email" error={errors.email?.message} register={register} />
                    </div>
                    <div className="mb-3">
                        <Input type="password" placeholder="Digite sua senha" label="Senha" name="password" error={errors.password?.message} register={register} />
                    </div>

                    <div className="w-full flex justify-center">
                        <button className={`bg-purple-700 text-white w-50 rounded-md h-10 font-medium cursor-pointer hover:bg-purple-600 transition-all`}>Acessar</button>
                    </div>
                </form>
            </div>
        </Container>
    )
}