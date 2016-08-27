using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web;

namespace IssueTracker.Models
{
    public class VrstaProblema
    {

        public int VrstaProblemaID { get; set; }

        
        public string Naziv { get; set; }

        public List<Problem> Problemi { get; set; }

    }


}