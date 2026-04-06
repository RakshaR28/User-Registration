import React, { useState } from "react";
import './App.css';
import UserForm from "./components/UserForm";
import UserList from "./components/UserList";

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUserSaved = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="app-container">
  <div className="form-section">
    <UserForm onUserSaved={handleUserSaved} />
  </div>
  <div className="list-section">
    <UserList refreshTrigger={refreshTrigger} />
  </div>
</div>
  );
}

export default App;
