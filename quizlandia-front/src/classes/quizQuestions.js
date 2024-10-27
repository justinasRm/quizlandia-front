import React, { Component } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { backEndpoint } from '../envs';
import { formatTimeSpan } from '../functions/formatTimeSpan';

/*
 * Quiz Question component for saving all created questions
 * (should be used as a middleware class for storing quiz questions)
 */
class QuizQuestions extends Component{

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
        };
    }

    render () {
        const { questions } = this.state;

        return (
            <>
                {questions.length > 0 ? (
                    questions.map((question, index) => (
                        <div className='question' key={question.id}>
                            <div>
                                <span>{index + 1}. {question.text}</span>  
                                <button onClick={() => this.deleteQuestion(index)}>
                                    <DeleteIcon />
                                </button>
                            </div>
                            <div className='answers'>
                                {question.answers.map((answer, ansIndex) => (
                                    <p key={ansIndex} className={answer.isCorrect ? 'correct-answer' : ''}>
                                        {this.indexToLetter(ansIndex)}) {answer.text}
                                    </p>
                                ))}
                            </div>
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
        const postAnswers = {"questions": []};

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

        const postQuizObj = {};

        postQuizObj.creatorId = 'string';
        postQuizObj.title = this.props.quizName;
        postQuizObj.description = this.props.quizDescription;
        postQuizObj.status = 0;
        postQuizObj.quizCode = this.props.quizCode;
        postQuizObj.timeLimit = formatTimeSpan(this.props.timeLimit);

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

        
        return;

        questions.map((question, index) => {
            // console.log('question ' + index)
            // console.log(question)



            // postAnswers + quizCode
            //             {
            //   "questions": [
            //     {
            //       "questionText": "string",
            //       "questionOrder": 0,
            //       "questionType": 0,
            //       "answers": [
            //         {
            //           "answerText": "string",
            //           "isCorrect": true
            //         }
            //       ]
            //     }
            //   ]
            // }
            let currentQuestion = {
                //TODO check if ID needed
                // id: question.id,
                order: index + 1,
                question: question.text,
                answers: question.answers.map((answer, ansIndex) => ({
                    //TODO check if ID needed
                    // id: answer.id,
                    order: ansIndex + 1,
                    text: answer.text,
                    isCorrect: answer.isCorrect,
                }))
            }
            console.log(currentQuestion)

            // quizToSend.push(currentQuestion);
        });
    }
}

export default QuizQuestions;