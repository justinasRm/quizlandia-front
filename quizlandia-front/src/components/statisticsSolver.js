import React from 'react';

const StatisticsSolver = ({ userData, sortedQuizzes, quizSortOption, setQuizSortOption, isUserCorrect, solved }) => {
    return (
        <>
            {userData && (
                <section style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    padding: '2rem',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    marginBottom: '2rem'
                }}>
                    <h2 style={{
                        fontSize: '1.8rem',
                        fontWeight: '700',
                        marginBottom: '1.5rem'
                    }}>Vartotojo informacija</h2>
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '2rem',
                        fontSize: '1.1rem'
                    }}>
                        <div style={{ flex: '1 1 200px' }}>
                            <p><strong>Vardas:</strong> {userData.name}</p>
                            <p><strong>Pavardė:</strong> {userData.surname}</p>
                            <p><strong>El. paštas:</strong> {userData.email}</p>
                        </div>
                        <div style={{ flex: '1 1 200px' }}>
                            <p><strong>Unikalus ID:</strong> {userData.userID}</p>
                            <p><strong>Sukurta:</strong> {userData.createdDate.split('T')[0]}</p>
                        </div>
                    </div>
                </section>
            )}

            {sortedQuizzes && sortedQuizzes.length > 0 ? (
                <section style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    padding: '2rem',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1.5rem'
                    }}>
                        <h2 style={{
                            fontSize: '1.8rem',
                            fontWeight: '700',
                            margin: 0
                        }}>Klausimynai</h2>
                        <div>
                            <label style={{ marginRight: '0.5rem', fontSize: '1rem' }}>Rikiuoti:</label>
                            <select
                                value={quizSortOption}
                                onChange={(e) => setQuizSortOption(e.target.value)}
                                style={{
                                    padding: '0.4rem 0.6rem',
                                    borderRadius: '4px',
                                    border: '1px solid #ccc',
                                    fontSize: '1rem'
                                }}
                            >
                                <option value="titleAsc">Pagal pavadinimą (A-Ž)</option>
                                <option value="titleDesc">Pagal pavadinimą (Ž-A)</option>
                                <option value="solvedCountAsc">Mažiausiai kartų spręsta</option>
                                <option value="solvedCountDesc">Daugiausiai kartų spręsta</option>
                            </select>
                        </div>
                    </div>

                    {sortedQuizzes.map((quiz, index) => (
                        <div key={index} style={{
                            backgroundColor: '#f9f9f9',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            padding: '1.5rem',
                            marginBottom: '1.5rem',
                            fontSize: '1.1rem'
                        }}>
                            <h3 style={{
                                fontSize: '1.4rem',
                                fontWeight: '600',
                                marginBottom: '1rem',
                                color: '#007BFF'
                            }}>{quiz.title}</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
                                <div style={{ flex: '1 1 200px' }}>
                                    <p><strong>Kodas:</strong> {quiz.quizCode}</p>
                                    <p><strong>Aprašymas:</strong> {quiz.description}</p>
                                </div>
                                <div style={{ flex: '1 1 200px' }}>
                                    <p><strong>Sukurta:</strong> {quiz.createdDate.split("T")[0]}</p>
                                    <p><strong>Laiko limitas:</strong> {quiz.timeLimit === '23:59:59' ? 'Neribotas' : quiz.timeLimit}</p>
                                    <p><strong>spręsta kartų:</strong> {quiz.solvedCount}</p>
                                </div>
                            </div>

                            {/* The solve attempts and questions logic would also reside here */}
                            {/* For brevity, not repeating previous logic */}
                        </div>
                    ))}
                </section>
            ) : (
                <section style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <p style={{ color: '#777', fontSize: '1.2rem' }}>Klausimynų nerasta.</p>
                </section>
            )}
        </>
    );
};

export default StatisticsSolver;
