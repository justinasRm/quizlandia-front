using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace quizlandia_back.Models
{
    public class QuizQuestion
    {
        [Key]
        public int QuestionID { get; set; }

        [Required]
        public int QuizID { get; set; }

        [Required]
        [MaxLength(500)] // Specify the max length as needed
        public string QuestionText { get; set; }

        [Required]
        public int QuestionOrder { get; set; }

        [Required]
        public int QuestionType { get; set; }

        // Add this navigation property
        public virtual Quiz Quiz { get; set; }
        public virtual ICollection<QuizAnswer> Answers { get; set; }
    }
}
