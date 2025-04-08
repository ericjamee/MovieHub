﻿using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MovieHub.API.Data;
using MovieHub.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<MoviesContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("MovieConnection")));

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "AllowFrontend",
        configurePolicy: policy =>
        {
            policy.AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

// Auth & Authorization setup
builder.Services.AddAuthorization();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Make sure CORS comes BEFORE auth middleware
app.UseCors("AllowFrontend");

// Authentication comes AFTER CORS
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapIdentityApi<IdentityUser>();

// Manual logout route (optional but nice)
app.MapPost("/logout", async (HttpContext context, SignInManager<IdentityUser> signInManager) =>
{
    await signInManager.SignOutAsync();
    context.Response.Cookies.Delete(".AspNetCore.Identity.Application");
    return Results.Ok(new { message = "Logout successful" });
}).RequireAuthorization();

// Ping endpoint to test auth state from frontend
app.MapGet("/pingauth", (ClaimsPrincipal user) =>
{
    if (!user.Identity?.IsAuthenticated ?? false)
        return Results.Unauthorized();

    var email = user.FindFirstValue(ClaimTypes.Email) ?? "unknown@example.com";
    return Results.Json(new { email });
}).RequireAuthorization();

app.Run();
