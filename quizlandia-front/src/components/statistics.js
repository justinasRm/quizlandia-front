import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { backEndpoint } from '../envs';

const Statistics = () => {
    const accountTypeFromRedux = useSelector((state) => state.auth.userType);
    const uidFromRedux = useSelector((state) => state.auth.uid);
    const [userSignupData, setUserSignupData] = useState(null);

    useEffect(() => {
        if (accountTypeFromRedux || uidFromRedux) {
            console.log('Account type:', accountTypeFromRedux);
            console.log('UID:', uidFromRedux);
        }
    }, [accountTypeFromRedux, uidFromRedux]);

    useEffect(() => { // cia yra correct way daryt API call - nebus problemu, tik error handling nera, bet px :)
        const fetchUserData = async () => {
            if (!uidFromRedux) return;

            try {
                const response = await fetch(`${backEndpoint.getUser}${uidFromRedux}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`Network response was not ok. Status: ${response.status}`);
                }

                const data = await response.json();
                setUserSignupData(data);
            } catch (err) {
                console.error('Error fetching user data:', err);
            }
        };

        fetchUserData();
    }, [uidFromRedux]);

    const isCreator = accountTypeFromRedux === 0;
    const accountTypeLabel = isCreator ? "Kūrėjo statistika" : "Sprendėjo statistika";

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Statistika</h1>
            <p style={{ textAlign: 'center', fontSize: '1.1rem', marginBottom: '2rem' }}>
                Paskyros tipas: <strong>{accountTypeLabel}</strong>
            </p>

            {userSignupData && (
                <div style={{
                    backgroundColor: '#f9f9f9',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '1.5rem'
                }}>
                    <h2 style={{ marginTop: '0', marginBottom: '1rem' }}>Vartotojo informacija</h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                        <div style={{ flex: '1 1 45%' }}>
                            <p><strong>Vardas:</strong> {userSignupData.name}</p>
                            <p><strong>Pavardė:</strong> {userSignupData.surname}</p>
                            <p><strong>El. paštas:</strong> {userSignupData.email}</p>
                            <p><strong>Vartotojo unikalus numeris:</strong> {userSignupData.userID}</p>
                            <p><strong>Paskyros sukūrimo data:</strong> {userSignupData.createdDate.split("T")[0]}</p>
                        </div>
                        <div style={{ flex: '1 1 45%' }}>
                            {isCreator && (
                                <>
                                    <p><strong>Sukurtų klausimynų skaičius:</strong> {userSignupData.quizCount}</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Statistics;
