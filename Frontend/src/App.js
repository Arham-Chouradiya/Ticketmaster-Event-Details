import {BrowserRouter as Router, Navigate, Route, Routes, Switch} from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import SearchPage from './components/SearchPage';
import FavoritesPage from './components/FavoritesPage';

import './App.css';

function App() {
    return (
        <Router>
            <NavigationBar />
            <Routes>
                <Route path="/" element={<Navigate to="/search-page" />} />
                <Route path="/search-page" element={<SearchPage />} />
                <Route path="/favorites-page" element={<FavoritesPage />} />
            </Routes>
        </Router>
    );
}

export default App;
