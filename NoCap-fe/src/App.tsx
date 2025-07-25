
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Detector from './pages/Detector';
import AIImageDetector from './pages/AIImageDetector';
import FakeNews from './pages/FakeNews';
import DeepfakeAnalyzer from './pages/DeepfakeAnalyzer';
import About from './pages/About';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="detector" element={<Detector />} />
          <Route path="ai-image" element={<AIImageDetector />} />
          <Route path="fake-news" element={<FakeNews />} />
          <Route path="deepfake-analyzer" element={<DeepfakeAnalyzer />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App


