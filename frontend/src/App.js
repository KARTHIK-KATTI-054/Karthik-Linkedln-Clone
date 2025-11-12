import { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [page, setPage] = useState("login");
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [posts, setPosts] = useState([]);
  const [postText, setPostText] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/posts/all")
      .then(res => setPosts(res.data))
      .catch(()=>{/* ignore if backend not running */});
  }, []);

  const signup = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    const res = await axios.post("http://localhost:5000/api/auth/signup", {
      name, email, password
    }).catch(err => err.response?.data);

    if (res && res.error) return alert(res.error || "Signup failed");
    alert("Signup successful!");
    setPage("login");
  };

  const login = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const res = await axios.post("http://localhost:5000/api/auth/login", {
      email, password
    }).catch(err => err.response?.data);

    if (!res) return alert("Server error");
    if (res.error) return alert(res.error);

    setToken(res.token);
    setName(res.name);
    setPage("home");
  };

  const createPost = async () => {
    if (!postText.trim()) return alert("Write something to post!");
    const res = await axios.post(
      "http://localhost:5000/api/posts/add",
      { text: postText },
      { headers: { token } }
    ).catch(err => err.response?.data);

    if (res && res.error) return alert(res.error || "Failed to post");
    // optimistic UI: add to top
    setPosts(prev => [{ userName: name, text: postText, createdAt: new Date().toISOString(), _id: Math.random().toString(36).slice(2) }, ...prev]);
    setPostText("");
  };

  return (
    <div className="min-h-screen flex flex-col">

      {/* NAVBAR */}
      {page === "home" && (
        <div className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-blue-600">Karthik LinkedIn Clone</h2>
          <div className="flex items-center space-x-4">
            <p className="font-semibold">{name}</p>
            <button
              className="px-4 py-1 bg-red-500 text-white rounded-md"
              onClick={() => {
                setPage('login'); setToken(''); setName(''); window.location.reload();
              }}
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* AUTH PAGES */}
      {(page === "login" || page === "signup") && (
        <div className="flex justify-center items-center h-screen">
          <div className="bg-white shadow-lg rounded-xl p-10 w-96">
            <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">
              {page === "login" ? "Welcome Back" : "Create Account"}
            </h2>

            <form onSubmit={page === "login" ? login : signup}>
              {page === "signup" && (
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="w-full px-4 py-2 mb-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                />
              )}

              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full px-4 py-2 mb-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full px-4 py-2 mb-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />

              <button className="w-full py-2 bg-blue-600 text-white rounded-lg mt-2 hover:bg-blue-700 transition">
                {page === "login" ? "Login" : "Signup"}
              </button>
            </form>

            <p className="text-center mt-4 text-sm">
              {page === "login" ? (
                <>
                  Don’t have an account?{" "}
                  <span
                    onClick={() => setPage("signup")}
                    className="text-blue-600 cursor-pointer"
                  >
                    Sign up
                  </span>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <span
                    onClick={() => setPage("login")}
                    className="text-blue-600 cursor-pointer"
                  >
                    Login
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      )}

      {/* HOME PAGE */}
      {page === "home" && (
        <div className="max-w-2xl mx-auto mt-10">

          {/* POST BOX */}
          <div className="bg-white shadow-lg rounded-xl p-5 mb-6">
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="Share something with the world..."
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
            ></textarea>

            <div className="flex justify-between items-center mt-3">
              <div className="text-sm text-gray-500">You're posting as <span className="font-semibold">{name}</span></div>
              <button
                onClick={createPost}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Post
              </button>
            </div>
          </div>

          {/* FEED */}
          <h3 className="text-xl font-bold mb-4">Latest Posts</h3>

          {posts.map((p) => (
            <div
              key={p._id}
              className="bg-white shadow-md rounded-xl p-5 mb-4"
            >
              <h4 className="font-bold text-lg text-blue-600">{p.userName}</h4>
              <p className="mt-2 text-gray-800">{p.text}</p>
              <p className="text-sm mt-3 text-gray-500">
                {new Date(p.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
