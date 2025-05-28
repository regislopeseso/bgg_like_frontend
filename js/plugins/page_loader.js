(function ($) {
  $.fn.loadpage = function (action = "charge") {
    return this.each(function () {
      switch (action) {
        case "charge":
          let divToAppend = document.createElement("div");

          divToAppend.id = "page-loader";

          $(divToAppend).css({
            position: "fixed",
            top: 0,
            left: 0,
            "text-align": "center",
            height: "100%",
            width: "100%",
            "z-index": 100,
            "background-color": "var(--bg-color)",
          });

          let divLoad = document.createElement("div");

          divLoad.className = "lds-hourglass";

          $(divLoad).css({
            top: "50%",
            left: "50%",
            position: "absolute",
            transform: "translate(-50%, -50%)",
          });

          $(divToAppend).append(divLoad);

          $(this).append(divToAppend).hide().fadeIn("fast");

          break;
        case "demolish":
          setTimeout(() => {
            $("#page-loader").fadeOut(600, function () {
              $(this).remove();
            });
          }, 300);
          break;

        default:
          console.error("Inform a valid action");
      }
    });
  };
})(jQuery);
