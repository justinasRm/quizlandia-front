import React, { Component } from 'react';
import QuizQuestion from './quizQuestion';

class ManualQuiz extends Component{

    constructor() {
        super();
        this.state = {
            questionText: '',
            createdAnswers: 1,
            answers: [
                { id: 1, text: '', isCorrect: false}
            ]
        };
    }

    render() {
        return (
            <>
                <div className='new-question-block'>
                    <div>
                        <div>
                            <span>Question</span>
                        </div>
                        <textarea placeholder='Enter your question here.' value={this.state.questionText} onChange={this.handleQuestionChange}></textarea>
                    </div>
                    {this.state.answers.map((answer, index) => 
                        this.createAnswerComponent(answer, index)
                    )}
                </div>
                <button id='add-new-answer' onClick={this.addNewAnswer}>Add new answer</button>
            </>
        );
    }

    canSubmitQuestion() {

        if(this.state.questionText === ''){
            return false;
        }

        const hasValidAnswer = this.state.answers.some((answer) => 
            answer.text.trim() !== '' && answer.isCorrect
        );
        
        QuizQuestion.questionValid = hasValidAnswer;
    }

    handleQuestionChange = (e) => {
        this.setState({ questionText: e.target.value });
        this.canSubmitQuestion()
    }

    handleAnswerChange = (index, e) => {
        const newAnswers = [...this.state.answers];
        newAnswers[index].text = e.target.value;
        this.setState({ answers: newAnswers });
        this.canSubmitQuestion()
    }

    handleCheckboxChange = (index) => {
        const newAnswers = [...this.state.answers];
        newAnswers[index].isCorrect = !newAnswers[index].isCorrect;
        this.setState({ answers: newAnswers });
        this.canSubmitQuestion()
    }

    createAnswerComponent(answer, index) {
        return (
            <div className='answer-card' key={answer.id}>
                <div>
                    <span>Answer {answer.id}</span>
                    <div>
                        <label>Correct</label>
                        <input type='checkbox' checked={answer.isCorrect} onChange={() => this.handleCheckboxChange(index)}></input>
                    </div>
                </div>
                <textarea placeholder='Enter your answer here.' value={answer.text} onChange={(e) => this.handleAnswerChange(index, e)}></textarea>
            </div>
        );
    }

    addNewAnswer = () => {
        this.setState(prevState => {
            const newAnswerNumber = prevState.createdAnswers + 1;
            return {
                createdAnswers: newAnswerNumber,
                answers: [
                    ...prevState.answers,
                    { id: newAnswerNumber, text: '', isCorrect: false}
                ]
            };
        });
    }
}

export default ManualQuiz;