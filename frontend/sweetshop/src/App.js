import { useEffect, useState } from "react";

const box = {
  border: "1px solid #ddd",
  padding: 15,
  marginBottom: 15,
  borderRadius: 6
};

const btn = {
  marginRight: 6,
  padding: "4px 8px",
  cursor: "pointer"
};

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");

  const [sweets, setSweets] = useState([]);

  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [search, setSearch] = useState({
    name: "",
    category: "",
    minPrice: "",
    maxPrice: ""
  });

  const [newSweet, setNewSweet] = useState({
    name: "",
    category: "",
    price: "",
    quantity: ""
  });

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(""), 2500);
  };

  const login = async () => {
    setError("");

    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
      setError("Invalid credentials");
      return;
    }

    const data = await res.json();
    setToken(data.token);
    setRole(data.role);
    showMessage("Logged in successfully");
  };

  const register = async () => {
    setError("");

    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
      setError("Registration failed");
      return;
    }

    setMode("login");
    showMessage("Registered successfully. Please login.");
  };

  const logout = () => {
    setToken("");
    setRole("");
    setSweets([]);
    setUsername("");
    setPassword("");
    showMessage("Logged out");
  };

  useEffect(() => {
    if (!token) return;
    fetchSweets();
  }, [token]);

  const fetchSweets = () => {
    fetch("http://localhost:5000/api/sweets", {
      headers: { Authorization: token }
    })
      .then(res => res.json())
      .then(setSweets);
  };

  const purchase = async (id) => {
    const res = await fetch(`http://localhost:5000/api/sweets/${id}/purchase`, {
      method: "POST",
      headers: { Authorization: token }
    });

    const data = await res.json();

    if (!data.success) {
      showMessage("Out of stock", "error");
      return;
    }

    setSweets(prev =>
      prev.map(s =>
        s.id === id ? { ...s, quantity: s.quantity - 1 } : s
      )
    );

    showMessage("Sweet purchased");
  };

  const restock = async (id) => {
    await fetch(`http://localhost:5000/api/sweets/${id}/restock`, {
      method: "POST",
      headers: { Authorization: token }
    });

    fetchSweets();
    showMessage("Sweet restocked");
  };

  const deleteSweet = async (id) => {
    if (!window.confirm("Delete this sweet?")) return;

    await fetch(`http://localhost:5000/api/sweets/${id}`, {
      method: "DELETE",
      headers: { Authorization: token }
    });

    fetchSweets();
    showMessage("Sweet deleted");
  };

  const addSweet = async () => {
    await fetch("http://localhost:5000/api/sweets", {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newSweet)
    });

    setNewSweet({ name: "", category: "", price: "", quantity: "" });
    fetchSweets();
    showMessage("Sweet added to inventory");
  };

  const searchSweets = async () => {
    const params = new URLSearchParams(search).toString();

    const res = await fetch(
      `http://localhost:5000/api/sweets/search?${params}`,
      { headers: { Authorization: token } }
    );

    const data = await res.json();
    setSweets(data);
  };

  return (
    <div style={{ padding: 20, maxWidth: 520 }}>
      <h1>Sweet Shop Management System</h1>

      {message && (
        <div
          style={{
            padding: 10,
            marginBottom: 10,
            borderRadius: 5,
            background: messageType === "error" ? "#ffe6e6" : "#e6fffa"
          }}
        >
          {message}
        </div>
      )}

      {!token && (
        <div style={box}>
          <h3>{mode === "login" ? "Login" : "Register"}</h3>

          <input
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <br /><br />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <br /><br />

          {mode === "login" ? (
            <button style={btn} onClick={login}>Login</button>
          ) : (
            <button style={btn} onClick={register}>Register</button>
          )}

          <button onClick={() => setMode(mode === "login" ? "register" : "login")}>
            Switch to {mode === "login" ? "Register" : "Login"}
          </button>

          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      )}

      {token && (
        <>
          <div style={box}>
            <p>Logged in as <b>{role}</b></p>
            <button onClick={logout}>Logout</button>
          </div>

          <div style={box}>
            <h3>Search Sweets</h3>
            <input placeholder="Name" onChange={e => setSearch({ ...search, name: e.target.value })} />
            <input placeholder="Category" onChange={e => setSearch({ ...search, category: e.target.value })} />
            <input placeholder="Min Price" type="number" onChange={e => setSearch({ ...search, minPrice: e.target.value })} />
            <input placeholder="Max Price" type="number" onChange={e => setSearch({ ...search, maxPrice: e.target.value })} />
            <br /><br />
            <button style={btn} onClick={searchSweets}>Search</button>
            <button onClick={fetchSweets}>Clear</button>
          </div>

          {role === "admin" && (
            <div style={box}>
              <h3>Add Sweet</h3>
              <input placeholder="Name" onChange={e => setNewSweet({ ...newSweet, name: e.target.value })} />
              <input placeholder="Category" onChange={e => setNewSweet({ ...newSweet, category: e.target.value })} />
              <input placeholder="Price" type="number" onChange={e => setNewSweet({ ...newSweet, price: e.target.value })} />
              <input placeholder="Quantity" type="number" onChange={e => setNewSweet({ ...newSweet, quantity: e.target.value })} />
              <br /><br />
              <button onClick={addSweet}>Add Sweet</button>
            </div>
          )}

          <h3>Sweets</h3>

          {sweets.length === 0 ? (
            <p>No sweets found.</p>
          ) : (
            sweets.map(s => (
              <div key={s.id} style={box}>
                <b>{s.name}</b>
                <p>Category: {s.category}</p>
                <p>Price: ₹{s.price}</p>
                <p>Available: {s.quantity}</p>

                {role === "user" && (
                  <button
                    style={{ ...btn, opacity: s.quantity === 0 ? 0.5 : 1 }}
                    onClick={() => purchase(s.id)}
                    disabled={s.quantity === 0}
                    title={s.quantity === 0 ? "Out of stock" : "Buy sweet"}
                  >
                    Purchase
                  </button>
                )}

                {role === "admin" && (
                  <>
                    <button style={btn} onClick={() => restock(s.id)}>Restock</button>
                    <button onClick={() => deleteSweet(s.id)}>Delete</button>
                  </>
                )}
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}

export default App;
