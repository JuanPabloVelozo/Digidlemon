import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";  // importa el Navbar
import Home from "./pages/Home";
import AdivinaNombre from "./pages/AdivinaNombre";
import DescripcionGame from "./pages/DescripcionGame";
import AtaqueSkill from "./pages/AtaqueSkill";
import AdivinaSilueta from "./pages/AdivinaSilueta";

import "./App.css";

export default function App() {
    const navigate = useNavigate();

    return (
        <div className="main-container">
            <div className="logo-container">
                <img
                    src="/images/logo2.png"
                    alt="Logo"
                    className="home-logo"
                    onClick={() => navigate("/")}
                />
            </div>

            <Navbar />  
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/guessname" element={<AdivinaNombre />} />
                <Route path="/guessdescription" element={<DescripcionGame />} />
                <Route path="/guessattack" element={<AtaqueSkill />} />
                <Route path="/guesssilhouette" element={<AdivinaSilueta />} />
            </Routes>
        </div>
    );
}
