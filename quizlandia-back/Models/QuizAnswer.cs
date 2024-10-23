using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace quizlandia_back.Models
{
    public class QuizAnswer
    {
        [Key]
        public int AnswerID { get; set; }

        [Required]
        public int QuestionID { get; set; }

        [ForeignKey("QuestionID")]
        public virtual QuizQuestion Question { get; set; }

        [Required]
        [MaxLength(500)] // Specify the max length as needed
        public string AnswerText { get; set; }

        [Required]
        public bool IsCorrect { get; set; }
    }
}
