using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using MovieHub.API.Data;
using MovieHub.API.Services;
using System.Net.Http.Headers;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure HttpClient for Azure Recommender Service with SSL handling
builder.Services.AddHttpClient("AzureRecommender", client =>
{
    client.BaseAddress = new Uri("http://22b32fac-8ada-496a-844b-c2736f4293f6.eastus2.azurecontainer.io");
    client.DefaultRequestHeaders.Accept.Clear();
    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "wMWRkfqL4ons2R63cvhWgtXwodpnYehd");
    client.Timeout = TimeSpan.FromMinutes(3);
}).ConfigurePrimaryHttpMessageHandler(() =>
{
    return new HttpClientHandler
    {
        ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => true,
        SslProtocols = System.Security.Authentication.SslProtocols.None,
        ClientCertificateOptions = ClientCertificateOption.Manual,
        UseProxy = false,
        UseDefaultCredentials = true
    };
});

builder.Services.AddScoped<IAzureRecommenderService, AzureRecommenderService>();
builder.Services.AddSingleton<RecommendationStore>();

// SQLite DBs
builder.Services.AddDbContext<MoviesContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("MovieConnection")));

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("IdentityConnection")));

// ✅ Identity with built-in endpoints
builder.Services.AddIdentity<IdentityUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddApiEndpoints();

// Configure stronger password policy
builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 8;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireLowercase = true;
    options.Password.RequiredUniqueChars = 4;
});

// ✅ Cookie settings
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.None;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.Name = ".AspNetCore.Identity.Application";
});

// ✅ CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "https://lively-mushroom-0e516051e.6.azurestaticapps.net",
                "http://localhost:3000",
                "http://localhost:5000",
                "https://localhost:5000"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddAuthorization();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseHsts(); // 🔒 Enforce HTTPS strictly in production
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection(); 

// Add static file serving for Data directory
app.UseStaticFiles();
app.UseFileServer(new FileServerOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "Data")),
    RequestPath = "/data",
    EnableDirectoryBrowsing = false
});

app.Use(async (context, next) =>
{
    Console.WriteLine($"Incoming request from Origin: {context.Request.Headers["Origin"]}");
    await next();
});

app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapIdentityApi<IdentityUser>(); // ✅ ensures full endpoint coverage

app.MapPost("/logout", async (HttpContext context, SignInManager<IdentityUser> signInManager) =>
{
    await signInManager.SignOutAsync();

    context.Response.Cookies.Append(".AspNetCore.Identity.Application", "", new CookieOptions
    {
        Expires = DateTimeOffset.UnixEpoch,
        Path = "/", // Make sure this matches the original cookie's path
        Secure = true,
        HttpOnly = true,
        SameSite = SameSiteMode.None
    });

    return Results.Ok(new { message = "Logout successful" });
});

app.MapGet("/pingauth", async (ClaimsPrincipal user, UserManager<IdentityUser> userManager) =>
{
    if (!user.Identity?.IsAuthenticated ?? false)
        return Results.Unauthorized();

    var email = user.FindFirstValue(ClaimTypes.Email) ?? "unknown@example.com";
    var identityUser = await userManager.FindByEmailAsync(email);
    var roles = identityUser is not null
        ? await userManager.GetRolesAsync(identityUser)
        : new List<string>();

    return Results.Json(new { email, roles });
}).RequireAuthorization();


app.Run();
