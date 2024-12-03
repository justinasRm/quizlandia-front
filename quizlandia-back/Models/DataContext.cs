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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure primary keys
            modelBuilder.Entity<Quiz>(entity =>
            {
                entity.HasKey(e => e.QuizID);
                entity.HasMany(q => q.Questions)
                    .WithOne(q => q.Quiz)
                    .HasForeignKey(q => q.QuizID)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<QuizQuestion>(entity =>
            {
                entity.HasKey(e => e.QuestionID);
                entity.HasOne(q => q.Quiz)
                    .WithMany(q => q.Questions)
                    .HasForeignKey(q => q.QuizID)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(q => q.Answers)
                    .WithOne(a => a.Question)
                    .HasForeignKey(a => a.QuestionID)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<QuizAnswer>(entity =>
            {
                entity.HasKey(e => e.AnswerID);
                entity.HasOne(a => a.Question)
                   .WithMany(q => q.Answers)
                   .HasForeignKey(a => a.QuestionID)
                   .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<UserInfo>(entity =>
            {
                entity.HasKey(e => e.UserID);
            });

            modelBuilder.Entity<QuizSolved>(entity =>
            {
                entity.HasKey(e => e.QuizSolvedID);
                entity.HasOne(qs => qs.Quiz)
                  .WithMany(q => q.QuizzesSolved)
                  .HasForeignKey(qs => qs.QuizID)
                  .OnDelete(DeleteBehavior.Cascade);
            });


            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
