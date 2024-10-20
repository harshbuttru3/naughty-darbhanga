import React, { useState } from "react";
import AuthProvider from "./AuthProvider";
import ChatApp from "./components/ChatApp";

const HomePage = () => {
  const [user, setUser] = useState(null);

  if (!user) {
    return <AuthProvider onLogin={setUser} />;
  }

  return <ChatApp user={user} />;
};

export default HomePage;
