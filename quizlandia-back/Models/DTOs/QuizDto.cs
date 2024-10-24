public class QuizDto
{
    public string QuizCode { get; set; }
    public string CreatorId { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public DateTime? CreatedDate { get; set; }
    public int Status { get; set; }
}
