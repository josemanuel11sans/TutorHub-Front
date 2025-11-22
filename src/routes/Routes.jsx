import { Routes, Route } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";

export const AppRouter = () => {
    const { user } = useAuth();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        user ? setIsLoggedIn(true) : setIsLoggedIn(false);
    }, [user]);

    return (
        <Routes>
                {isLoggedIn && (
                    <>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/user/profile" element={<UserProfilePage />} />
                        <Route path="/user/home" element={<UserHomePage />} />

                        <Route path="/home/enterprise" element={<HomeEnterprise />} />
                        <Route path="/recordUser" element={<RecordUserPage />} />
                        <Route path="/guiaApi" element={<GuiaApi />} />
                        <Route path="/certificates" element={<Certificates />} />
                    </>
                )}

                {!isLoggedIn && (
                    <>
                        <Route path="/" element={<LandingPage />} />

                        {/** Autenticación */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/joinus" element={<JoinUsPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                    </>
                )}
                
                <Route path="*" element={<NotFoundPage />} />
            
        </Routes>
    );
};