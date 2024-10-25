using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace quizlandia_back
{
    public class QuizQuestionDto
    {
        [Required]
        [MaxLength(500)]
        public string QuestionText { get; set; }

        [Required]
        public int QuestionOrder { get; set; }

        [Required]
        public int QuestionType { get; set; }

        public List<QuizAnswerDto> Answers { get; set; }
    }
}
