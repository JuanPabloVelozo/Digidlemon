import { Link } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar() {
    return (
        <nav className="navbar">
            <ul className="nav-links">
                <li><Link to="/adivina-nombre">🎯</Link></li>
                <li><Link to="/de-quien-es-la-descripcion">📝</Link></li>
                <li><Link to="/de-quien-es-el-ataque">⚔️</Link></li>
                <li><Link to="/de-quien-silueta">📷</Link></li>
            </ul>
        </nav>
    );
}
