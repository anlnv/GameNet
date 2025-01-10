/*import React, { useState } from "react";

const Feed = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      text: "я люблю майнкрафт",
      image: "https://cdn.lifehacker.ru/wp-content/uploads/2019/04/Kak-sozdat-server-Minecraft-poshagovaya-instrukciya-1_1555677917.jpg",
      date: "July 21, 2024 at 08:28 PM",
    },
    {
      id: 2,
      text: "это я сижу играю",
      image: "https://avatars.mds.yandex.net/i?id=a25bced766f6abd24e1df7d8721d48b9_l-12216082-images-thumbs&n=13",
      date: "May 21, 2024 at 05:27 PM",
    },
    {
        id: 3,
        text: "а это я в ведьмака играл",
        image: "https://blog.eldorado.ru/storage/publication/0/38/KHdDn1hnCPfL8qVpleY4WxDYK2PuUtEeL5DFhi08.jpeg",
        date: "August 21, 2024 at 05:27 PM",
      },
      {
        id: 4,
        text: "котик",
        image: "https://avatars.mds.yandex.net/i?id=f64710d1da958f2fc884be6cb109e1faa58442e8ddd00328-5268818-images-thumbs&n=13",
        date: "October 2, 2024 at 03:27 PM",
      },
      {
        id: 5,
        text: "Finally completed The Witcher 3. What an amazing journey!",
        image: null,
        date: "September 1, 2024 at 09:29 PM",
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
      <h2>Feed</h2>

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

export default Feed;*/


import React, { useState, useEffect } from "react";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://87.242.103.34:5000/feed/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await response.json();

        const combinedPosts = [
          ...data.user_posts,
          ...data.group_posts,
        ].map((post) => ({
          id: post.id,
          text: post.content || post.title,
          image:
            Array.isArray(post.media_files) && post.media_files.length > 0
              ? post.media_files[0].file_url
              : null,
          date: new Date(post.created_at).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          author: post.community?.name || post.author.username,
        }));

        combinedPosts.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setPosts(combinedPosts);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="userwall">
      <h2>Feed</h2>

      {error && <p className="error-message">{error}</p>}

      <div className="posts">
        {posts.map((post) => (
          <div key={post.id} className="posts__item">
            <p>
              <strong>{post.author}</strong><p>{post.text}</p>
            </p>
            {post.image && <img src={post.image} alt="Post" />}
            <span className="post-date">{post.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;
