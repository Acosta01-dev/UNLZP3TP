using GestorEventos.Servicios.Servicios;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;

var builder = WebApplication.CreateBuilder(args);

// Register your services
builder.Services.AddScoped<IServicioPersonas, ServicioPersonas>();
builder.Services.AddScoped<IServicioEventos, ServicioEventos>();

// Retrieve and log ClientId and ClientSecret
var clientId = builder.Configuration["Authentication:Google:ClientId"];
var clientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
Console.WriteLine($"ClientId: {clientId}");
Console.WriteLine($"ClientSecret: {clientSecret}");

// Configure Google authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
})
.AddCookie()
.AddGoogle(options =>
{
    options.ClientId = builder.Configuration["Authentication:Google:ClientId"];
    options.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];

    // Logging
    Console.WriteLine($"Configured ClientId: {options.ClientId}");
    Console.WriteLine($"Configured ClientSecret: {options.ClientSecret}");
});

// Add services to the container.
builder.Services.AddControllersWithViews();

// Configure session
builder.Services.AddSession(options =>
{
    // Configurar opciones de sesión si es necesario
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

// Habilitar el uso de sesión
app.UseSession();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
