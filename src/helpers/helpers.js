export const verifyUserLogged = async () => {
    try {
        const response = await fetch('/api/users/login', {
            method: 'GET',
            credentials: 'include' // para incluir cookies automáticamente
        });
        if (response.status === 200) {
            const userLogged = await response.json();
            return userLogged; // devuelve el usuario logueado si existe
        } else {
            return null; // indica que el usuario no está logueado
        }
    } catch (error) {
        console.error("Error verifying user:", error);
        return null;
    }
};