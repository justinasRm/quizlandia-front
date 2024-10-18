class QuizQuestion {

    constructor(question, answers = []) {
        this.question = question;
        this.answers = answers;
    }

    addAnswer(answerText, isCorrect = false) {
        this.answers.push({ text: answerText, correctAnswer: isCorrect});
    }
}