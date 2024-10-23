using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace quizlandia_back.Models
{
    public class Quiz
    {
        [Key]
        public int QuizID { get; set; }

        [Required]
        [MaxLength(50)]
        public string CreatorId { get; set; }

        [Required]
        [MaxLength(50)]
        public string Title { get; set; }

        [Required]
        [MaxLength(100)]
        public string Description { get; set; }

        [Required]
        public DateTime CreatedDate { get; set; }

        [Required]
        public int Status { get; set; }

        // Add this navigation property
        public virtual ICollection<QuizQuestion> Questions { get; set; }
    }
}
