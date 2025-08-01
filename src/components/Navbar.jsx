import { Link } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar() {
    return (
        <nav className="navbar">
            <ul className="nav-links">
                <li><Link to="/guessname">🎯</Link></li>
                <li><Link to="/guessdescription">📝</Link></li>
                <li><Link to="/guessattack">⚔️</Link></li>
                <li><Link to="/guesssilhouette">📷</Link></li>
            </ul>
        </nav>
    );
}
