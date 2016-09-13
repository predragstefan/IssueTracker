using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Security.Claims;
using System.Threading.Tasks;

namespace IssueTracker.Models
{
    // You can add profile data for the user by adding more properties to your ApplicationUser class, please visit http://go.microsoft.com/fwlink/?LinkID=317594 to learn more.
    public class Korisnik : IdentityUser
    {
        public string Ime { get; set; }
        public string Prezime { get; set; }

        [Display(Name = "Ime i prezime")]
        public string ImePrezime
        {
            get
            {
                return string.Format("{0} {1}", Ime, Prezime);
            }
        }

        public string Fotografija { get; set; }

        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<Korisnik> manager)
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, DefaultAuthenticationTypes.ApplicationCookie);
            return userIdentity;
        }

        [InverseProperty("Kreirao")]
        public List<Problem> KreiraniProblemi { get; set; }

        //public List<Problem> PromenjeniProblemi { get; set; }

        [InverseProperty("DodeljenoKorisniku")]
        public List<Problem> DodeljeniProblemi { get; set; }

        public override string ToString()
        {
            return Ime + " " + Prezime;
        }
    }
}