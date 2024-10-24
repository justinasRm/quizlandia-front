import { Button } from '@mui/material';
import React, { Component } from 'react';

/*
 * Manual quiz component
 * User manually writes a question with answers
 * 
 * Requirements for passing submission:
 * 1) Question must not be empty
 * 2) 1 non-empty answer which is also selected as correct
 */
class ManualQuiz extends Component{

    constructor() {
        super();
        this.state = {
            questionText: '',
            answers: [
                { id: 1, text: '', isCorrect: false}
            ],
            canSubmit: false,
        };
    }

    render() {
        const { questionText, answers } = this.state;

        return (
            <>
                <div className='new-question-block'>
                    <div>
                        <div>
                            <span>Klausimas</span>
                        </div>
                        <textarea placeholder='Enter your question here.' value={questionText} onChange={this.handleQuestionChange}></textarea>
                    </div>
                    {answers.map((answer, index) => 
                        this.createAnswerComponent(answer, index)
                    )}
                </div>
                <Button id='add-new-answer' onClick={this.addNewAnswer}>Pridėti galimą atsakymą</Button>
            </>
        );
    }

    // Adds newly created answer to state
    addNewAnswer = () => {
        const newAnswerId = this.state.answers.length + 1;
        this.setState(prevState => ({
            answers: [...prevState.answers, { id: newAnswerId, text: '', isCorrect: false }]
        }));
    }

    /* 
    * ==============================
    * Methods for handling submission
    * ==============================
    */

    // If requirements are met, returns True and allows to save the form
    isFormValid() {

        if(this.state.questionText === ''){
            return false;
        }

        const hasValidAnswer = this.state.answers.some((answer) => 
            answer.text.trim() !== '' && answer.isCorrect
        );
        
        this.setState({canSubmit: hasValidAnswer}, () => {
            if(this.props.onFormChange){
                this.props.onFormChange(this.state.canSubmit);
            }
        });
    }

    // Returns form to default after submission
    resetForm() {
        this.setState({ questionText: '', answers: [{ id: 1, text: '', isCorrect: false }], canSubmit: false });
    }

    // Saves current question with answers to "QuizQuestions" class state
    saveQuizQuestion = () => {

        const { questionText, answers } = this.state;

        const question = {
            id: new Date().getTime(),
            text: questionText,
            answers: answers.filter(answer => answer.text.trim() !== ''),
        };

        this.props.onSubmit(question);
        this.resetForm();
    };

    /* 
    * ==============================
    * Methods called when input value changes
    * (if needed values are set, allows to save)
    * ==============================
    */
    handleQuestionChange = (e) => {
        this.setState({ questionText: e.target.value });
        this.isFormValid()
    }

    handleAnswerChange = (index, e) => {
        const newAnswers = [...this.state.answers];
        newAnswers[index].text = e.target.value;
        this.setState({ answers: newAnswers });
        this.isFormValid()
    }

    handleCheckboxChange = (index) => {
        const newAnswers = [...this.state.answers];
        newAnswers[index].isCorrect = !newAnswers[index].isCorrect;
        this.setState({ answers: newAnswers });
        this.isFormValid()
    }

    /* 
    * ==============================
    * Method for creating new answer inputs
    * ==============================
    */
    createAnswerComponent(answer, index) {
        return (
            <div className='answer-card' key={answer.id}>
                <div>
                    <span>Atsakymas {answer.id}</span>
                    <div>
                        <label>Ar teisingas?</label>
                        <input type='checkbox' checked={answer.isCorrect} onChange={() => this.handleCheckboxChange(index)}></input>
                    </div>
                </div>
                <textarea placeholder='Įveskite galimą atsakymą čia.' value={answer.text} onChange={(e) => this.handleAnswerChange(index, e)}></textarea>
            </div>
        );
    }
}

export default ManualQuiz;