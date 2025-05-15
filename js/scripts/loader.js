(function ($) {
  $.fn.loadpage = function (action = "load") {
    return this.each(function () {
      switch (action) {
        case "charge":
          let divToAppend = document.createElement("div");

          divToAppend.id = "loader";

          $(divToAppend).css({
            position: "fixed",
            top: 0,
            left: 0,
            "text-align": "center",
            height: "100%",
            width: "100%",
            "z-index": 100,
            "background-color": "rgba(0,0,0,0.5)",
          });

          let divLoad = document.createElement("div");

          divLoad.className = "lds-hourglass";

          $(divLoad).css({
            top: "50%",
            left: "50%",
            position: "absolute",
          });

          $(divToAppend).append(divLoad);

          $(this).append(divToAppend).hide().fadeIn("slow");

          break;
        case "demolish":
          $("#loader").fadeOut("slow", function () {
            $(this).remove();
          });
          break;

        default:
          console.error("Inform a valid action");
      }
    });
  };
})(jQuery);
