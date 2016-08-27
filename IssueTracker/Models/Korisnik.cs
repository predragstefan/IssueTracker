using System.Data.Entity;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace IssueTracker.Models
{
    // You can add profile data for the user by adding more properties to your ApplicationUser class, please visit http://go.microsoft.com/fwlink/?LinkID=317594 to learn more.
    public class Korisnik : IdentityUser
    {
        public string Ime { get; set; }
        public string Prezime { get; set; }

        
        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<Korisnik> manager)
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, DefaultAuthenticationTypes.ApplicationCookie);
            // Add custom user claims here
            return userIdentity;
        }
        [InverseProperty("Kreirao")]
        public List<Problem> KreiraniProblemi { get; set; }
        //public List<Problem> PromenjeniProblemi { get; set; }

        public override string ToString()
        {
            return Ime + " " + Prezime;
        }
    }

    public class ApplicationDbContext : IdentityDbContext<Korisnik>
    {
        public DbSet<Problem> Problemi { get; set; }
        //dodaj isto ovo kao gore za vrstu problema
        public DbSet<VrstaProblema> VrsteProblema { get; set; }
        //public DbSet<ProblemKorisnik> ProblemKorisniks { get; set; }
        public DbSet<IstorijaProblema> IstorijeProblema { get; set; }
        public ApplicationDbContext()
            : base("DefaultConnection", throwIfV1Schema: false)
        {
        }

        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }

        public override int SaveChanges()
        {
            return base.SaveChanges();
        }
    }
}