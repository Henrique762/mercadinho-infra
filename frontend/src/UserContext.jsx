import React from 'react';

export const UserContext = React.createContext();

export const GlobalContext = ({ children }) => {
  const [user, setUser] = React.useState(
    localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user'))
      : { isLogin: false, nome: '', id: '0', token: '' },
  );

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
