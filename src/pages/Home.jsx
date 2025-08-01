import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import DigimonList from "../components/DigimonList";
import "../styles/home.css";

export default function Home() {
    const [showList, setShowList] = useState(false);
    const navigate = useNavigate();
    const [date, setDate]= useState(new Date().toDateString().toLowerCase().trim());

    return (
        <div className="home-container">
            <h1>Select Game Mode</h1>
            <br />
            <div className="button-group">
                <button onClick={() => navigate("/guessname")}>
                    <span className="button-icon">🎯</span> Guess the Name
                </button>
                <button onClick={() => navigate("/guessdescription")}>
                    <span className="button-icon">📝</span> Whose Description Is It?
                </button>
                <button onClick={() => navigate("/guessattack")}>
                    <span className="button-icon">⚔️</span> Whose Attack Is It?
                </button>
                <button onClick={() => navigate("/guesssilhouette")}>
                    <span className="button-icon">📷</span> Whose Silhouette Is It?
                </button>
            </div>


            </div>
    );
}

