using Microsoft.EntityFrameworkCore;
using BlogAPI.Models;

namespace BlogAPI.Data
{
    public class BlogDbContext : DbContext
    {
        public BlogDbContext(DbContextOptions<BlogDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Blog> Blogs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.HasIndex(e => e.Username).IsUnique();
                
                entity.Property(e => e.Role)
                    .HasConversion<int>();
            });

            // Configure Blog entity
            modelBuilder.Entity<Blog>(entity =>
            {
                entity.HasKey(e => e.Id);
                
                entity.HasOne(b => b.User)
                    .WithMany(u => u.Blogs)
                    .HasForeignKey(b => b.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
                
                entity.HasIndex(e => e.CreatedAt);
            });

            // Seed admin user
            var adminUserId = 1;
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = adminUserId,
                    Username = "admin",
                    Email = "admin@blogsite.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                    Role = UserRole.Admin,
                    CreatedAt = new DateTime(2024, 1, 1), // Fixed date for seeding
                    UpdatedAt = new DateTime(2024, 1, 1)
                }
            );
        }
    }
}