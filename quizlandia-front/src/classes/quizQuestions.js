import React, { Component } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';

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
                    <p>No questions created yet.</p>
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
    saveQuizToDatabase = () => {
        const { questions } = this.state;
        let quizToSend = []

        questions.map((question,index) => {

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

            quizToSend.push(currentQuestion);
        });

        //TODO 
        console.log("Saving quiz.........");
    }
}

export default QuizQuestions;