import React from 'react';
import { Button } from '@mui/material';
import { logOut } from './../functions/authFunctions';
import { Link } from 'react-router-dom';

const Header = () => {

    return (
        <header className="header" >
            <nav className="navbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h2>Quizlandia</h2>
                </Link>
                <Button variant="contained" color="primary" onClick={()=>logOut()}>Log out</Button>
            </nav>
        </header>
    );
};

export default Header;