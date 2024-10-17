import React from 'react';
import { Link } from 'react-router-dom';
import './mainPage.css';
import SettingsIcon from '@mui/icons-material/Settings';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import ForumIcon from '@mui/icons-material/Forum';

const MainPage = () => {
    console.log('MainPage');

    return (
        <div className="link-container">

            <Link to="/settings">
                <SettingsIcon />
                Profile settings
            </Link>

            <Link to="/quiz-creation">
                <AddCircleIcon />
                Quiz creation
            </Link>

            <Link to="/search-quizzes">
                <SearchIcon />
                Search quizzes
            </Link>

            <Link to="/statistics">
                <LeaderboardIcon />
                Statistics
            </Link>

            <Link to="/forum">
                <ForumIcon />
                Forum
            </Link>
        </div>
    );
};

export default MainPage;