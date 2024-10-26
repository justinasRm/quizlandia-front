using quizlandia_back.Models;
using System.ComponentModel.DataAnnotations;

public class QuestionSolved
{
    [Key]
    public int QuestionSolvedID { get; set; }

    [Required]
    public int QuestionID { get; set; }

    [Required]
    public int QuizSolvedID { get; set; }

    [Required]
    public string SolverID { get; set; }

    [Required]
    public bool CorrectlySolved { get; set; }
}
