import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [posts, setPosts] = useState([]);
  const [newPosts, setNewPosts] = useState({ title: "", body: "" });
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => response.json())
      .then((data) => setPosts(data.slice(0, 5)))
      .catch((error) => console.log("Error :", error));
  }, []);
  const handleCreate = () => {
    fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newPosts.title,
        body: newPosts.body,
        userId: 1,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setPosts([data, ...posts]);
        setNewPosts({ title: "", body: "" });
      })
      .catch((error) => console.log("Error : ", error));
  };

  const handleUpdate = (id, currTitle) => {
    const newTitle = prompt("Enter new Title", currTitle);
    if (newTitle) {
      fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          title: newTitle,
          body: posts.find((post) => post.id === id).body,
          userId: 1,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setPosts(posts.map((post) => (post.id === id ? data : post)));
        })
        .catch((error) => console.log("Error : ", error));
    }
  };

  const handleDelete = (id) => {
    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setPosts(posts.filter((post) => post.id !== id));
        }
      })
      .catch((error) => console.log("Error : ", error));
  };
  return (
    <>
      <h2>Create Posts</h2>
      <input
        type="text"
        placeholder="Enter title here"
        value={newPosts.title}
        onChange={(e) => setNewPosts({ ...newPosts, title: e.target.value })}
      />
      <input
        type="text"
        placeholder="Enter post data here"
        value={newPosts.body}
        onChange={(e) => setNewPosts({ ...newPosts, body: e.target.value })}
      />
      <button onClick={handleCreate}>Add</button>
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <strong>{post.title}</strong>
            <p>{post.body}</p>
            <button onClick={(e) => handleUpdate(post.id, post.title)}>
              Edit Title
            </button>
            <button onClick={(e) => handleDelete(post.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
