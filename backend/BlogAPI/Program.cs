using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using BlogAPI.Data;
using BlogAPI.Services;
using BlogAPI.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add DbContext (SQLite - no external database needed!)
builder.Services.AddDbContext<BlogDbContext>(options =>
    options.UseSqlite("Data Source=blogsite.db"));

// Add JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? "your-super-secret-jwt-key-that-is-at-least-32-characters-long";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "BlogAPI";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "BlogAPI";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateIssuer = true,
            ValidIssuer = jwtIssuer,
            ValidateAudience = true,
            ValidAudience = jwtAudience,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

// Add JWT Service
builder.Services.AddScoped<IJwtService, JwtService>();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000", // Next.js development
            "https://*.vercel.app",  // Vercel deployment
            "https://vercel.app",    // Vercel deployment
            "https://*.onrender.com" // Render deployment
        )
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials()
        .SetIsOriginAllowed(_ => true); // Allow any origin in development
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Create database and run migrations on startup
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<BlogDbContext>();
    context.Database.EnsureCreated();
    
    // Seed admin user if not exists
    await SeedAdminUser(context);
}

async Task SeedAdminUser(BlogDbContext context)
{
    const string adminEmail = "admin@blogsite.com";
    const string adminPassword = "admin123";
    const string adminUsername = "Admin";

    // Check if admin user already exists
    if (!await context.Users.AnyAsync(u => u.Email == adminEmail))
    {
        var adminUser = new User
        {
            Username = adminUsername,
            Email = adminEmail,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(adminPassword),
            Role = UserRole.Admin,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        context.Users.Add(adminUser);
        await context.SaveChangesAsync();
        
        Console.WriteLine($"Admin user created: {adminEmail} / {adminPassword}");
    }
}

app.Run();
