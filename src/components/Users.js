import { useState, useEffect } from 'react';
import './users.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function Users() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Получаем список пользователей с сервера
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/user`);
        const data = await response.json();
        setUsers(data.users);
        setFilteredUsers(data.users); // Изначально показываем всех пользователей
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  // Обработчик поиска
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Фильтрация пользователей по имени
    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  return (
    <div className="users-container">
      <h2 className="users-title">Users</h2>
      <input
        type="text"
        className="users-search"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search users..."
      />
      <div className="users-list">
        {filteredUsers.length > 0 ? (
          filteredUsers.map(user => (
            <div key={user.id} className="user-card">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.username}
                  className="user-avatar"
                />
              ) : null}
              <p className="user-name">{user.username}</p>
            </div>
          ))
        ) : (
          <p>No users found</p>
        )}
      </div>
    </div>
  );
}

export default Users;
