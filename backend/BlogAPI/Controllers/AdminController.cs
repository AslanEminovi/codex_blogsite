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
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly BlogDbContext _context;

        public AdminController(BlogDbContext context)
        {
            _context = context;
        }

        // GET: api/admin/users - Get all users
        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<UserResponse>>> GetUsers()
        {
            var users = await _context.Users
                .Include(u => u.Blogs)
                .Select(u => new UserResponse
                {
                    Id = u.Id,
                    Username = u.Username,
                    Email = u.Email,
                    Role = u.Role,
                    CreatedAt = u.CreatedAt,
                    BlogCount = u.Blogs.Count
                })
                .OrderByDescending(u => u.CreatedAt)
                .ToListAsync();

            return Ok(users);
        }

        // GET: api/admin/blogs - Get all blogs with detailed info
        [HttpGet("blogs")]
        public async Task<ActionResult<IEnumerable<BlogResponse>>> GetAllBlogs()
        {
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
                    Username = b.User.Username
                })
                .ToListAsync();

            return Ok(blogs);
        }

        // DELETE: api/admin/blogs/{id} - Delete any blog as admin
        [HttpDelete("blogs/{id}")]
        public async Task<IActionResult> DeleteBlog(int id)
        {
            var blog = await _context.Blogs.FindAsync(id);
            if (blog == null)
            {
                return NotFound();
            }

            _context.Blogs.Remove(blog);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/admin/users/{id} - Delete user and all their blogs
        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var adminId = GetUserId();
            if (id == adminId)
            {
                return BadRequest("Cannot delete your own admin account.");
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            if (user.Role == UserRole.Admin)
            {
                return BadRequest("Cannot delete another admin user.");
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/admin/stats - Get dashboard statistics
        [HttpGet("stats")]
        public async Task<ActionResult<object>> GetStats()
        {
            var totalUsers = await _context.Users.CountAsync();
            var totalBlogs = await _context.Blogs.CountAsync();
            var totalAdmins = await _context.Users.CountAsync(u => u.Role == UserRole.Admin);
            var recentBlogs = await _context.Blogs.CountAsync(b => b.CreatedAt >= DateTime.UtcNow.AddDays(-7));

            var topUsers = await _context.Users
                .Include(u => u.Blogs)
                .Where(u => u.Role == UserRole.User)
                .OrderByDescending(u => u.Blogs.Count)
                .Take(5)
                .Select(u => new
                {
                    u.Id,
                    u.Username,
                    BlogCount = u.Blogs.Count
                })
                .ToListAsync();

            return Ok(new
            {
                TotalUsers = totalUsers,
                TotalBlogs = totalBlogs,
                TotalAdmins = totalAdmins,
                RecentBlogs = recentBlogs,
                TopUsers = topUsers
            });
        }

        private int? GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdClaim, out var userId) ? userId : null;
        }
    }
}