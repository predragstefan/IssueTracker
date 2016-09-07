using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using IssueTracker.Models;
namespace IssueTracker.Controllers
{
    public class HomeController : Controller
    {
        private ApplicationUserManager _userManager;
        private ApplicationDbContext db = new ApplicationDbContext();
        public ApplicationUserManager UserManager
        {
            get { return _userManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>(); }
            private set { _userManager = value; }
        }

        public HomeController()
        {

        }
        public HomeController(ApplicationUserManager userManager)
        {
            UserManager = userManager;
        }

        public ActionResult Index()
        {
            HomeViewModel viewModel = new HomeViewModel();
            if (User.Identity.IsAuthenticated)
            {


                var trenutniKorisnikId = User.Identity.GetUserId();
                var trenutniKorisnik = UserManager.Users.Where(u => u.Id == trenutniKorisnikId)
                    .SingleOrDefault();
                var brojDodeljenihProblema = db.Problemi.Where(p => p.DodeljenoKorisnikuId == trenutniKorisnikId).Count();
               
                viewModel.ImePrezime = trenutniKorisnik.ImePrezime;
                viewModel.TrenutnoUlogovanKorisnikId = trenutniKorisnikId;
                viewModel.BrojProblemaTrenutnoUlogovanogKorisnika = brojDodeljenihProblema;
            }
            return View(viewModel);
        }

        public ActionResult About()
        {
            ViewBag.Message = "Designed by Pekara. All rights reserved.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Kontaktirajte me na mejl:";

            return View();
        }

        

    }
}