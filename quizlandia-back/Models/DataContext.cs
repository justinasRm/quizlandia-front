using Microsoft.EntityFrameworkCore;

namespace quizlandia_back.Models
{
    public partial class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Quiz> Quizzes { get; set; }
        public virtual DbSet<QuizQuestion> QuizQuestions { get; set; }
        public virtual DbSet<QuizAnswer> QuizAnswers { get; set; }
        public virtual DbSet<UserInfo> UserInfos { get; set; }
        public virtual DbSet<QuizSolved> QuizSolveds { get; set; }
        public virtual DbSet<QuestionSolved> QuestionSolveds { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure primary keys
            modelBuilder.Entity<Quiz>(entity =>
            {
                entity.HasKey(e => e.QuizID);
            });

            modelBuilder.Entity<QuizQuestion>(entity =>
            {
                entity.HasKey(e => e.QuestionID);
            });

            modelBuilder.Entity<QuizAnswer>(entity =>
            {
                entity.HasKey(e => e.AnswerID);
            });

            modelBuilder.Entity<UserInfo>(entity =>
            {
                entity.HasKey(e => e.UserID);
            });

            modelBuilder.Entity<QuizSolved>(entity =>
            {
                entity.HasKey(e => e.QuizSolvedID);
            });

            modelBuilder.Entity<QuestionSolved>(entity =>
            {
                entity.HasKey(e => e.QuestionSolvedID);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
