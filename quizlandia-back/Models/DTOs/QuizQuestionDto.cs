public class QuizQuestionDto
{
    public int QuestionID { get; set; }
    public string QuestionText { get; set; }
    public int QuestionOrder { get; set; }
    public int QuestionType { get; set; }
    public List<QuizAnswerDto> Answers { get; set; }
}
