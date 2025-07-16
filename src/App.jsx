import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdivinaNombre from "./pages/AdivinaNombre";

export default function App() {
    return (
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "20px" }}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/adivina-nombre" element={<AdivinaNombre />} />
            </Routes>
        </div>
    );
}
