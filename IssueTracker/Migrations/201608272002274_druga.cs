namespace IssueTracker.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class druga : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.IstorijaProblemas",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ProblemID = c.Int(nullable: false),
                        Naziv = c.String(nullable: false, maxLength: 255),
                        Opis = c.String(),
                        DatumIzmene = c.DateTime(nullable: false),
                        Izmenio = c.String(),
                        VrstaProblema = c.String(),
                        Status = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.IstorijaProblemas");
        }
    }
}
