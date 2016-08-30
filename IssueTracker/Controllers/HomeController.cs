using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace IssueTracker.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
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