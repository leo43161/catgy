import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

export default function Home() {
    return (
        <div>
            <h1>Bienvenidos</h1>
            <span className="hidden">{process.env.NEXT_PUBLIC_MONGO_URI}</span>
            <span className="hidden">{process.env.NEXT_PUBLIC_SECRET_JWT}</span>
            <span className="hidden">{process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID}</span>
            <span className="hidden">{process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY}</span>
        </div>
    );
}