﻿namespace IssueTracker.Models
{
    public class HomeViewModel
    {
        public string TrenutnoUlogovanKorisnikId { get; set; }
        public int BrojProblemaTrenutnoUlogovanogKorisnika { get; set; }
        public string ImePrezime { get; set; }

        public HomeViewModel()
        {
            BrojProblemaTrenutnoUlogovanogKorisnika = 0;
        }
    }
}