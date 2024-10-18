import React from 'react';
import { Button } from '@mui/material';
import { logOut } from './../functions/authFunctions';
import { Link } from 'react-router-dom';

const Header = () => {

    return (
        <header className="header" style={{backgroundColor: "white", borderBottom: "1px solid lightgray", boxShadow: "rgba(0, 0, 0, 0.5) 0px 0px 17px -5px", marginBottom: "50px"}}>
            <nav className="navbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1440px", margin: "auto"}}>
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h2>Quizlandia</h2>
                </Link>
                <Button variant="contained" color="primary" onClick={()=>logOut()}>Log out</Button>
            </nav>
        </header>
    );
};

export default Header;