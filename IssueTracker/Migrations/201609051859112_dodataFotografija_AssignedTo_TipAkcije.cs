namespace IssueTracker.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class dodataFotografija_AssignedTo_TipAkcije : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.IstorijaProblemas", "Akcija", c => c.Int(nullable: false));
            AddColumn("dbo.Problems", "DodeljenoKorisnikuId", c => c.String(maxLength: 128));
            AddColumn("dbo.AspNetUsers", "Fotografija", c => c.Binary());
            CreateIndex("dbo.Problems", "DodeljenoKorisnikuId");
            AddForeignKey("dbo.Problems", "DodeljenoKorisnikuId", "dbo.AspNetUsers", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Problems", "DodeljenoKorisnikuId", "dbo.AspNetUsers");
            DropIndex("dbo.Problems", new[] { "DodeljenoKorisnikuId" });
            DropColumn("dbo.AspNetUsers", "Fotografija");
            DropColumn("dbo.Problems", "DodeljenoKorisnikuId");
            DropColumn("dbo.IstorijaProblemas", "Akcija");
        }
    }
}
