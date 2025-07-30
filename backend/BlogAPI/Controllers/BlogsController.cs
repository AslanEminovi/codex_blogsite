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
    public class BlogsController : ControllerBase
    {
        private readonly BlogDbContext _context;

        public BlogsController(BlogDbContext context)
        {
            _context = context;
        }

        // GET: api/blogs - Get all blogs (public)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BlogResponse>>> GetBlogs()
        {
            var userId = GetUserId(); // May be null for anonymous users

            var blogs = await _context.Blogs
                .Include(b => b.User)
                .OrderByDescending(b => b.CreatedAt)
                .Select(b => new BlogResponse
                {
                    Id = b.Id,
                    Title = b.Title,
                    Content = b.Content,
                    Summary = b.Summary,
                    CreatedAt = b.CreatedAt,
                    UpdatedAt = b.UpdatedAt,
                    UserId = b.UserId,
                    Username = b.User.Username,
                    IsFavorited = userId != null && _context.Favorites.Any(f => f.UserId == userId && f.BlogId == b.Id)
                })
                .ToListAsync();

            return Ok(blogs);
        }

        // GET: api/blogs/{id} - Get specific blog (public)
        [HttpGet("{id}")]
        public async Task<ActionResult<BlogResponse>> GetBlog(int id)
        {
            var userId = GetUserId(); // May be null for anonymous users

            var blog = await _context.Blogs
                .Include(b => b.User)
                .Where(b => b.Id == id)
                .Select(b => new BlogResponse
                {
                    Id = b.Id,
                    Title = b.Title,
                    Content = b.Content,
                    Summary = b.Summary,
                    CreatedAt = b.CreatedAt,
                    UpdatedAt = b.UpdatedAt,
                    UserId = b.UserId,
                    Username = b.User.Username,
                    IsFavorited = userId != null && _context.Favorites.Any(f => f.UserId == userId && f.BlogId == b.Id)
                })
                .FirstOrDefaultAsync();

            if (blog == null)
            {
                return NotFound();
            }

            return Ok(blog);
        }

        // GET: api/blogs/user/{userId} - Get blogs by user (public)
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<BlogResponse>>> GetBlogsByUser(int userId)
        {
            var currentUserId = GetUserId(); // May be null for anonymous users

            var blogs = await _context.Blogs
                .Include(b => b.User)
                .Where(b => b.UserId == userId)
                .OrderByDescending(b => b.CreatedAt)
                .Select(b => new BlogResponse
                {
                    Id = b.Id,
                    Title = b.Title,
                    Content = b.Content,
                    Summary = b.Summary,
                    CreatedAt = b.CreatedAt,
                    UpdatedAt = b.UpdatedAt,
                    UserId = b.UserId,
                    Username = b.User.Username,
                    IsFavorited = currentUserId != null && _context.Favorites.Any(f => f.UserId == currentUserId && f.BlogId == b.Id)
                })
                .ToListAsync();

            return Ok(blogs);
        }

        // GET: api/blogs/my - Get current user's blogs (authenticated)
        [HttpGet("my")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<BlogResponse>>> GetMyBlogs()
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var blogs = await _context.Blogs
                .Include(b => b.User)
                .Where(b => b.UserId == userId)
                .OrderByDescending(b => b.CreatedAt)
                .Select(b => new BlogResponse
                {
                    Id = b.Id,
                    Title = b.Title,
                    Content = b.Content,
                    Summary = b.Summary,
                    CreatedAt = b.CreatedAt,
                    UpdatedAt = b.UpdatedAt,
                    UserId = b.UserId,
                    Username = b.User.Username,
                    IsFavorited = _context.Favorites.Any(f => f.UserId == userId && f.BlogId == b.Id)
                })
                .ToListAsync();

            return Ok(blogs);
        }

        // POST: api/blogs - Create new blog (authenticated)
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<BlogResponse>> CreateBlog(BlogCreateRequest request)
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var blog = new Blog
            {
                Title = request.Title,
                Content = request.Content,
                Summary = request.Summary,
                UserId = userId.Value,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Blogs.Add(blog);
            await _context.SaveChangesAsync();

            // Load the blog with user details
            var createdBlog = await _context.Blogs
                .Include(b => b.User)
                .Where(b => b.Id == blog.Id)
                .Select(b => new BlogResponse
                {
                    Id = b.Id,
                    Title = b.Title,
                    Content = b.Content,
                    Summary = b.Summary,
                    CreatedAt = b.CreatedAt,
                    UpdatedAt = b.UpdatedAt,
                    UserId = b.UserId,
                    Username = b.User.Username
                })
                .FirstAsync();

            return CreatedAtAction(nameof(GetBlog), new { id = blog.Id }, createdBlog);
        }

        // PUT: api/blogs/{id} - Update blog (authenticated, owner only)
        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<BlogResponse>> UpdateBlog(int id, BlogUpdateRequest request)
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var blog = await _context.Blogs.FindAsync(id);
            if (blog == null)
            {
                return NotFound();
            }

            // Check if user owns the blog or is admin
            var userRole = GetUserRole();
            if (blog.UserId != userId && userRole != "Admin")
            {
                return Forbid();
            }

            blog.Title = request.Title;
            blog.Content = request.Content;
            blog.Summary = request.Summary;
            blog.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // Return updated blog with user details
            var updatedBlog = await _context.Blogs
                .Include(b => b.User)
                .Where(b => b.Id == id)
                .Select(b => new BlogResponse
                {
                    Id = b.Id,
                    Title = b.Title,
                    Content = b.Content,
                    Summary = b.Summary,
                    CreatedAt = b.CreatedAt,
                    UpdatedAt = b.UpdatedAt,
                    UserId = b.UserId,
                    Username = b.User.Username
                })
                .FirstAsync();

            return Ok(updatedBlog);
        }

        // DELETE: api/blogs/{id} - Delete blog (authenticated, owner or admin only)
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteBlog(int id)
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var blog = await _context.Blogs.FindAsync(id);
            if (blog == null)
            {
                return NotFound();
            }

            // Check if user owns the blog or is admin
            var userRole = GetUserRole();
            if (blog.UserId != userId && userRole != "Admin")
            {
                return Forbid();
            }

            _context.Blogs.Remove(blog);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private int? GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdClaim, out var userId) ? userId : null;
        }

        private string? GetUserRole()
        {
            return User.FindFirst(ClaimTypes.Role)?.Value;
        }
    }
}