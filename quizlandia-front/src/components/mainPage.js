import React from 'react';
import { Link } from 'react-router-dom';
import './mainPage.css';
import { ReactComponent as SettingsIcon } from './../assets/icons/settings.svg';
import { ReactComponent as CreateIcon } from './../assets/icons/create.svg';
import { ReactComponent as SearchIcon } from './../assets/icons/search.svg';
import { ReactComponent as StatisticsIcon } from './../assets/icons/statistic.svg';
import { ReactComponent as ForumIcon } from './../assets/icons/discussion.svg';

const MainPage = () => {

    //TODO 
    console.log('MainPage');

    return (
        <>
            <h1 style={{textAlign: "center", marginBottom: "40px"}}>Main page</h1>
            <div className="link-container-wrapper">
                <div className="link-container">

                    <Link to="/quiz-creation">
                        <CreateIcon />
                        <span>Quiz creation</span>
                    </Link>

                    <Link to="/search-quizzes">
                        <SearchIcon />
                        <span>Search quizzes</span>
                    </Link>

                    <Link to="/forum">
                        <ForumIcon />
                        <span>Forum</span>
                    </Link>

                    <Link to="/statistics">
                        <StatisticsIcon />
                        <span>Statistics</span>
                    </Link>

                    <Link to="/settings">
                        <SettingsIcon />
                        <span>Profile settings</span>
                    </Link>
                    
                </div>
            </div>
        </>
    );
};

export default MainPage;