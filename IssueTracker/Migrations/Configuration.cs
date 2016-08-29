namespace IssueTracker.Migrations
{
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;
    using Models;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<IssueTracker.Models.ApplicationDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(IssueTracker.Models.ApplicationDbContext context)
        {
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data. E.g.
            //
            //    context.People.AddOrUpdate(
            //      p => p.FullName,
            //      new Person { FullName = "Andrew Peters" },
            //      new Person { FullName = "Brice Lambson" },
            //      new Person { FullName = "Rowan Miller" }
            //    );
            //

            DodajRolu(context, "Sluzbenik");
            DodajRolu(context, "Administrator");

            if (!context.Users.Any(u => u.UserName == "peki"))
            {
                var store = new UserStore<Korisnik>(context);
                var manager = new UserManager<Korisnik>(store);
                var user = new Korisnik { UserName = "peki", Ime="Peki", Prezime="Stefanovic" };

                manager.Create(user, "ChangeItAsap!");
                manager.AddToRole(user.Id, "Administrator");
            }

            context.VrsteProblema.AddOrUpdate(
                vp => vp.Naziv,
                new VrstaProblema { Naziv = "Logisticki" },
                new VrstaProblema { Naziv = "Operativni" },
                new VrstaProblema { Naziv = "Sistemski" },
                new VrstaProblema { Naziv = "Tehnicki" }
                );

            var peki = context.Users.Where(user => user.UserName == "peki").SingleOrDefault();
            if (peki != null)
            {
                context.Problemi.AddOrUpdate(
                    p => p.Naziv,
                    new Problem { Naziv = "Problem 1", DatumKreiranja = DateTime.UtcNow, Opis = "Neki levi opis smorio sam se", VrstaProblemaID = 2, Status = Status.Otvoren, Kreirao = peki },
                    new Problem { Naziv = "Problem Neki", DatumKreiranja = DateTime.UtcNow, Opis = "Neki levi opis smorio samNeki levi opis smorio sam se", VrstaProblemaID = 3, Status = Status.Trijaza, Kreirao = peki },
                    new Problem { Naziv = "Problem smorina", DatumKreiranja = DateTime.UtcNow, Opis = "Neki levi opis smorio sam seNeki levi opis smorio sam", VrstaProblemaID = 4, Status = Status.Aktivan, Kreirao = peki },
                    new Problem { Naziv = "Problem Milica", DatumKreiranja = DateTime.UtcNow, Opis = "Neki levi opis sNeki levi opis smorio samNeki levi opis smorio sammorio sam se", VrstaProblemaID = 1, Status = Status.Aktivan, Kreirao = peki }
                    );
            }
        }

        private static void DodajRolu(ApplicationDbContext context, string nazivRole)
        {
            if (!context.Roles.Any(r => r.Name == nazivRole))
            {
                var store = new RoleStore<IdentityRole>(context);
                var manager = new RoleManager<IdentityRole>(store);
                var role = new IdentityRole { Name = nazivRole };

                manager.Create(role);
            }
        }
    }
}
