import { useEffect, useState } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [sweets, setSweets] = useState([]);
  const [error, setError] = useState("");

  const login = async () => {
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await res.json();
      setToken(data.token);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/api/sweets", {
      headers: { Authorization: token }
    })
      .then(res => res.json())
      .then(setSweets);
  }, [token]);

  const purchase = async (id) => {
    await fetch(`http://localhost:5000/api/sweets/${id}/purchase`, {
      method: "POST",
      headers: { Authorization: token }
    });

    setSweets(prev =>
      prev.map(s =>
        s.id === id ? { ...s, quantity: s.quantity - 1 } : s
      )
    );
  };

  return (
    <div style={{ padding: 20, maxWidth: 400 }}>
      <h1>Sweet Shop</h1>

      {!token && (
        <>
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
          <button onClick={login}>Login</button>

          {error && <p style={{ color: "red" }}>{error}</p>}
        </>
      )}

      {token && sweets.map(s => (
        <div key={s.id}>
          {s.name} — Qty: {s.quantity}
          <button
            onClick={() => purchase(s.id)}
            disabled={s.quantity === 0}
          >
            Purchase
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
