import { Input, Button, TextField } from '@mui/material';
import React from 'react';
import { backEndpoint } from '../envs';
import { useNavigate } from 'react-router-dom';

const SearchPage = () => {

    const [searchValue, setSearchValue] = React.useState('');
    const [showResults, setShowResults] = React.useState(false);
    const navigate = useNavigate();

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
        },
        searchComponent: {
            width: '90%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
        }
    };

    function handleSubmit(e) {
        if(e) e.preventDefault();
        console.log('submitted. value: ' + searchValue);
        if (!searchValue) {
            setShowResults(false);
            return;
        }
        fetch(`${backEndpoint.getAllQuizes}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })
        setShowResults(true);
    }

    function openQuizPage(id) {
        navigate('/quiz/' + id);
    }

    const Results = () => {
        return (
            <div style={{ width: '90%'}}>
                <h2>Rasti klausimynai</h2>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                    <>{[0, 0, 0].map((val, ind) => {
                        return (
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', backgroundColor: 'white', marginBottom: 5}}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '50%'}}>
                                    <h3>Klausimyno pavadinimas</h3>
                                    <h4>Klausimyno kodas</h4>
                                    <h4>Dar kazkokie kiti duomenys</h4>
                                    {/* bet kokia kita info apie quiza */}
                                </div>
                                <Button variant='contained' style={{ height: 60, width: 100, marginLeft: 20}} onClick={()=>{openQuizPage(ind)}}>Peržiūrėti</Button>
                            </div>
                        );
                    }) }</>

                </div>
            </div>
        );
    }


    return (
        <div style={styles.container}>
            <h1 style={{ marginTop: -30 }}>Paieška</h1>
            <form style={styles.searchComponent} onSubmit={(e)=>{handleSubmit(e)}}>
                <TextField placeholder='Įveskite klausimyno pavadinimą arba kodą' value={searchValue} onChange={(e)=>{setSearchValue(e.target.value)}} variant='outlined' style={{ width: '90%'}} />
                <Button variant='contained' style={{height: 60, marginLeft: -10, marginTop: -3}} onClick={()=>{handleSubmit()}}>Ieškoti</Button>
            </form>
            {showResults && <Results />}
        </div>
    );
};

export default SearchPage;