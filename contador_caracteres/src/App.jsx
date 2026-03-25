
import "./App.css";
import NavBar from "./components/Navbar/NavBar";
import CounterText from "./pages/CounterText/CounterText";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateFileZize from "./pages/CreateFileZize/CreateFileZize";
import EncoderDecoder from "./pages/Encoder/Encoder";
import ImageTools from "./pages/ImageTools/ImageTools";
import Home from "./pages/Home/Home";

export default function App() {
  return (
    <BrowserRouter basename="/contador_caracteres">
    <NavBar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contador" element={<CounterText />} />
        <Route path="/generador" element={<CreateFileZize />} />
        <Route path="/encoder" element={<EncoderDecoder />} />
        <Route path="/image-tools" element={<ImageTools />} />
      </Routes>
    </BrowserRouter>
  );
}
