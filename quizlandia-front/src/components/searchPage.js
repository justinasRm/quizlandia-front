import { Button, TextField, Dialog, Slide } from '@mui/material';
import React from 'react';
import { backEndpoint } from '../envs';
import { useNavigate } from 'react-router-dom';

const SearchPage = () => {

    const [searchValue, setSearchValue] = React.useState('');
    const [data, setData] = React.useState(null);
    const [searchType, setSearchType] = React.useState('');
    const navigate = useNavigate();
    const [quizPopup, setQuizPopup] = React.useState(null);

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
        if (e) e.preventDefault();
        if (!searchValue) {
            setData([]);
            return;
        }
        fetch(`${backEndpoint.getQuizByCode + searchValue}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(res => res.json().then(data => {
            if (!data.status) {
                setData(data);
            } else {
                setData([]);
            }
        })).catch((err) =>
        {
            console.log('or err?:');
            console.log(err)
        })
    }

    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });



    const Results = () => {
        return (
            <div style={{ width: '90%'}}>
                <h2>Rasti klausimynai</h2>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                    <>{data && searchType === 'name' && data.length && data.map((val, ind) => {
                        console.log('data is: ', val);

                        return (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '50%', backgroundColor: 'white', marginBottom: 5}}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                    <h3 style={{ fontSize: 30, marginTop: 10 }}>{val.title || 'Klausimynas - fizika 9 klasė'}</h3>
                                    <h3>Kūrėjas: {val.creatorId || 'Dostojevskis Mikelandželas'}</h3>
                                    <h4>Iš viso sprendė: {val.solvedCount}</h4>
                                </div>
                                <Button variant='contained' style={{ height: 60, width: '100%'}} onClick={()=>{setQuizPopup(val)}}>Peržiūrėti</Button>
                            </div>
                        );
                    }) }</>

                    
                    {data && searchType === 'code' && data.title && <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '50%', backgroundColor: 'white', marginBottom: 5}}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                    <h3 style={{ fontSize: 30, marginTop: 10 }}>{data.title || 'Klausimynas - fizika 9 klasė'}</h3>
                                    <h3>Kūrėjas: {data.creatorId || 'Dostojevskis Mikelandželas'}</h3>
                                    <h4>Iš viso sprendė: {data.solvedCount}</h4>
                                </div>
                                <Button variant='contained' style={{ height: 60, width: '100%'}} onClick={()=>{setQuizPopup(data)}}>Peržiūrėti</Button>
                            </div>
                    }
                </div>
                <Dialog
                    open={quizPopup ? true : false}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={() => { setQuizPopup(null) }}
                    aria-describedby="alert-dialog-slide-description"
                    style={{padding: 10}}
                >
                    {quizPopup && <>
                                     <h2 style={{textAlign: 'center'}}>pradėti spręsti?</h2>
                    <div style={{paddingLeft: 30, paddingRight: 30, marginBottom: 20, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <div style={{marginRight: 50}}>
                            <h3 style={{margin: 0}}>pavadinimas</h3>
                            <h3 style={{margin: 0}}>Kūrėjas</h3>
                            <h3 style={{margin: 0}}>Iš viso sprendė</h3>
                        </div>
                        <div style={{height: '100%', width: 3, backgroundColor: 'black'}}></div>
                        <div>
                            <h3 style={{ margin: 0, fontWeight: 400 }}>{quizPopup.title || 'Klausimynas - fizika 9 klasė'}</h3>
                            <h3 style={{margin: 0, fontWeight: 400}}>{quizPopup.creatorId || 'Dostojevskis Mikelandželas'}</h3>
                            <h3 style={{margin: 0, fontWeight: 400}}>{quizPopup.solvedCount}</h3>
                        </div>
         
                    </div>
                    
                    <Button onClick={()=>{navigate(`/quiz/${quizPopup.quizCode}`) }} variant='contained'>Taip</Button>
                    <Button onClick={()=>{setQuizPopup(null)}}>Ne</Button>
                    </>}
       
                </Dialog>
            </div>
        );
    }


    return (
        <div style={styles.container}>
            <h1 style={{ marginTop: -30 }}>Paieška</h1>
               <div style={{marginBottom: 10}}>
                    <Button onClick={()=>{setSearchType('name')}} color={`${searchType === 'name' ? 'primary' : ''}`}>Pagal pavadinimą</Button>
                <Button onClick={() => { setSearchType('code') }} color={`${searchType === 'code' ? 'info' : ''}`} >Pagal kodą</Button>
                </div>
            {searchType === 'name' ?
                <h3>Kol kas nepasiekiama</h3> : searchType === 'code' ?
                    <form style={styles.searchComponent} onSubmit={(e) => { handleSubmit(e) }}>
                        <TextField placeholder='Įveskite klausimyno kodą' value={searchValue} length='3' onChange={(e) => { setSearchValue(e.target.value) }} variant='outlined' style={{ width: '90%' }} />
                        <Button variant='contained' style={{ height: 60, marginLeft: -10, marginTop: -3 }} onClick={() => { handleSubmit() }}>Ieškoti</Button>
                    </form>  : null}

            {!data ? null : data.length || data.title ? <Results /> : <text style={{ marginTop: 10}}>Nerasta</text>}
        </div>
    );
};

export default SearchPage;