import { Link } from 'react-router-dom';

export function NotFound() {
    return (
        <div className="flex w-full justify-center flex-col items-center text-white min-h-screen">
            <h1 className="font-bold text-4xl mb-4">Página não encontrada!</h1>
            <p className="italic text-1xl mb-4">A página que você tentou acessar não existe! Erro: 404</p>
            <Link to="/" className="bg-primary-500 py-1 px-4 rounded-md hover:bg-primary-600 transition-all">
                Ir para a página inicial
            </Link>
        </div>
    )
}