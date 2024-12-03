using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using quizlandia_back.Models;

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
        public DateTime LastUpdateDate { get; set; }

        [Required]
        public int Status { get; set; }

        [Required]
        [MaxLength(10)]
        public string QuizCode { get; set; }

        public int SolvedCount { get; set; }
        [Required]
        public TimeSpan TimeLimit { get; set; }

        public virtual List<QuizQuestion> Questions { get; set; } = new List<QuizQuestion>();
        public virtual List<QuizSolved> QuizzesSolved { get; set; } = new List<QuizSolved>();
    }
}
