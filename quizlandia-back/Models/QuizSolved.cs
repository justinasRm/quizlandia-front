﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;
using quizlandia_back.Models;

namespace quizlandia_back.Models
{
    public class QuizSolved
    {
        [Key]
        public int QuizSolvedID { get; set; }

        [Required]
        public int QuizID { get; set; }

        [Required]
        public string SolverID { get; set; }

        [Required]
        public int CorrectAnswerCount { get; set; }
        [Required]
        public DateTime CreatedDate { get; set; }
        [Required]
        public TimeSpan TimeTaken { get; set; }
        public string QuestionSolveds { get; set; }

        // Add this navigation property
        public virtual Quiz Quiz { get; set; }
    }
}
