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

        public List<CreateQuizQuestionDto> Questions { get; set; }
    }

    public class CreateQuizQuestionDto
    {
        [Required]
        [MaxLength(500)]
        public string QuestionText { get; set; }

        [Required]
        public int QuestionOrder { get; set; }

        [Required]
        public int QuestionType { get; set; }

        public List<CreateQuizAnswerDto> Answers { get; set; }
    }

    public class CreateQuizAnswerDto
    {
        [Required]
        [MaxLength(500)]
        public string AnswerText { get; set; }

        [Required]
        public bool IsCorrect { get; set; }
    }
}
