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

            // Configure relationships
            modelBuilder.Entity<QuizQuestion>()
                .HasOne(q => q.Quiz)
                .WithMany(qz => qz.Questions)
                .HasForeignKey(q => q.QuizID);

            modelBuilder.Entity<QuizAnswer>()
                .HasOne(a => a.Question)
                .WithMany(q => q.Answers)
                .HasForeignKey(a => a.QuestionID);

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
