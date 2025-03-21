import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./communities.css";

function Communities({profileData}) {
  const [communities, setCommunities] = useState([]);
  const [subscribedCommunities, setSubscribedCommunities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newCommunity, setNewCommunity] = useState({ name: "", description: "" });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const token = localStorage.getItem("token");

        const [allCommunitiesResponse, subscribedResponse] = await Promise.all([
          fetch("http://46.149.72.161:5000/community/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`http://46.149.72.161:5000/user/${profileData.id}/following`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!allCommunitiesResponse.ok || !subscribedResponse.ok) {
          throw new Error("Failed to fetch communities");
        }

        const allCommunities = await allCommunitiesResponse.json();
        const subscribedData = await subscribedResponse.json();

        setCommunities(allCommunities);
        setSubscribedCommunities(subscribedData.communities);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchCommunities();
  }, []);

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

      const token = localStorage.getItem("token");
      const response = await fetch("http://46.149.72.161:5000/community/create", {
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

  const filteredSubscribed = subscribedCommunities.filter((community) =>
    community.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredGlobal = communities.filter(
    (community) =>
      community.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !subscribedCommunities.some((subscribed) => subscribed.id === community.id)
  );

  const handleCommunityClick = (id) => {
    navigate(`/community/${id}`);
  };

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
        {filteredSubscribed.map((community) => (
          <li
            key={community.id}
            className="communities__item"
            onClick={() => handleCommunityClick(community.id)}
          >
            {community.name}
          </li>
        ))}
      </ul>

      {filteredGlobal.length > 0 && (
        <>
          <h3 className="communities__search-results">Search Results:</h3>
          <ul className="communities__list">
            {filteredGlobal.map((community) => (
              <li
                key={community.id}
                className="communities__item"
                onClick={() => handleCommunityClick(community.id)}
              >
                {community.name}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default Communities;
