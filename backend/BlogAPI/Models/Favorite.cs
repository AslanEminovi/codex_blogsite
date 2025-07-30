using System.ComponentModel.DataAnnotations;

namespace BlogAPI.Models
{
    public class Favorite
    {
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public int BlogId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual User User { get; set; } = null!;
        public virtual Blog Blog { get; set; } = null!;
    }
}