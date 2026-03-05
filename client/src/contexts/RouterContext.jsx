import React, { useState, useContext, createContext } from 'react';

const RouterContext = createContext(null);

export const RouterProvider = ({ children }) => {
    const [path, setPath] = useState('/');

    const navigate = (newPath) => {
        setPath(newPath);
        window.scrollTo(0, 0);
    };

    return (
        <RouterContext.Provider value={{ path, navigate }}>
            {children}
        </RouterContext.Provider>
    );
};

export const useRouter = () => useContext(RouterContext);
