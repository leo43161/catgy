import { useDispatch } from 'react-redux';
/* import { logoutUser } from '@/store/features/authSlice'; */
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function Navbar() {
    const dispatch = useDispatch();
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        /* dispatch(logoutUser());
        router.push('/auth/login'); */
    };

    const toggleMenu = () => {
        /* setMenuOpen(!menuOpen); */
    };

    return (
        <nav className="bg-white shadow-md px-4 py-2 md:flex md:items-center md:justify-between">
            <div className="flex justify-between items-center">
                <span className="text-xl font-semibold text-gray-800">Dashboard</span>
                <button
                    className="text-gray-800 md:hidden block"
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
                        <Link className="text-gray-600 hover:text-gray-800" href="/dashboard">
                            <p className='mb-0'>Inicio</p>
                        </Link>
                    </li>
                    <li>
                        <Link className="text-gray-600 hover:text-gray-800" href="/dashboard/products">
                            <p className='mb-0'>Productos</p>
                        </Link>
                    </li>
                    <li>
                        <Link className="text-gray-600 hover:text-gray-800" href="/dashboard/categories">
                            <p className='mb-0'>Categorías</p>
                        </Link>
                    </li>
                </ul>
                <div className="mt-2 md:mt-0">
                    <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600">
                        Cerrar Sesión
                    </Button>
                </div>
            </div>
        </nav>
    );
}
