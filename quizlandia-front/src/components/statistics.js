import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { backEndpoint } from '../envs';

const Statistics = () => {
    const accountTypeFromRedux = useSelector((state) => state.auth.userType);
    const uidFromRedux = useSelector((state) => state.auth.uid);
    const [userData, setUserData] = useState(null);
    const [userQuizData, setUserQuizData] = useState([]);
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
                setUserQuizData(data.quizObjects || []);
            } catch (err) {
                console.error('Error fetching user data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [uidFromRedux]);

    // Sort quizzes based on chosen dropdown option
    const sortedQuizzes = [...userQuizData].sort((a, b) => {
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
                    Paskyros tipas: <strong>{accountTypeLabel}</strong>
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
                                        {isCreator && (
                                            <p><strong>Sukurtų klausimynų:</strong> {userData.quizCount}</p>
                                        )}
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

                                        {quiz.solveAttempts && quiz.solveAttempts.length > 0 && (
                                            <details style={{
                                                marginTop: '1rem',
                                                fontSize: '1.1rem'
                                            }}>
                                                <summary style={{
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    outline: 'none',
                                                    padding: '0.5rem 0'
                                                }}>
                                                    Peržiūrėti sprendimus ({quiz.solveAttempts.length})
                                                </summary>
                                                <div style={{ marginTop: '1rem' }}>
                                                    {quiz.solveAttempts.map((solved, solvedIndex) => (
                                                        <div key={solvedIndex} style={{
                                                            backgroundColor: '#ffffff',
                                                            borderLeft: '6px solid #28a745',
                                                            border: '1px solid #ccc',
                                                            borderRadius: '8px',
                                                            padding: '1rem',
                                                            marginBottom: '1rem'
                                                        }}>
                                                            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                                                                <strong style={{ fontSize: '1.2rem' }}>Teisingų atsakymų:</strong> <span style={{ fontWeight: '700' }}>{solved.correctAnswerCount}</span>
                                                            </p>
                                                            {solved.timeTaken !== '23:59:59' && (
                                                                <p><strong>Užtruko laiko:</strong> {solved.timeTaken}</p>
                                                            )}
                                                            <details style={{ marginTop: '0.8rem' }}>
                                                                <summary style={{
                                                                    fontWeight: '600',
                                                                    cursor: 'pointer'
                                                                }}>
                                                                    Klausimų sprendimai ({solved.questions.length})
                                                                </summary>
                                                                <div style={{ marginTop: '0.8rem' }}>
                                                                    <div style={{ marginTop: '0.8rem' }}>
                                                                        {solved.questions.map((question, questionIndex) => {
                                                                            const isUserCorrect = question.correctAnswersArray.includes(question.selectedAnswer);
                                                                            const allAnswers = [...question.correctAnswersArray, ...question.wrongAnswersArray];

                                                                            return (
                                                                                <div
                                                                                    key={questionIndex}
                                                                                    style={{
                                                                                        backgroundColor: '#fdfdfd',
                                                                                        border: '1px solid #ccc',
                                                                                        borderRadius: '6px',
                                                                                        padding: '1.5rem',
                                                                                        marginBottom: '1.5rem',
                                                                                    }}
                                                                                >
                                                                                    <h4 style={{
                                                                                        fontSize: '1.2rem',
                                                                                        fontWeight: '700',
                                                                                        marginBottom: '1rem'
                                                                                    }}>
                                                                                        {question.question}
                                                                                    </h4>

                                                                                    {/* User's Selected Answer Section */}
                                                                                    <div style={{
                                                                                        backgroundColor: isUserCorrect ? '#e6f7e6' : '#fdecea',
                                                                                        border: isUserCorrect ? '1px solid #8bc34a' : '1px solid #f5c6cb',
                                                                                        borderRadius: '4px',
                                                                                        padding: '1rem',
                                                                                        marginBottom: '2rem'
                                                                                    }}>
                                                                                        <p style={{
                                                                                            margin: 0,
                                                                                            fontSize: '1.1rem',
                                                                                            fontWeight: '600',
                                                                                            color: isUserCorrect ? '#2e7d32' : '#c0392b'
                                                                                        }}>
                                                                                            Jūsų pasirinktas atsakymas:
                                                                                        </p>
                                                                                        <p style={{
                                                                                            margin: '0.3rem 0 0 0',
                                                                                            fontSize: '1.1rem',
                                                                                            color: isUserCorrect ? '#2e7d32' : '#c0392b',
                                                                                            fontWeight: '500'
                                                                                        }}>
                                                                                            {question.selectedAnswer}
                                                                                        </p>
                                                                                        {!isUserCorrect && (
                                                                                            <p style={{
                                                                                                marginTop: '0.5rem',
                                                                                                fontSize: '1rem',
                                                                                                color: '#c0392b',
                                                                                                fontWeight: '500'
                                                                                            }}>
                                                                                                ❌ Deja, šis atsakymas neteisingas.
                                                                                            </p>
                                                                                        )}
                                                                                        {isUserCorrect && (
                                                                                            <p style={{
                                                                                                marginTop: '0.5rem',
                                                                                                fontSize: '1rem',
                                                                                                color: '#2e7d32',
                                                                                                fontWeight: '500'
                                                                                            }}>
                                                                                                ✅ Jūsų pasirinktas atsakymas yra teisingas.
                                                                                            </p>
                                                                                        )}
                                                                                    </div>

                                                                                    {/* All Answers Section */}
                                                                                    <div style={{
                                                                                        backgroundColor: '#f9f9f9',
                                                                                        border: '1px solid #ddd',
                                                                                        borderRadius: '4px',
                                                                                        padding: '1rem'
                                                                                    }}>
                                                                                        <p style={{
                                                                                            margin: 0,
                                                                                            fontSize: '1.1rem',
                                                                                            fontWeight: '600',
                                                                                            marginBottom: '0.8rem'
                                                                                        }}>
                                                                                            Visi atsakymai:
                                                                                        </p>
                                                                                        <ul style={{
                                                                                            listStyle: 'none',
                                                                                            margin: 0,
                                                                                            padding: 0
                                                                                        }}>
                                                                                            {allAnswers.map((answer, idx) => {
                                                                                                const isSelected = answer === question.selectedAnswer;
                                                                                                const isCorrectAnswer = question.correctAnswersArray.includes(answer);

                                                                                                let answerStyle = {
                                                                                                    marginBottom: '0.8rem',
                                                                                                    padding: '0.6rem 0.8rem',
                                                                                                    borderRadius: '4px',
                                                                                                    display: 'flex',
                                                                                                    alignItems: 'center',
                                                                                                    fontSize: '1.05rem',
                                                                                                    fontWeight: '500',
                                                                                                    color: '#333',
                                                                                                    backgroundColor: '#fff',
                                                                                                    border: '1px solid transparent'
                                                                                                };

                                                                                                let icon = '';
                                                                                                let label = '';

                                                                                                // Determine styling based on correctness and selection
                                                                                                if (isSelected && isCorrectAnswer) {
                                                                                                    // Selected and correct
                                                                                                    answerStyle.backgroundColor = '#e6f7e6';
                                                                                                    answerStyle.border = '1px solid #8bc34a';
                                                                                                    answerStyle.color = '#2e7d32';
                                                                                                    answerStyle.fontWeight = '600';
                                                                                                    icon = '✅';
                                                                                                    label = ' (Pasirinktas, Teisingas)';
                                                                                                } else if (isSelected && !isCorrectAnswer) {
                                                                                                    // Selected but incorrect
                                                                                                    answerStyle.backgroundColor = '#fdecea';
                                                                                                    answerStyle.border = '1px solid #f5c6cb';
                                                                                                    answerStyle.color = '#c0392b';
                                                                                                    answerStyle.fontWeight = '600';
                                                                                                    icon = '❌';
                                                                                                    label = ' (Pasirinktas, Neteisingas)';
                                                                                                } else if (!isSelected && isCorrectAnswer) {
                                                                                                    // Not selected but a correct answer
                                                                                                    answerStyle.color = '#2e7d32';
                                                                                                    icon = '✅';
                                                                                                    label = ' (Teisingas)';
                                                                                                } else {
                                                                                                    // Wrong answer and not selected
                                                                                                    // Keep default style with no icon
                                                                                                    // Maybe a subtle "Neteisingas" label to clarify
                                                                                                    icon = '❌';
                                                                                                    answerStyle.color = '#555';
                                                                                                    label = ' (Neteisingas)';
                                                                                                }

                                                                                                return (
                                                                                                    <li key={idx} style={answerStyle}>
                                                                                                        <span style={{ marginRight: '0.5rem' }}>{icon}</span>
                                                                                                        {answer}{label}
                                                                                                    </li>
                                                                                                );
                                                                                            })}
                                                                                        </ul>
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        })}


                                                                    </div>

                                                                </div>

                                                            </details>
                                                        </div>
                                                    ))}
                                                </div>
                                            </details>
                                        )}
                                    </div>
                                ))}
                            </section>
                        ) : (
                            <section style={{ marginTop: '2rem', textAlign: 'center' }}>
                                <p style={{ color: '#777', fontSize: '1.2rem' }}>Klausimynų nerasta.</p>
                            </section>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default Statistics;
