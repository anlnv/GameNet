import { useState, useEffect } from 'react';
import styles from './Users.module.css';
import { callAPI } from '@/utils/api';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Получаем список пользователей с сервера
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await callAPI(`/user`);
        // const response = await fetch("http://87.242.103.34:5000/user");
        // const data = await response.json();
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
    const filtered = users.filter((user) =>
      user.username.toLowerCase().includes(query.toLowerCase()),
    );
    setFilteredUsers(filtered);
  };

  return (
    <div className={styles.users_container}>
      <h2 className={styles.users_title}>Users</h2>
      <input
        type='text'
        className={styles.users_search}
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder='Search users...'
      />
      <div className={styles.users_list}>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div key={user.id} className={styles.user_card}>
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.username}
                  className={styles.user_avatar}
                />
              ) : null}
              <p className={styles.user_name}>{user.username}</p>
            </div>
          ))
        ) : (
          <p>No users found</p>
        )}
      </div>
    </div>
  );
}
