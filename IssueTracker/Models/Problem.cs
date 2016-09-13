using Newtonsoft.Json;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IssueTracker.Models
{
    public class Problem
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string Naziv { get; set; }

        public Status Status { get; set; }

        public string Opis { get; set; }

        [Display(Name = "Datum Kreiranja")]
        public DateTime DatumKreiranja { get; set; }

        [Display(Name = "Vreme poslednje Izmene")]
        public DateTime? VremePoslednjeIzmene { get; set; }

        [InverseProperty("KreiraniProblemi")]
        public Korisnik Kreirao { get; set; }

        public string KreiraoId { get; set; }

        [Display(Name = "Poslednji Izmenio")]
        public Korisnik PoslednjiIzmenio { get; set; }

        public string PoslednjiIzmenioId { get; set; }

        [Display(Name = "Vrsta Problema")]
        public VrstaProblema VrstaProblema { get; set; }

        public int VrstaProblemaID { get; set; }

        public Korisnik DodeljenoKorisniku { get; set; }
        public string DodeljenoKorisnikuId { get; set; }
    }

    public enum Status { Otvoren, Trijaza, Aktivan, Suspendovan, Neaktivan, Zavrsen }
}