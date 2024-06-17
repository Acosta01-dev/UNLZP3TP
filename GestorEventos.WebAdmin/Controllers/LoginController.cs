using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Mvc;

public class LoginController : Controller
{
    public IActionResult Index()
    {
        return View();
    }

    public async Task Login()
    {
        await HttpContext.ChallengeAsync(GoogleDefaults.AuthenticationScheme,
            new AuthenticationProperties
            {
                RedirectUri= Url.Action("GoogleResponse")
            });
      
    }
   public async Task<IActionResult> GoogleResponse()
    {
        var result = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        
        if (result?.Principal != null)
        {
            var claims = result.Principal.Identities.FirstOrDefault()?.Claims.Select(claim => new
            {
                claim.Issuer,
                claim.OriginalIssuer,
                claim.Type,
                claim.Value
            });

            // Almacenar los datos en la sesión si es necesario
            foreach (var claim in claims)
            {
                HttpContext.Session.SetString(claim.Type, claim.Value);
            }
            await HttpContext.Session.CommitAsync();  // Asegurarse de cometer los cambios en la sesión si es necesario

            // Redirigir a la página de inicio (Index)
            return RedirectToAction("Index", "Home");
            //return Json(claims);
        }

        return RedirectToAction("Index");
    }


    public IActionResult Logout()
    {
        HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return RedirectToAction("Index", "Home");
    }


    [HttpGet("/api/session/userdata")]
    public IActionResult GetUserData()
    {
        if (User.Identity.IsAuthenticated)
        {
            var claims = User.Claims.Select(claim => new
            {
                Type = claim.Type,
                Value = claim.Value
            });
            return Ok(claims);
        }
        else
        {
            return BadRequest("Usuario no autenticado");
        }
    }
}
