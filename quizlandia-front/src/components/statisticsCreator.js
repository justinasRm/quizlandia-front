import React from 'react';

const StatisticsCreator = ({ userData, quizObjects }) => {
    return (
        <div style={{ width: '100%' }}>
            {/* User Information */}
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
                    }}>Kūrėjo informacija</h2>
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
                            <p><strong>Paskyra sukurta:</strong> {userData.createdDate.split('T')[0]}</p>
                            <p><strong>Sukurtų klausimynų skaičius:</strong> {userData.quizCount}</p>
                        </div>
                    </div>
                </section>
            )}

            {/* Quizzes */}
            {quizObjects && quizObjects.length > 0 ? (
                <section style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    padding: '2rem',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{
                        fontSize: '1.8rem',
                        fontWeight: '700',
                        marginBottom: '1.5rem'
                    }}>Sukurti klausimynai su sprendimo bandymais</h2>
                    {quizObjects.map((quiz, index) => (
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
                                    <p><strong>Laiko limitas:</strong> {quiz.timeLimit === '23:59:59' || quiz.timeLimit === '00:00:00' ? 'Neribotas' : quiz.timeLimit}</p>
                                    <p><strong>Spręsta kartų:</strong> {quiz.solvedCount}</p>
                                </div>
                            </div>

                            {/* Solve Attempts */}
                            {quiz.quizSolveds && quiz.quizSolveds.length > 0 && (
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
                                        Peržiūrėti sprendimus ({quiz.quizSolveds.length})
                                    </summary>
                                    <div style={{ marginTop: '1rem' }}>
                                        {quiz.quizSolveds.map((solved, solvedIndex) => (
                                            <div key={solvedIndex} style={{
                                                backgroundColor: '#ffffff',
                                                borderLeft: '6px solid #28a745',
                                                border: '1px solid #ccc',
                                                borderRadius: '8px',
                                                padding: '1rem',
                                                marginBottom: '1rem'
                                            }}>
                                                <p><strong>Teisingų atsakymų:</strong> {solved.correctAnswerCount}</p>
                                                <p><strong>Sprendė:</strong> {solved.fullSolverName}</p>

                                                {solved.timeTaken !== '23:59:59' && solved.timeTaken !== '00:00:00' && (
                                                    <p><strong>Užtruko laiko:</strong> {solved.timeTaken}</p>
                                                )}
                                                <p><strong>Sprendimo data:</strong> {solved.createdDate.split("T")[0]}</p>

                                                <details style={{ marginTop: '0.8rem' }}>
                                                    <summary style={{
                                                        fontWeight: '600',
                                                        cursor: 'pointer'
                                                    }}>
                                                        Pasirinkimai ({solved.questions.length})
                                                    </summary>
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
                                                                        padding: '1rem',
                                                                        marginBottom: '1rem',
                                                                    }}
                                                                >
                                                                    <h4 style={{
                                                                        fontSize: '1.1rem',
                                                                        fontWeight: '600',
                                                                        marginBottom: '1rem'
                                                                    }}>
                                                                        {question.question}
                                                                    </h4>

                                                                    {/* Selected Answer Feedback */}
                                                                    <div style={{
                                                                        backgroundColor: isUserCorrect ? '#e6f7e6' : '#fdecea',
                                                                        border: isUserCorrect ? '1px solid #8bc34a' : '1px solid #f5c6cb',
                                                                        borderRadius: '4px',
                                                                        padding: '0.8rem',
                                                                        marginBottom: '1.5rem'
                                                                    }}>
                                                                        <p style={{
                                                                            margin: 0,
                                                                            fontSize: '1rem',
                                                                            fontWeight: '600',
                                                                            color: isUserCorrect ? '#2e7d32' : '#c0392b'
                                                                        }}>
                                                                            Sprendėjo pasirinktas atsakymas:
                                                                        </p>
                                                                        <p style={{
                                                                            margin: '0.2rem 0 0 0',
                                                                            fontSize: '1rem',
                                                                            color: isUserCorrect ? '#2e7d32' : '#c0392b',
                                                                            fontWeight: '500'
                                                                        }}>
                                                                            {question.selectedAnswer === null ? 'Nepasirinkta' : question.selectedAnswer}
                                                                        </p>
                                                                        {!isUserCorrect && question.selectedAnswer !== null && (
                                                                            <p style={{
                                                                                marginTop: '0.5rem',
                                                                                fontSize: '0.95rem',
                                                                                color: '#c0392b'
                                                                            }}>
                                                                                Deja, šis atsakymas neteisingas.
                                                                            </p>
                                                                        )}
                                                                    </div>

                                                                    {/* All Answers in One Place */}
                                                                    <div style={{
                                                                        backgroundColor: '#f9f9f9',
                                                                        border: '1px solid #ddd',
                                                                        borderRadius: '4px',
                                                                        padding: '1rem'
                                                                    }}>
                                                                        <p style={{
                                                                            margin: 0,
                                                                            fontSize: '1rem',
                                                                            fontWeight: '600',
                                                                            marginBottom: '0.8rem'
                                                                        }}>
                                                                            Visi galimi atsakymai:
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
                                                                                    answerStyle.color = '#555';
                                                                                    icon = '❌';
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
        </div>
    );
};

export default StatisticsCreator;
