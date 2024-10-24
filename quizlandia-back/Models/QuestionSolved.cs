using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;
using quizlandia_back.Models;

public class QuestionSolved
{
    [Key]
    public int QuestionSolvedID { get; set; }

    [Required]
    public int QuizSolvedID { get; set; }

    [Required]
    public string SolverID { get; set; }

    [Required]
    public bool CorrectlySolved { get; set; }
}
