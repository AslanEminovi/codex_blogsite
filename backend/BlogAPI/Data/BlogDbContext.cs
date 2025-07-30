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
        public DbSet<Favorite> Favorites { get; set; }

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

            // Configure Favorite entity
            modelBuilder.Entity<Favorite>(entity =>
            {
                entity.HasKey(e => e.Id);
                
                entity.HasOne(f => f.User)
                    .WithMany()
                    .HasForeignKey(f => f.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
                
                entity.HasOne(f => f.Blog)
                    .WithMany()
                    .HasForeignKey(f => f.BlogId)
                    .OnDelete(DeleteBehavior.Cascade);
                
                // Ensure one user can only favorite a blog once
                entity.HasIndex(e => new { e.UserId, e.BlogId }).IsUnique();
                entity.HasIndex(e => e.CreatedAt);
            });

            // Note: Admin user and sample blogs will be created via API when app first runs
        }
    }
}