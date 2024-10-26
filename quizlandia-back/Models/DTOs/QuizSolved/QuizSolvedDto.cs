using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace quizlandia_back
{
    public class QuizSolvedDto
    {
        public int QuizSolvedID { get; set; }
        public int QuizID { get; set; }
        public string SolverID { get; set; }
        public int CorrectAnswerCount { get; set; }
        public TimeSpan TimeTaken { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
