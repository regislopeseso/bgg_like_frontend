(function ($) {
  $.fn.loadcontent = function (action = "charge-contentloader") {
    return this.each(function () {
      switch (action) {
        case "charge-contentloader":
          let divToAppend_content = document.createElement("div");

          divToAppend_content.id = "content-loader";

          $(divToAppend_content).css({
            position: "fixed",
            top: 0,
            left: 0,
            "text-align": "center",
            height: "100%",
            width: "100%",
            "z-index": 100,
            "background-color": "rgba(0, 0, 0, 0.5)",
          });

          let divLoad_content = document.createElement("div");

          divLoad_content.className = "lds-hourglass";

          $(divLoad_content).css({
            top: "50%",
            left: "50%",
            position: "absolute",
            transform: "translate(-50%, -50%)",
          });

          $(divToAppend_content).append(divLoad_content);

          $(this).append(divToAppend_content).hide().fadeIn("fast");

          break;
        case "demolish-contentloader":
          $("#content-loader").fadeOut(400, function () {
            $(this).remove();
          });

          break;

        default:
          console.error("Inform a valid action");
      }
    });
  };
})(jQuery);
