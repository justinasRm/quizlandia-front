import React from 'react';
import { Link } from 'react-router-dom';
import './mainPage.css';
import { ReactComponent as SettingsIcon } from './../assets/icons/settings.svg';
import { ReactComponent as CreateIcon } from './../assets/icons/create.svg';
import { ReactComponent as SearchIcon } from './../assets/icons/search.svg';
import { ReactComponent as StatisticsIcon } from './../assets/icons/statistic.svg';
import { ReactComponent as ForumIcon } from './../assets/icons/discussion.svg';
import { useSelector } from 'react-redux';

const MainPage = () => {

    //TODO 
    // get account type from redux

    const accountTypeFromRedux = useSelector((state) => state.auth.userType);

    return (
        <>
            <h1 style={{textAlign: "center", marginBottom: "40px"}}>Pagrindinis puslapis</h1>
            <div className="link-container-wrapper">
                <div className="link-container">

                    {accountTypeFromRedux === 1 ? <Link to="/quiz-creation">
                        <CreateIcon />
                        <span>Klausimyno kūrimas</span>
                    </Link> : <Link style={{cursor: 'not-allowed', backgroundColor: 'lightgray', pointerEvents: 'none'}} >
                        <CreateIcon style={{backgroundColor: 'lightgray'}}/>
                        <span>Klausimyno kūrimas</span>
                    </Link>}

                    {accountTypeFromRedux === 0 ? <Link to="/search-quizzes">
                        <SearchIcon />
                        <span>Naršyti klausimynus</span>
                    </Link> :
                        <Link style={{cursor: 'not-allowed', backgroundColor: 'lightgray', pointerEvents: 'none'}} >
                        <SearchIcon style={{backgroundColor: 'lightgray'}} />
                        <span>Naršyti klausimynus</span>
                    </Link>}

                    <Link to="/forum">
                        <ForumIcon />
                        <span>Forumas</span>
                    </Link>

                    <Link to="/statistics">
                        <StatisticsIcon />
                        <span>Statistika</span>
                    </Link>

                    <Link to="/settings">
                        <SettingsIcon />
                        <span>Profilio nustatymai</span>
                    </Link>
                    
                </div>
            </div>
        </>
    );
};

export default MainPage;