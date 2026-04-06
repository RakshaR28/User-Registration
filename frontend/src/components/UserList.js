import React, { useEffect, useState } from "react";
import { getUsers } from "../services/api";

const UserList = ({ refreshTrigger }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers()
      .then(data => {
        console.log("Fetched users:", data);

       const list = Array.isArray(data) ? data : [];

        // Keep only the latest 5 users
        

        setUsers(list);
      })
      .catch(err => console.error("Error fetching users:", err));
  }, [refreshTrigger]);

  return (
    <div>
      <h3>Saved Users</h3>
      {!users || users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <ul>
          {users.map((u, i) => (
            <li key={i}>
              {u.firstName || u.first_name} {u.lastName || u.last_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;
