using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace quizlandia_back
{
    public class QuestionSolvedDto
    {
        public int QuestionSolvedID { get; set; }
        public int QuizSolvedID { get; set; }
        public string SolverID { get; set; }
        public bool CorrectlySolved { get; set; }
    }
}
