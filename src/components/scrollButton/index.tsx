import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export function ScrollToTopButton() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        function toggleVisibility() {
            setIsVisible(window.scrollY > 200);
        }

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);

    }, []);

    function scrollToTop() {
        window.scrollTo({top: 0, behavior: 'smooth'});
    }

    return (
        <div className={`flex flex-col items-center fixed bottom-15 right-10 z-50 transition-all ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <button onClick={scrollToTop} className={`p-3 rounded-full bg-primary-500 text-white shadow-lg hover:bg-primary-600 cursor-pointer`} aria-label="voltar ao topo">
                <ArrowUp size={30} />
            </button>
            <span>Voltar ao topo</span>
        </div>
    )
}