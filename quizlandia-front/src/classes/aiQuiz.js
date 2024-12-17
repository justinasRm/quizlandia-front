import React, { Component } from 'react';
import { Button, TextField, MenuItem, Select, InputLabel, FormControl, FormHelperText } from '@mui/material';

class AiQuiz extends Component {
    constructor() {
        super();
        this.state = {
            prompt: '',
            language: 'english', // Default language value
            questionCount: 5, // Default question count
            answerCount: 3, // Default answer count
            isLoading: false,
            canSubmit: false,
            promptError: '' // Error message for prompt validation
        };
    }

    // Call this method from QuizPage when "Add question" is clicked in AI mode
    generateAiQuestion = async () => {
        const { prompt, language, questionCount, answerCount } = this.state;

        // Validate prompt length
        if (prompt.length < 3 || prompt.length > 25) {
            this.setState({ promptError: "Užklausa turi būti tarp 3 ir 25 simbolių." });
            return;
        }

        this.setState({ isLoading: true });

        try {
            const response = await fetch('http://localhost:1234/api/AiQuestions/generateQuestions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt,
                    language,
                    questionCount,
                    answerCount
                })
            });

            if (!response.ok) {
                throw new Error('AI klausimų generavimas nepavyko.');
            }

            const data = await response.json();

            // Assuming data = [{ id: 123, text: 'Question ...', answers: [...], ...}, ...]
            // Loop through each generated question and submit it to parent
            if (Array.isArray(data)) {
                data.forEach(question => {
                    this.props.onSubmit(question);
                });
            } else {
                console.warn("Neteisingas atsako formatas iš AI endpointo.");
            }

            // Reset form state
            this.setState({ prompt: '', isLoading: false, canSubmit: false, promptError: '' });
        } catch (error) {
            console.error(error);
            this.setState({ isLoading: false });
            alert("Nepavyko sugeneruoti klausimų. Patikrinkite serverio būseną.");
        }
    };

    handlePromptChange = (e) => {
        const val = e.target.value;
        this.setState({ prompt: val, canSubmit: val.trim().length >= 3 && val.trim().length <= 25 });
        if (this.props.onFormChange) {
            this.props.onFormChange(val.trim().length >= 3 && val.trim().length <= 25);
        }
    };

    handleLanguageChange = (e) => {
        this.setState({ language: e.target.value });
    };

    handleQuestionCountChange = (e) => {
        const val = parseInt(e.target.value, 10);
        this.setState({ questionCount: Math.min(Math.max(val, 1), 10) }); // Ensure value is between 1 and 10
    };

    handleAnswerCountChange = (e) => {
        const val = parseInt(e.target.value, 10);
        this.setState({ answerCount: Math.min(Math.max(val, 2), 5) }); // Ensure value is between 2 and 5
    };

    render() {
        const { prompt, language, questionCount, answerCount, isLoading, promptError } = this.state;

        return (
            <div className='new-question-block'>
                <div>
                    <div>
                        <span>AI generavimo užklausa</span>
                    </div>
                    <TextField
                        fullWidth={true}
                        placeholder='Įveskite užklausą klausimams generuoti'
                        value={prompt}
                        onChange={this.handlePromptChange}
                        error={!!promptError}
                        helperText={promptError || 'Užklausa turi būti tarp 3 ir 25 simbolių.'}
                    />
                </div>
                <FormControl fullWidth>
                    <InputLabel>Pasirinkite kalbą</InputLabel>
                    <Select 
                        value={language} 
                        onChange={this.handleLanguageChange}
                        label="Pasirinkite kalbą"
                    >
                        <MenuItem value="english">English</MenuItem>
                        <MenuItem value="lithuanian">Lietuvių k.</MenuItem>
                    </Select>
                </FormControl>
                <div>
                    <TextField
                        label="Klausimų skaičius"
                        type="number"
                        fullWidth={true}
                        value={questionCount}
                        onChange={this.handleQuestionCountChange}
                        inputProps={{ min: 1, max: 10 }}
                        helperText="Maksimalus skaičius: 10"
                    />
                </div>
                <div>
                    <TextField
                        label="Atsakymų skaičius kiekvienam klausimui"
                        type="number"
                        fullWidth={true}
                        value={answerCount}
                        onChange={this.handleAnswerCountChange}
                        inputProps={{ min: 2, max: 5 }}
                        helperText="Maksimalus skaičius: 5"
                    />
                </div>
                <Button
                    variant='contained'
                    onClick={this.generateAiQuestion}
                    disabled={!this.state.canSubmit || isLoading}
                    style={{ marginTop: '20px' }}
                >
                    {isLoading ? "Generuojama..." : "Generuoti klausimus"}
                </Button>
            </div>
        );
    }
}

export default AiQuiz;
