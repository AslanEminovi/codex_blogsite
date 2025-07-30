using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using BlogAPI.Data;
using BlogAPI.Models;

namespace BlogAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FavoritesController : ControllerBase
    {
        private readonly BlogDbContext _context;

        public FavoritesController(BlogDbContext context)
        {
            _context = context;
        }

        // GET: api/favorites - Get current user's favorite blogs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BlogResponse>>> GetMyFavorites()
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var favoriteBlogs = await _context.Favorites
                .Where(f => f.UserId == userId)
                .Include(f => f.Blog)
                .ThenInclude(b => b.User)
                .OrderByDescending(f => f.CreatedAt)
                .Select(f => new BlogResponse
                {
                    Id = f.Blog.Id,
                    Title = f.Blog.Title,
                    Content = f.Blog.Content,
                    Summary = f.Blog.Summary,
                    CreatedAt = f.Blog.CreatedAt,
                    UpdatedAt = f.Blog.UpdatedAt,
                    UserId = f.Blog.UserId,
                    Username = f.Blog.User.Username,
                    IsFavorited = true
                })
                .ToListAsync();

            return Ok(favoriteBlogs);
        }

        // POST: api/favorites/{blogId} - Add blog to favorites
        [HttpPost("{blogId}")]
        public async Task<IActionResult> AddToFavorites(int blogId)
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            // Check if blog exists
            var blog = await _context.Blogs.FindAsync(blogId);
            if (blog == null)
            {
                return NotFound("Blog not found");
            }

            // Check if already favorited
            var existingFavorite = await _context.Favorites
                .FirstOrDefaultAsync(f => f.UserId == userId && f.BlogId == blogId);

            if (existingFavorite != null)
            {
                return BadRequest("Blog already favorited");
            }

            // Add to favorites
            var favorite = new Favorite
            {
                UserId = userId.Value,
                BlogId = blogId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Favorites.Add(favorite);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Blog added to favorites" });
        }

        // DELETE: api/favorites/{blogId} - Remove blog from favorites
        [HttpDelete("{blogId}")]
        public async Task<IActionResult> RemoveFromFavorites(int blogId)
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var favorite = await _context.Favorites
                .FirstOrDefaultAsync(f => f.UserId == userId && f.BlogId == blogId);

            if (favorite == null)
            {
                return NotFound("Favorite not found");
            }

            _context.Favorites.Remove(favorite);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Blog removed from favorites" });
        }

        // GET: api/favorites/check/{blogId} - Check if blog is favorited by current user
        [HttpGet("check/{blogId}")]
        public async Task<ActionResult<bool>> CheckIsFavorited(int blogId)
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return false;
            }

            var isFavorited = await _context.Favorites
                .AnyAsync(f => f.UserId == userId && f.BlogId == blogId);

            return Ok(isFavorited);
        }

        private int? GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdClaim, out var userId) ? userId : null;
        }
    }
}