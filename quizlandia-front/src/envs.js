export const backEndpoint = {
    getAllQuizes: 'http://localhost:1234/api/Quizzes',
    postUser: 'http://localhost:1234/api/Users',
    postQuiz: 'http://localhost:1234/api/Quizzes',
    getQuizByCode: 'http://localhost:1234/api/Quizzes/quizCode/',
    postAnswers: 'http://localhost:1234/api/QuestAns/quizCode/',
    getUser: 'http://localhost:1234/api/Users/',
    quizSolved: 'http://localhost:1234/api/QuizSolved',
    deleteQuiz: 'http://localhost:1234/api/Quizzes',
    studentStats: (id) => `http://localhost:1234/api/Users/${id}/stats/student`,
    creatorStats: (id) => `http://localhost:1234/api/Users/${id}/stats/teacher`,
}