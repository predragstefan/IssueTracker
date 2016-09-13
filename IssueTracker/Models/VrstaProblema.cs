using System.Collections.Generic;
using System.ComponentModel;

namespace IssueTracker.Models
{
    public class VrstaProblema
    {
        public int VrstaProblemaID { get; set; }

        [DisplayName("Vrsta problema")]
        public string Naziv { get; set; }

        public List<Problem> Problemi { get; set; }
    }
}