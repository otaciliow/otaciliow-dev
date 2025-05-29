import { ReactNode } from "react";

export function Container({children}: {children: ReactNode}) {

    return (
        <main className="w-full max-w-7xl mx-auto px-4 mt-30 md:mt-20">
            {children}
        </main>
    )
}