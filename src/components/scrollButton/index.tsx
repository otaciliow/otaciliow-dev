import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

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
        <div className={`flex flex-col items-center fixed bottom-16 right-3 md:right-10 z-49 transition-all ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <button onClick={scrollToTop} className={`p-2 rounded-lg bg-primary-500 text-white shadow-lg hover:bg-primary-600 cursor-pointer`} aria-label="botão para voltar ao topo">
                <ChevronUp size={30} />
            </button>
        </div>
    )
}