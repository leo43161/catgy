import { useState } from 'react';
import { useDispatch } from 'react-redux';
/* import { loginUser } from '@/store/features/authSlice'; */
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLoginUserMutation } from '@/services/userApi';
import { setUser } from '@/features/user/userSlice';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginUser, { isLoading }] = useLoginUserMutation();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser({ email, password }).unwrap();
            dispatch(setUser(response));
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="w-full max-w-sm p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Iniciar Sesión
                </h2>
                <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Correo electrónico"
                    className="mb-4"
                />
                <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    className="mb-4"
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Verificando..." : "Ingresar"}
                </Button>
            </form>
        </div>
    );
}
