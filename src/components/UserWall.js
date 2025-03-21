import React, { useState, useEffect } from "react";

const UserWall = ({ profileData }) => {
  const [userPosts, setUserPosts] = useState([]);
  const [newPostText, setNewPostText] = useState("");
  const [newPostImage, setNewPostImage] = useState(null); // Файл
  const [previewImage, setPreviewImage] = useState(null); // Превью

  const fetchUserPosts = async () => {
    if (profileData && profileData.id) {
      try {
        const response = await fetch(
          `http://46.149.72.161:5000/posts/${profileData.id}/get-posts`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const result = await response.json();
        setUserPosts(Array.isArray(result.posts) ? result.posts : []);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setUserPosts([]);
      }
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, [profileData]);

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    if (newPostText.trim() || newPostImage) {
      try {
        const formData = new FormData();
        formData.append("title", "1");
        formData.append("content", newPostText.trim());
        if (newPostImage) {
          formData.append("attachments", newPostImage); // Загружаемый файл
        }

        const token = localStorage.getItem("token");
        const response = await fetch("http://46.149.72.161:5000/posts/create", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (response.ok) {
          await fetchUserPosts();
          setNewPostText("");
          setNewPostImage(null);
          setPreviewImage(null); // Сбрасываем превью
        } else {
          const result = await response.json();
          console.error("Error posting:", result);
        }
      } catch (error) {
        console.error("Error during post submit:", error);
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPostImage(file); // Сохраняем файл
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result); // Создаём превью (base64)
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="userwall">
      <h2>User Wall</h2>

      <form className="posts-form" onSubmit={handlePostSubmit}>
        <textarea
          value={newPostText}
          onChange={(e) => setNewPostText(e.target.value)}
          placeholder="What's on your mind?"
        ></textarea>

        <div className="photo-form">
          <label htmlFor="image-upload" className="upload-button">
            Upload Image
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>

          <button type="submit">Post</button>
        </div>

        {previewImage && (
          <div className="image-preview">
            <img src={previewImage} alt="Preview" />
            <button
              className="remove-button"
              onClick={() => {
                setNewPostImage(null);
                setPreviewImage(null);
              }}
            >
              Remove
            </button>
          </div>
        )}
      </form>

      <div className="posts">
        {userPosts
          .slice() // Создаём копию массива
          .reverse() // Отображаем в обратном порядке
          .map((post) => (
            <div key={post.id} className="posts__item">
              <p>{post.content}</p>
              {post.media_files && post.media_files.length > 0 && (
                <img src={post.media_files[0].file_url} alt="Post" />
              )}
              <span className="post-date">
                {new Date(post.created_at).toLocaleString()}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default UserWall;

