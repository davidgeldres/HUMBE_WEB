import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AnimationLayout } from './components/layout/AnimationLayout';
import { Home } from './pages/Home';
import { Albums } from './pages/Albums';
import { AlbumDetail } from './pages/AlbumDetail';
import { Favorites } from './pages/Favorites';
import { About } from './pages/About';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AnimationLayout />}>
            <Route index element={<Home />} />
            <Route path="albums" element={<Albums />} />
            <Route path="albums/:id" element={<AlbumDetail />} />
            <Route path="favoritas" element={<Favorites />} />
            <Route path="info" element={<About />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
