using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace IssueTracker.Models
{
    public class IstorijaProblema
    {
        public int Id { get; set; }
        public int ProblemID { get; set; }
        [Required]
        [MaxLength(255)]
        public string Naziv { get; set; }

        public string Opis { get; set; }

        public DateTime DatumIzmene { get; set; }

        public string Izmenio { get; set; }

        public string VrstaProblema { get; set; }

        public Status Status { get; set; }
    }
}