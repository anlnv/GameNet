/*import React, { useState } from "react";

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

  // Отправка поста на сервер
  const handlePostSubmit = async (e) => {
    e.preventDefault();
  
    if (newPostText.trim() || newPostImage) {
      try {
        // Создаём новый объект FormData
        const formData = new FormData();
  
        // Добавляем обязательные поля: title и content
        formData.append("title", "1"); // "1" как обязательное поле
        formData.append("content", newPostText.trim());
  
        // Если изображение было загружено, добавляем его
        if (newPostImage) {
          formData.append("attachments", newPostImage);
        }
  
        // Получаем токен из локального хранилища
        const token = localStorage.getItem("token");
  
        // Отправляем запрос на сервер
        const response = await fetch("http://87.242.103.34:5000/posts/create", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
  
        // Обрабатываем ответ
        const result = await response.json();
        console.log("Post result:", result);
  
        if (response.ok) {
          // Обновляем состояние постов, если запрос успешен
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
        } else {
          console.error("Error posting:", result);
        }
      } catch (error) {
        console.error("Error during post submit:", error);
      }
    }
  };
  
  

  // Обработчик для загрузки изображения
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPostImage(file); // Сохраняем файл изображения
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
            <img src={URL.createObjectURL(newPostImage)} alt="Preview" />
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

export default UserWall;*/

import React, { useState, useEffect } from "react";

const UserWall = () => {
  const [posts, setPosts] = useState([]);
  const [newPostText, setNewPostText] = useState("");
  const [newPostImage, setNewPostImage] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Получаем токен и ID пользователя из локального хранилища
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId"); // ID пользователя, который должен быть в localStorage

        // Проверяем, что оба значения есть
        if (!token || !userId) {
          console.error("Token or User ID is missing");
          return;
        }

        // Отправляем запрос на сервер для получения постов
        const response = await fetch("http://87.242.103.34:5000/posts/load_users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ user_id: userId }),
        });

        // Обрабатываем ответ
        const result = await response.json();
        if (response.ok) {
          setPosts(result.posts); // Сохраняем посты в состоянии
        } else {
          console.error("Error fetching posts:", result);
        }
      } catch (error) {
        console.error("Error during fetching posts:", error);
      }
    };

    fetchPosts();
  }, []); // Запрос выполняется один раз при монтировании компонента

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    if (newPostText.trim() || newPostImage) {
      try {
        // Создаём новый объект FormData
        const formData = new FormData();

        // Добавляем обязательные поля: title и content
        formData.append("title", "1"); // "1" как обязательное поле
        formData.append("content", newPostText.trim());

        // Если изображение было загружено, добавляем его
        if (newPostImage) {
          formData.append("attachments", newPostImage);
        }

        // Получаем токен из локального хранилища
        const token = localStorage.getItem("token");

        // Отправляем запрос на сервер
        const response = await fetch("http://87.242.103.34:5000/posts/create", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        // Обрабатываем ответ
        const result = await response.json();
        console.log("Post result:", result);

        if (response.ok) {
          // Обновляем состояние постов, если запрос успешен
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
        } else {
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
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            {post.media_files && post.media_files.length > 0 && (
              <img src={post.media_files[0].file_url} alt="Post" />
            )}
            <span className="post-date">{new Date(post.created_at).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserWall;

