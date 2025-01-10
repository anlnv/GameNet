/*import React, { useState } from "react";
import "./communities.css";

function Communities() {
  const [communities, setCommunities] = useState([
    "minecraft lovers",
    "dota2 coll",
    "pubg is my love",
    "cs go super puper",
    "minecraft lovers",
    "dota2 coll",
    "pubg is my love",
    "cs go super puper",
    "minecraft lovers",
    "dota2 coll",
    "pubg is my love",
    "cs go super puper",
  ]); // Локальный список сообществ
  const [searchTerm, setSearchTerm] = useState("");
  const [newCommunity, setNewCommunity] = useState({ name: "", description: "" });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCommunity((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateCommunity = async () => {
    if (newCommunity.name.trim() === "" || newCommunity.description.trim() === "") {
      setError("Both fields are required!");
      return;
    }

    try {
      setError("");
      setSuccessMessage("");

      // Отправка запроса на бэк
      const token = localStorage.getItem("token");
      const response = await fetch("http://87.242.103.34:5000/community/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCommunity),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create community");
      }

      const createdCommunity = await response.json();
      setCommunities((prev) => [...prev, createdCommunity.name]);
      setSuccessMessage("Community created successfully!");
      setNewCommunity({ name: "", description: "" });
    } catch (error) {
      setError(error.message);
    }
  };

  const filteredCommunities = communities.filter((community) =>
    community.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="communities">
      <div className="communities__create-container">
        <h3>Create New Community</h3>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <input
          type="text"
          name="name"
          className="communities__input"
          placeholder="Community Name"
          value={newCommunity.name}
          onChange={handleInputChange}
        />
        <textarea
          name="description"
          className="communities__textarea"
          placeholder="Community Description"
          value={newCommunity.description}
          onChange={handleInputChange}
        />
        <button className="communities__create-button" onClick={handleCreateCommunity}>
          Create
        </button>
      </div>

      <h2 className="communities__title">Your Communities</h2>
      <input
        type="text"
        className="communities__search"
        placeholder="Search communities..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul className="communities__list">
        {filteredCommunities.map((community, index) => (
          <li key={index} className="communities__item">
            {community}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Communities;*/


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./communities.css";

function Communities() {
  const [communities, setCommunities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newCommunity, setNewCommunity] = useState({ name: "", description: "" });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  // Функция для загрузки списка сообществ с бэка
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://87.242.103.34:5000/community/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch communities");
        }

        const data = await response.json();
        setCommunities(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchCommunities();
  }, []);

  // Обработчик изменений полей создания сообщества
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCommunity((prev) => ({ ...prev, [name]: value }));
  };

  // Обработчик создания нового сообщества
  const handleCreateCommunity = async () => {
    if (newCommunity.name.trim() === "" || newCommunity.description.trim() === "") {
      setError("Both fields are required!");
      return;
    }

    try {
      setError("");
      setSuccessMessage("");

      const token = localStorage.getItem("token");
      const response = await fetch("http://87.242.103.34:5000/community/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCommunity),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create community");
      }

      const createdCommunity = await response.json();
      setCommunities((prev) => [...prev, createdCommunity]);
      setSuccessMessage("Community created successfully!");
      setNewCommunity({ name: "", description: "" });
    } catch (error) {
      setError(error.message);
    }
  };

  // Фильтр поиска по названию сообщества
  const filteredCommunities = communities.filter((community) =>
    community.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Обработчик клика на сообщество
  const handleCommunityClick = (id) => {
    navigate(`/community/${id}`);
  };

  return (
    <div className="communities">
      {/* Блок создания нового сообщества */}
      <div className="communities__create-container">
        <h3>Create New Community</h3>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <input
          type="text"
          name="name"
          className="communities__input"
          placeholder="Community Name"
          value={newCommunity.name}
          onChange={handleInputChange}
        />
        <textarea
          name="description"
          className="communities__textarea"
          placeholder="Community Description"
          value={newCommunity.description}
          onChange={handleInputChange}
        />
        <button className="communities__create-button" onClick={handleCreateCommunity}>
          Create
        </button>
      </div>

      {/* Блок сообществ */}
      <h2 className="communities__title">Your Communities</h2>
      <input
        type="text"
        className="communities__search"
        placeholder="Search communities..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul className="communities__list">
        {filteredCommunities.map((community) => (
          <li
            key={community.id}
            className="communities__item"
            onClick={() => handleCommunityClick(community.id)}
          >
            {community.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Communities;
