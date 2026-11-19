import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import PhotoDetail from './pages/PhotoDetail';
import LoginRegister from './pages/LoginRegister';
import Upload from './pages/Upload';

/**
 * App.jsx
 *
 * Top-level route configuration (React Router). BrowserRouter itself
 * lives in main.jsx, wrapping this component.
 */
export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/photos/:id" element={<PhotoDetail />} />
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <footer>&copy; {new Date().getFullYear()} Alzikrayat — MERN Edition</footer>
    </>
  );
}
