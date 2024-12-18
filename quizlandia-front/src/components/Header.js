import React from 'react';
import { Button } from '@mui/material';
import { logOut } from './../functions/authFunctions';
import { Link } from 'react-router-dom';

const Header = ({ accountType }) => {

    return (
        <header className="header" style={{backgroundColor: "white", borderBottom: "1px solid lightgray", boxShadow: "rgba(0, 0, 0, 0.5) 0px 0px 17px -5px", marginBottom: "50px"}}>
            <nav className="navbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "90%", margin: "auto"}}>
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h2>Quizlandia</h2>
                </Link>
                <div style={{ display: "flex", gap: "20px", alignItems: "center"}}>
                    <span style={{ fontWeight: 600}}>Tipas: {accountType === 0 ? "kūrėjas" : "sprendėjas"}</span>
                    <Button variant="contained" color="primary" onClick={()=>logOut()}>Atsijungti</Button>
                </div>
            </nav>
        </header>
    );
};

export default Header;