import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
    // Mapping loghi location
    const logoMap: Record<string, string> = {
        'cancano': '/logos/Cancano.png',
        'arnoga': '/logos/arnoga.png',
        'campo': '/logos/campo-sportivo.jpg',
        'valdidentro': '/logos/valdidentro.png',
    };

    // Funzione per visualizzare loghi multipli per superadmin
    function renderLogo() {
        const uname = username.trim().toLowerCase();
        if (uname === 'superadmin') {
            return (
                <div style={{display:'flex',gap:'12px',justifyContent:'center',marginBottom:'12px'}}>
                    {Object.values(logoMap).map((src, i) => (
                        <img key={i} src={src} alt="Logo" style={{width:48,height:48,borderRadius:8,background:'#fff',boxShadow:'0 2px 8px rgba(0,0,0,0.12)'}} />
                    ))}
                </div>
            );
        }
        const logoSrc = logoMap[uname];
        if (logoSrc) {
            return (
                <img src={logoSrc} alt={uname} style={{width:72,height:72,borderRadius:12,background:'#fff',boxShadow:'0 2px 8px rgba(0,0,0,0.12)',marginBottom:'12px'}} />
            );
        }
        return <div style={{fontSize:'3rem',marginBottom:'12px'}}>🚲</div>;
    }
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const { data } = await axios.post("/api/auth/login", { username, password });
            localStorage.setItem("token", data.token);
            setLoading(false);
            navigate("/dashboard");
        } catch (err: any) {
            setLoading(false);
            setError(err.response?.data?.error || "Credenziali non valide");
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)"
        }}>
            <form
                onSubmit={handleSubmit}
                style={{
                    background: "#fff",
                    padding: "2rem 2.5rem",
                    borderRadius: "12px",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                    minWidth: "320px",
                    width: "100%",
                    maxWidth: "360px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.2rem"
                }}
                autoComplete="off"
            >
                {/* Logo dinamico sopra il titolo */}
                <div style={{display:'flex',justifyContent:'center'}}>{renderLogo()}</div>
                <h2 style={{
                    textAlign: "center",
                    marginBottom: "0.5rem",
                    color: "#2d3a4a",
                    fontWeight: 700
                }}>Accedi</h2>
                <label style={{fontWeight: 500, color: "#2d3a4a"}} htmlFor="username">Username</label>
                <input
                    id="username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Inserisci username"
                    style={{
                        padding: "0.7rem",
                        borderRadius: "6px",
                        border: "1px solid #bfcad6",
                        fontSize: "1rem"
                    }}
                    autoFocus
                    autoComplete="username"
                    disabled={loading}
                />
                <label style={{fontWeight: 500, color: "#2d3a4a"}} htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Inserisci password"
                    style={{
                        padding: "0.7rem",
                        borderRadius: "6px",
                        border: "1px solid #bfcad6",
                        fontSize: "1rem"
                    }}
                    autoComplete="current-password"
                    disabled={loading}
                />
                <button
                    type="submit"
                    style={{
                        background: loading ? "#bfcad6" : "#2d3a4a",
                        color: "#fff",
                        padding: "0.8rem",
                        border: "none",
                        borderRadius: "6px",
                        fontWeight: 600,
                        fontSize: "1.05rem",
                        cursor: loading ? "not-allowed" : "pointer",
                        transition: "background 0.2s"
                    }}
                    disabled={loading}
                >{loading ? "Accesso..." : "Login"}</button>
                {error && (
                    <div style={{
                        color: "#d32f2f",
                        background: "#fdecea",
                        borderRadius: "6px",
                        padding: "0.7rem",
                        textAlign: "center",
                        fontWeight: 500,
                        fontSize: "0.98rem"
                    }}>
                        {error}
                    </div>
                )}
                <div style={{marginTop: "1rem", fontSize: "0.95rem", color: "#6b7280", background: "#f8fafc", borderRadius: "6px", padding: "0.7rem"}}>
                    <strong>Credenziali di test:</strong><br/>
                    • cancano / cancano123<br/>
                    • arnoga / arnoga123<br/>
                    • campo / campo123<br/>
                    • superadmin / admin123
                </div>
            </form>
        </div>
    );
}