import React, { useState } from "react";

const UserWall = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      text: "мили котик!",
      image: "https://avatars.mds.yandex.net/i?id=f64710d1da958f2fc884be6cb109e1faa58442e8ddd00328-5268818-images-thumbs&n=13",
      date: "July 21, 2024 at 08:28 PM",
    },
    {
      id: 2,
      text: "Finally completed The Witcher 3. What an amazing journey!",
      image: null,
      date: "May 21, 2024 at 05:27 PM",
    },
  ]);

  const [newPostText, setNewPostText] = useState("");
  const [newPostImage, setNewPostImage] = useState(null);

  const handlePostSubmit = (e) => {
    e.preventDefault();

    if (newPostText.trim() || newPostImage) {
      const newPost = {
        id: Date.now(),
        text: newPostText.trim(),
        image: newPostImage,
        date: new Date().toLocaleString("en-US", { 
          year: "numeric", 
          month: "long", 
          day: "numeric", 
          hour: "2-digit", 
          minute: "2-digit" 
        }),
      };

      setPosts([newPost, ...posts]);
      setNewPostText("");
      setNewPostImage(null);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPostImage(reader.result);
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

        {newPostImage && (
          <div className="image-preview">
            <img src={newPostImage} alt="Preview" />
            <button className="remove-button" onClick={() => setNewPostImage(null)}>Remove</button>
          </div>
        )}
      </form>

      <div className="posts">
        {posts.map((post) => (
          <div key={post.id} className="posts__item">
            <p>{post.text}</p>
            {post.image && <img src={post.image} alt="Post" />}
            <span className="post-date">{post.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserWall;
