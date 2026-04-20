import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainMenu from './pages/MainMenu';
import CharacterCreation from './pages/CharacterCreation';
import CharacterManagement from './pages/CharacterManagement';
import DungeonExploration from './pages/DungeonExploration';
import Multiplayer from './pages/Multiplayer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/character-creation" element={<CharacterCreation />} />
        <Route path="/character" element={<CharacterManagement />} />
        <Route path="/dungeon" element={<DungeonExploration />} />
        <Route path="/multiplayer" element={<Multiplayer />} />
      </Routes>
    </Router>
  );
}

export default App;
