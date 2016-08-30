using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using IssueTracker.Models;
using Microsoft.AspNet.Identity;
using System.Web.UI.WebControls;

namespace IssueTracker.Controllers
{
    public class ProblemsController : Controller
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: Problems
        //ORIGINAL 
        //public ActionResult Index()
        //{
        //    var problems = db.Problemi.Include(p => p.VrstaProblema).Include(p => p.Kreirao).Include(p => p.PoslednjiIzmenio);
        //    return View(problems.ToList());
        //}

        public ActionResult Index(string sortOrder)
        {

            //ViewBag.VrstaSortParm = string.IsNullOrEmpty(sortOrder) ? "vrsta_desc" : "";
            ViewBag.VrstaSortParm = sortOrder == "Vrsta" ? "vrsta_desc" : "Vrsta";
            //ViewBag.VrstaSortParm = sortOrder == "vrsta_desc" ? "vrsta_asc" : "vrsta_desc";
            ViewBag.StatusSortParm = sortOrder == "Status" ? "status_desc" : "Status";
            ViewBag.DateSortParm = sortOrder == "Date" ? "date_desc" : "Date";
            var problemi = from p in db.Problemi.Include(p => p.VrstaProblema).Include(p => p.Kreirao).Include(p => p.PoslednjiIzmenio) select p;
            switch (sortOrder)
            {
                case "Vrsta":
                    problemi = problemi.OrderBy(p => p.VrstaProblema.Naziv);
                    break;
                case "vrsta_desc":
                    problemi = problemi.OrderByDescending(p => p.VrstaProblema.Naziv);
                    break;
                case "Date":
                    problemi = problemi.OrderBy(p => p.DatumKreiranja);
                    break;
                case "date_desc":
                    problemi = problemi.OrderByDescending(p => p.DatumKreiranja);
                    break;
                case "Status":
                    problemi = problemi.OrderBy(p => p.Status);
                    break;
                case "status_desc":
                    problemi = problemi.OrderByDescending(p => p.Status);
                    break;
                default:
                    break;
            }

            return View(problemi.ToList());
        }

        // GET: Problems/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Problem problem = db.Problemi.Where(p => p.Id == id.Value).Include(p => p.VrstaProblema).SingleOrDefault();
            
            if (problem == null)
            {
                return HttpNotFound();
            }
            return View(problem);
        }

        // GET: Problems/Create
        public ActionResult Create()
        {
            ViewBag.VrstaProblemaID = new SelectList(db.VrsteProblema, "VrstaProblemaID", "Naziv");
            return View();
        }

        // POST: Problems/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(Problem problem)
        {
            if (ModelState.IsValid)
            {
                problem.DatumKreiranja = DateTime.UtcNow;
                problem.Status = Status.Otvoren;
                db.Problemi.Add(problem);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            ViewBag.VrstaProblemaID = new SelectList(db.VrsteProblema, "VrstaProblemaID", "Naziv", problem.VrstaProblemaID);
            return View(problem);
        }

        // GET: Problems/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Problem problem = db.Problemi.Find(id);
            if (problem == null)
            {
                return HttpNotFound();
            }
            ViewBag.VrstaProblemaID = new SelectList(db.VrsteProblema, "VrstaProblemaID", "Naziv", problem.VrstaProblemaID);
            return View(problem);
        }

        // POST: Problems/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(Problem problem)
        {
            if (ModelState.IsValid)
            {
                var postojeciProblem = db.Problemi.Where(p => p.Id == problem.Id)
                    .Include(p => p.VrstaProblema).SingleOrDefault();

                IstorijaProblema istorijaProblema = new IstorijaProblema
                {
                    ProblemID = postojeciProblem.Id,
                    VremeAkcije = DateTime.UtcNow,
                    Izmenio = User.Identity.GetUserName(),
                    Naziv = postojeciProblem.Naziv,
                    Opis = postojeciProblem.Opis,
                    Status = postojeciProblem.Status,
                    VrstaProblema = postojeciProblem.VrstaProblema.Naziv
                };

                db.IstorijeProblema.Add(istorijaProblema);

                postojeciProblem.VremePoslednjeIzmene = DateTime.UtcNow;
                postojeciProblem.Naziv = problem.Naziv;
                postojeciProblem.Opis = problem.Opis;
                postojeciProblem.VrstaProblemaID = problem.VrstaProblemaID;
                //db.Entry(problem).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.VrstaProblemaID = new SelectList(db.VrsteProblema, "VrstaProblemaID", "Naziv", problem.VrstaProblemaID);
            return View(problem);
        }

        // GET: Problems/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Problem problem = db.Problemi.Find(id);
            if (problem == null)
            {
                return HttpNotFound();
            }
            return View(problem);
        }

        // POST: Problems/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            Problem problem = db.Problemi.Find(id);
            db.Problemi.Remove(problem);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
