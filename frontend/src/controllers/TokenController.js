import { jwtDecode } from "jwt-decode";


export const getToken = () => localStorage.getItem("token");
export const login = (token) => localStorage.setItem("token", token);
export const logout = (navigate) => {
    localStorage.removeItem("token"); 
    if(navigate){
        navigate('/login')
    }
}
export const isAuthenticated = () => !!getToken();
export const isAdmin = () => getDecodedToken()?.role === "admin";


export const getDecodedToken = () => {
    const token = getToken();
    if (!token) return null;
    try {
        const decoded = jwtDecode(token);
        const now = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < now) {
            logout();
            return null;
        }
        return decoded;
    } catch (error) {
        console.error("Invalid token", error);
        return null;
    }
};



