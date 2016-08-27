using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using IssueTracker.Models;

namespace IssueTracker.Controllers
{
    public class ProblemsController : Controller
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: Problems
        public ActionResult Index()
        {
            var problems = db.Problemi.Include(p => p.VrstaProblema);
            return View(problems.ToList());
        }

        // GET: Problems/Details/5
        public ActionResult Details(int? id)
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
        public ActionResult Create([Bind(Include = "Id,Naziv,DatumIzmene,Opis,VrstaProblemaID")] Problem problem)
        {
            if (ModelState.IsValid)
            {
                problem.DatumKreiranja = DateTime.UtcNow;
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
        public ActionResult Edit([Bind(Include = "ProblemID,Naziv,DatumKreiranja,DatumIzmene,DatumResavanja,VrstaProblemaID")] Problem problem)
        {
            if (ModelState.IsValid)
            {
                db.Entry(problem).State = EntityState.Modified;
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
