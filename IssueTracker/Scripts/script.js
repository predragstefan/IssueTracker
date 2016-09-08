$("#index-tabela").closest(".container").addClass("tabela");

$("table tr td:nth-child(7) div").addClass(function () {
   return $(this).text().toLowerCase().trim();

    

}).closest("td").addClass("levo");

$(".naziv, .datum-kreiranja, .status-sort").on("click", function () {
    $(this).find("span").removeClass("glyphicon-sort").toggleClass("glyphicon-sort-by-attributes glyphicon-sort-by-attributes-alt")
});

$(".naziv, .datum-kreiranja, .status-sort").one("click", function () {
    $(this).find("span").removeClass("glyphicon-sort-by-attributes-alt");
});

$(window).on("load", function () {
    setTimeout(loading, 5000);
    function loading() {
        $(".loadingscreen").fadeOut();
    }
}
)

