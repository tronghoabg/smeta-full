import React from 'react';
const UserContext = React.createContext({ name: '', auth: false });

const UserProvider = ({ children }) => {
    const [user, setUser] = React.useState({ name: '', auth: false });
    const authContext = (name) => {
        setUser((user) => ({
            name: name,
            auth: true,
        }));
    };

    const logout = () => {
        setUser((user) => ({
            name: '',
            auth: false,
        }));
    };

    return (
        <UserContext.Provider value={{ user , authContext, logout, }}>
            {children}
        </UserContext.Provider>
    );
};

export {
    UserContext, UserProvider
}