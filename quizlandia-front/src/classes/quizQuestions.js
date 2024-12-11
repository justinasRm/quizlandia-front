import React, { Component } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { backEndpoint } from '../envs';
import { formatTimeSpan } from '../functions/formatTimeSpan';
import { useSelector } from 'react-redux';
import { Button, TextField } from '@mui/material';

/*
 * Quiz Question component for saving all created questions
 * (should be used as a middleware class for storing quiz questions)
 */
class QuizQuestions extends Component {

    /*
    * Example of "questions" object:
    * {
    *     id: int,
    *     text: string (question text),
    *     answers: [
    *         { id: int, text: string (answer text), isCorrect: boolean (true or false) },
    *     ]
    * }
    */
    constructor() {
        super();
        const savedQuestions = localStorage.getItem('questions');
        this.state = {
            questions: savedQuestions ? JSON.parse(savedQuestions) : [],
            editingIndex: null,
        };
    }
    // <QuizQuestions ref={questionsRef} quizName={quizName} timeLimit={timeLimit} quizCode={quizCode} quizDescription={quizDesc} uid={uid} setError={setError} setConfirmation={setConfirmation} onUpdateQuestions={updateCreatedQuestions} />


    render() {
        const { questions } = this.state;

        return (
            <>
                {questions.length > 0 ? (
                    questions.map((question, index) => (
                        <div className='question' key={question.id}>
                            {this.state.editingIndex === index ? <>
                                <div>
                                    <TextField style={{ width: '80%' }} value={question.text} onChange={(e) => {
                                        const updatedQuestions = [...questions];
                                        updatedQuestions[index].text = e.target.value;
                                        this.setState({ questions: updatedQuestions });
                                        localStorage.setItem('questions', JSON.stringify(updatedQuestions));
                                    }} ></TextField>
                                    <div>
                                        <EditIcon style={{
                                            cursor: 'pointer', '&:hover': {
                                                backgroundColor: 'green',
                                            },
                                        }} />
                                        <DeleteIcon style={{
                                            cursor: 'pointer'
                                        }} onClick={() => this.deleteQuestion(index)} />
                                    </div>

                                </div>
                                <div className='answers'>
                                    {question.answers.map((answer, ansIndex) => (
                                        <div key={ansIndex} style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <TextField variant='standard' style={{ width: '100%', marginRight: '5%' }} value={answer.text} onChange={(e) => {
                                                const updatedQuestions = [...questions];
                                                updatedQuestions[index].answers[ansIndex].text = e.target.value;
                                                this.setState({ questions: updatedQuestions });
                                                localStorage.setItem('questions', JSON.stringify(updatedQuestions));
                                            }} ></TextField>
                                            <div style={{ width: '100%', marginLeft: '5%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Button
                                                    fullWidth
                                                    variant="outlined"
                                                    sx={{
                                                        color: !answer.isCorrect ? 'green' : 'red',
                                                        borderColor: !answer.isCorrect ? 'green' : 'red',
                                                        '&:hover': {
                                                            borderColor: !answer.isCorrect ? 'darkgreen' : 'darkred',
                                                            backgroundColor: !answer.isCorrect ? 'lightgreen' : 'lightcoral',
                                                        },
                                                    }}
                                                    onClick={() => {
                                                        // if it's the only right answer, don't allow changing it to wrong
                                                        const correctOnes = question.answers.filter((ans) => ans.isCorrect);
                                                        if (correctOnes.length === 1 && correctOnes[0].id === answer.id) {
                                                            this.props.setError('Negalite pakeisti vienintelio teisingo atsakymo į neteisingą');
                                                            return;
                                                        }

                                                        const updatedQuestions = [...questions];
                                                        updatedQuestions[index].answers[ansIndex].isCorrect = !updatedQuestions[index].answers[ansIndex].isCorrect;
                                                        this.setState({ questions: updatedQuestions });
                                                        localStorage.setItem('questions', JSON.stringify(updatedQuestions));
                                                    }}
                                                >
                                                    {answer.isCorrect ? "Pakeisti į neteisingą" : "Pakeisti į teisingą"}
                                                </Button>
                                                <Button style={{ marginLeft: 10, marginRight: 10 }} onClick={() => {
                                                    const correctOnes = question.answers.filter((ans) => ans.isCorrect);
                                                    if (correctOnes.length === 1 && correctOnes[0].id === answer.id) {
                                                        this.props.setError('Negalite ištrinti vienintelio teisingo atsakymo');
                                                        return;
                                                    }

                                                    if (question.answers.length === 1) {
                                                        this.props.setError('Negalite ištrinti vienintelio atsakymo');
                                                        return;
                                                    }

                                                    const updatedQuestions = [...questions];
                                                    updatedQuestions[index].answers.splice(ansIndex, 1);
                                                    this.setState({ questions: updatedQuestions });
                                                    localStorage.setItem('questions', JSON.stringify(updatedQuestions));

                                                }}>Ištrinti</Button>
                                            </div>

                                        </div>
                                    ))}
                                    <Button fullWidth onClick={() => {
                                        const updatedQuestions = [...questions];
                                        updatedQuestions[index].answers.push({ id: updatedQuestions[index].answers.length, text: 'Įveskite klausimą', isCorrect: false });
                                        this.setState({ questions: updatedQuestions });
                                        localStorage.setItem('questions', JSON.stringify(updatedQuestions));
                                    }}>Pridėti naują atskymą</Button>


                                    {/* {question.answers.map((answer, ansIndex) => (
                                        <p key={ansIndex} className={answer.isCorrect ? 'correct-answer' : ''}>
                                            {this.indexToLetter(ansIndex)} {answer.text}
                                        </p>
                                    ))} */}
                                </div>
                                <Button fullWidth onClick={() => {
                                    this.setState({ editingIndex: null });
                                    localStorage.setItem('questions', JSON.stringify(questions));
                                    this.props.setError('');
                                }}>Baigti</Button>
                            </> : <>

                                <div>
                                    <span>{index + 1}. {question.text}</span>
                                    <div>
                                        <EditIcon style={{
                                            cursor: 'pointer'
                                        }} onClick={() => this.allowEditing(index)} />
                                        <DeleteIcon style={{
                                            cursor: 'pointer'
                                        }} onClick={() => this.deleteQuestion(index)} />
                                    </div>

                                </div>
                                <div className='answers'>
                                    {question.answers.map((answer, ansIndex) => (
                                        <p key={ansIndex} className={answer.isCorrect ? 'correct-answer' : ''}>
                                            {this.indexToLetter(ansIndex)} {answer.text}
                                        </p>
                                    ))}
                                </div>
                            </>}
                        </div>
                    ))
                ) : (
                    <p>Dar nėra sukurta klausimų.</p>
                )}
            </>
        );
    }

    addQuestion = (newQuestion) => {
        this.setState((prevState) => {
            const updatedQuestions = [...prevState.questions, newQuestion];

            localStorage.setItem('questions', JSON.stringify(updatedQuestions));

            this.props.onUpdateQuestions(prevState.questions.length + 1);

            return {
                questions: updatedQuestions,
            };
        });
    };

    deleteQuestion = (index) => {
        this.setState((prevState) => {
            const updatedQuestions = prevState.questions.filter((_, i) => i !== index);

            localStorage.setItem('questions', JSON.stringify(updatedQuestions));

            this.props.onUpdateQuestions(updatedQuestions.length);

            return {
                questions: updatedQuestions,
            };
        });
    };

    allowEditing = (index) => {
        this.setState({ editingIndex: index });

    }


    // For displaying separate answers as A), B), C) and etc...
    indexToLetter = (index) => {
        return String.fromCharCode(65 + index);
    };

    getQuestionCount = () => {
        return this.state.questions.length;
    }

    //TODO modify question object as needed before sending to API 
    saveQuizToDatabase = async () => {
        const { questions } = this.state;
        const postAnswers = { "questions": [] };

        if (!this.props.quizName.length) {
            this.props.setError('Pavadinimas negali būti tuščias');
            return;
        } else if (!this.props.quizDescription.length) {
            this.props.setError('Aprašymas negali būti tuščias');
            return;
        } else if (this.props.quizCode.length > 10) {
            this.props.setError('Kodas negali būti ilgesnis nei 10 simbolių');
            return;
        } else if (parseInt(this.props.timeLimit) > 14400) {
            this.props.setError('Laiko limitas negali būti didesnis nei 4 valandos');
            return;
        }

        this.props.setError('');

        try {
            const response = await fetch(backEndpoint.getQuizByCode + this.props.quizCode, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            console.log('response:', response.status);
            if (response.status === 200) {
                this.props.setError('Toks kodas jau egzistuoja. Pakeiskite kodą.');
                return;
            } else if (response.status === 404) {
                this.props.setError('');
            }
        } catch (err) {
            this.props.setError('Klaida išsaugant klausimyną. Pabandykite vėliau.');
            return;
        }
        const postQuizObj = {};

        postQuizObj.creatorId = this.props.uid;
        postQuizObj.title = this.props.quizName;
        postQuizObj.description = this.props.quizDescription;
        postQuizObj.status = 0;
        postQuizObj.quizCode = this.props.quizCode;
        postQuizObj.timeLimit = this.props.timeLimit ? formatTimeSpan(this.props.timeLimit) : "23:59:59";

        let postedQuizResponse;
        try {
            let errors;

            const response = await fetch(backEndpoint.postQuiz, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postQuizObj)
            });

            if (!response.ok) {
                if (response.status === 409) {
                    errors = { error: 'Klausimynas su tokiu kodu jau egzistuoja. Pakeiskite kodą.' };

                } else {
                    errors = { error: 'Klaida išsaugant klausimyną. Pabandykite vėliau.' };
                }
            } else {
                const data = await response.json();
                postedQuizResponse = data;
            }

            if (errors) {
                this.props.setError(errors.error);
                return;
            } else {
                this.props.setError('');
            }
        } catch (err) {
            this.props.setError('Klaida išsaugant klausimyną. Pabandykite vėliau durnius.');
            console.log(err);
            return;
        }

        if (!postedQuizResponse) { // some edge cases
            this.props.setError('Klaida išsaugant klausimyną. Pabandykite vėliau.');
            return;
        } else if (postedQuizResponse.quizID) { // means quiz was posted successfully. Continue posting answers.

        } else { // other, idfk edge cases
            this.props.setError('Klaida išsaugant klausimyną. Pabandykite vėliau.');
            return;
        }


        // .postAnswers
        const questionsToSend = { "questions": [] };
        questions.map((question, index) => {
            let currentQuestion = {
                //TODO check if ID needed
                id: question.id,
                questionOrder: index + 1,
                questionType: 0,
                questionText: question.text,
                answers: question.answers.map((answer, ansIndex) => ({
                    //TODO check if ID needed
                    // id: answer.id,
                    answerText: answer.text,
                    isCorrect: answer.isCorrect,
                }))
            }
            questionsToSend.questions.push(currentQuestion);
        });

        try {
            const response = await fetch(backEndpoint.postAnswers + this.props.quizCode, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(questionsToSend)
            });

            console.log('response:', response.status);

        } catch (err) {
            this.props.setError('Klaida išsaugant atsakymus. Pabandykite vėliau.');
            return;
        }

        this.props.setConfirmation('Klausimynas sėkmingai išsaugotas!');
        localStorage.removeItem('questions');
        localStorage.removeItem('quizName');
        localStorage.removeItem('quizDesc');
        localStorage.removeItem('timeLimit');
        return;
    }
}

export default QuizQuestions;