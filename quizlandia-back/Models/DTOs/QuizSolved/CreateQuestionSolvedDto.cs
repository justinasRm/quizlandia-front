using System.ComponentModel.DataAnnotations;

namespace quizlandia_back
{
    public class CreateQuestionSolvedDto
    {
        [Required]
        public int QuizSolvedID { get; set; }

        [Required]
        public string SolverID { get; set; }

        [Required]
        public bool CorrectlySolved { get; set; }
    }
}
