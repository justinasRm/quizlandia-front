using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace quizlandia_back
{
    public class CreateQuizSolvedDto
    {
        public int QuizID { get; set; }
        public string SolverID { get; set; }
        public int CorrectAnswerCount { get; set; }
        public TimeSpan TimeTaken { get; set; }
    }
}
