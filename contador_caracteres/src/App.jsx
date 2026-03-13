
import "./App.css";
import NavBar from "./components/Navbar/NavBar";
import CounterText from "./pages/CounterText/CounterText";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateFileZize from "./pages/CreateFileZize/CreateFileZize";
import Home from "./pages/Home/Home";

export default function App() {
  return (
    <BrowserRouter basename="/contador_caracteres">
    <NavBar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contador" element={<CounterText />} />
        <Route path="/generador" element={<CreateFileZize />} />
      </Routes>
    </BrowserRouter>
  );
}
