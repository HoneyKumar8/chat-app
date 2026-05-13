import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

const AuthContext =
  createContext();



export const AuthProvider = ({
  children
}) => {

  const [user, setUser] =
    useState(null);




  /* =========================
     LOAD USER
  ========================= */

  useEffect(() => {

    const storedUser =
      localStorage.getItem(
        "user"
      );

    if (storedUser) {

      setUser(
        JSON.parse(storedUser)
      );
    }

  }, []);




  /* =========================
     LOGIN
  ========================= */

  const login = (data) => {

    localStorage.setItem(
      "token",
      data.token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(
        data.user
      )
    );

    setUser(data.user);
  };




  /* =========================
     LOGOUT
  ========================= */

  const logout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    localStorage.removeItem(
      "selectedRoom"
    );

    localStorage.removeItem(
      "selectedConversation"
    );

    setUser(null);
  };




  return (

    <AuthContext.Provider
      value={{
        user,
        login,
        logout
      }}
    >

      {children}

    </AuthContext.Provider>
  );
};



export const useAuth = () =>
  useContext(AuthContext);