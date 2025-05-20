import { Outlet } from 'react-router-dom';

import UserContentProvider from '../../contexts/userContext';
import { Header } from '../header';

export function Layout() {

    return (
        <UserContentProvider>
            <Header />
            <Outlet />
        </UserContentProvider>
    )
}