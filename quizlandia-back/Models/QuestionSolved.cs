using System.ComponentModel.DataAnnotations;

namespace quizlandia_back.Models
{
    public class QuestionSolved
    {
        [Key]
        public int QSID { get; set; }
        [Required]
        public int QuestionID { get; set; }

        [Required]
        public int QuizSolvedID { get; set; }

        [Required]
        public bool CorrectlySolved { get; set; }
    }
}
