using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace quizlandia_back
{
    public class CreateQuizDto
    {
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
        public int Status { get; set; }

        [Required]
        [MaxLength(10)]
        public string QuizCode { get; set; }

        [Required]
        public TimeSpan TimeLimit { get; set; }
    }
}
