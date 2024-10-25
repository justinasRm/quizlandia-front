using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace quizlandia_back
{
    public class QuizAnswerDto
    {
        [Required]
        [MaxLength(500)]
        public string AnswerText { get; set; }

        [Required]
        public bool IsCorrect { get; set; }
    }
}
