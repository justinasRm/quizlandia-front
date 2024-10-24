﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;
using quizlandia_back.Models;

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
}

