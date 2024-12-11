import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { backEndpoint } from '../envs';
import StatisticsCreator from './statisticsCreator';
import StatisticsSolver from './statisticsSolver';

const Statistics = () => {
    const accountTypeFromRedux = useSelector((state) => state.auth.userType);
    const uidFromRedux = useSelector((state) => state.auth.uid);
    const [userData, setUserData] = useState(null);
    const [solverData, setSolverData] = useState([]);
    const [creatorData, setCreatorData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quizSortOption, setQuizSortOption] = useState('titleAsc');

    const isCreator = accountTypeFromRedux === 0;
    const accountTypeLabel = isCreator ? 'Kūrėjo statistika' : 'Sprendėjo statistika';

    useEffect(() => {
        const fetchUserData = async () => {
            if (!uidFromRedux) {
                setLoading(false);
                return;
            }
            if (!isCreator) {
                try {
                    const response = await fetch(`${backEndpoint.studentStats(uidFromRedux)}`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    });

                    if (!response.ok) {
                        throw new Error(`Network response was not ok. Status: ${response.status}`);
                    }

                    const data = await response.json();
                    setUserData(data.user || null);
                    setSolverData(data.quizObjects || []);
                } catch (err) {
                    console.error('Error fetching user data:', err);
                } finally {
                    setLoading(false);
                }
            } else {
                try {
                    const response = await fetch(`${backEndpoint.creatorStats(uidFromRedux)}`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    });

                    if (!response.ok) {
                        throw new Error(`Network response was not ok. Status: ${response.status}`);
                    }

                    const data = await response.json();
                    console.log('data:')
                    console.log(data)
                    setUserData(data.user || null);
                    setCreatorData(data.quizObjects || []);
                } catch (err) {
                    console.error('Error fetching user data:', err);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUserData();
    }, [uidFromRedux]);

    // Sort quizzes based on chosen dropdown option
    const sortedQuizzes = [...solverData].sort((a, b) => {
        switch (quizSortOption) {
            case 'titleAsc':
                return a.title.localeCompare(b.title);
            case 'titleDesc':
                return b.title.localeCompare(a.title);
            case 'solvedCountAsc':
                return a.solvedCount - b.solvedCount;
            case 'solvedCountDesc':
                return b.solvedCount - a.solvedCount;
            default:
                return 0;
        }
    });

    return (
        <div style={{
            fontFamily: 'Inter, Arial, sans-serif',
            color: '#333',
            backgroundColor: '#f5f6f7',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <header style={{
                backgroundColor: '#fff',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                padding: '1.5rem',
                position: 'sticky',
                top: 0,
                zIndex: 10
            }}>
                <h1 style={{
                    textAlign: 'center',
                    fontSize: '2rem',
                    margin: '0 0 0.5rem 0',
                    fontWeight: '700'
                }}>Statistika</h1>
                <p style={{
                    textAlign: 'center',
                    margin: 0,
                    fontSize: '1.1rem',
                    color: '#555'
                }}>
                    <strong>{accountTypeLabel}</strong>
                </p>
            </header>

            <main style={{ flex: '1', maxWidth: '1000px', margin: '2rem auto', width: '100%', padding: '1rem' }}>
                {loading ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '300px'
                    }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            border: '6px solid #ddd',
                            borderTop: '6px solid #007bff',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            marginBottom: '1rem'
                        }} />
                        <p style={{ color: '#555', fontSize: '1.1rem' }}>Kraunama...</p>
                    </div>
                ) : (
                    isCreator ? (
                        <StatisticsCreator
                            userData={userData}
                            quizObjects={creatorData}
                        />
                    ) : (
                        <StatisticsSolver
                            userData={userData}
                            sortedQuizzes={sortedQuizzes}
                            quizSortOption={quizSortOption}
                            setQuizSortOption={setQuizSortOption}
                        />
                    )
                )}
            </main>
        </div>
    );
};

export default Statistics;
