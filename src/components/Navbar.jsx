import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { clearUser } from '@/features/user/userSlice';
import { useLogoutUserMutation } from '@/services/userApi';
import { ButtonTheme } from './ButtonTheme';

export default function Navbar() {
    const dispatch = useDispatch();
    const router = useRouter();
    const [logoutUser, { isLoading }] = useLogoutUserMutation();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = async () => {
        // Elimina el token de las cookies si es necesario
        try {
            const response = await logoutUser().unwrap();
            dispatch(setUser(response));
        } catch (error) {
            console.log(error);
        }
        // Dispatch para manejar la acción de logout en el estado global
        dispatch(clearUser());
        // Redirigir a la página de login
        router.push('/auth/login');
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav className="shadow-md px-4 py-2 md:flex md:items-center md:justify-between border-b">
            <div className="flex justify-between items-center me-5">
                <span className="text-xl font-semibold ">Catgy</span>
                <button
                    className=" md:hidden block"
                    onClick={toggleMenu}
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16m-7 6h7"
                        />
                    </svg>
                </button>
            </div>

            <div
                className={`flex-1 justify-between items-center mt-2 md:mt-0 ${menuOpen ? 'block' : 'hidden'
                    } md:flex`}
            >
                <ul className="flex flex-col md:flex-row md:space-x-6">
                    <li>
                        <Link className="hover:" href="/">
                            <p className='mb-0'>Inicio</p>
                        </Link>
                    </li>
                    <li>
                        <Link className="hover:" href="/dashboard/products">
                            <p className='mb-0'>Productos</p>
                        </Link>
                    </li>
                    <li>
                        <Link className="hover:" href="/dashboard/users">
                            <p className='mb-0'>Usuarios</p>
                        </Link>
                    </li>
                </ul>
                <div className="mt-2 md:mt-0 flex gap-3 items-center">
                    <ButtonTheme></ButtonTheme>
                    <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600">
                        {isLoading ? "Cargando..." : "Cerrar Sesión"}
                    </Button>
                </div>
            </div>
        </nav>
    );
}
