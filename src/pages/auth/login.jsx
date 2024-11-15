import { useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLoginUserMutation } from '@/services/userApi';
import { setUser } from '@/features/user/userSlice';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginUser, { isLoading }] = useLoginUserMutation();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser({ email, password }).unwrap();
            dispatch(setUser(response));
            router.push('/');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-primary-foreground dark:bg-secondary  ">
            <form onSubmit={handleSubmit} className="w-full max-w-sm p-8 rounded-lg shadow bg-primary dark:bg-primary">
                <h2 className="text-2xl font-bold text-center mb-6 text-secondary dark:text-primary-foreground">
                    Iniciar Sesión
                </h2>
                <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Correo electrónico"
                    className="mb-4 bg-primary-foreground"
                    name="email"
                />
                <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    className="mb-4 bg-primary-foreground"
                    name="password"
                />
                <Button type="submit" className="w-full border-primary-foreground border" disabled={isLoading}>
                    {isLoading ? "Verificando..." : "Ingresar"}
                </Button>
            </form>
        </div>
    );
}
