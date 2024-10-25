using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace quizlandia_back
{
    public class QuizQuestionsDto
    {
        [Required]
        public List<QuizQuestionDto> Questions { get; set; }
    }
}