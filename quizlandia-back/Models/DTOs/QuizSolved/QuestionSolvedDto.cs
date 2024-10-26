using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace quizlandia_back
{
    public class QuestionSolvedDto
    {
        public int QuizSolvedID { get; set; }
        public int QuestionID { get; set; }
        public bool CorrectlySolved { get; set; }
    }
}
