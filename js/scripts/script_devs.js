$(document).ready(function () {
  function loadEvents() {
    $("#devsPassword").on("input", function () {
      const inputLength = $(this).val().length;

      if (inputLength >= 5) {
        $("#logIn-flipper").prop("disabled", false);
      } else {
        $("#logIn-flipper").prop("disabled", true);
      }
    });

    $("#logIn-flipper").on("click", function (e) {
      e.preventDefault();

      $(".flip-card-inner").css("transform", "rotateY(180deg)");
    });

    $("#seedBg").on("click", function (e) {
      e.preventDefault();

      $.ajax({
        method: "POST",
        url: "https://localhost:7081/devs/seed",
        data: {},
        dataType: "JSON",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
          console.log("Seeded successfully:", response);
        },
        error: function (xhr, status, error) {
          console.error("Error seeding:", error);
        },
      });
    });

    $("#logOut-flipper").on("click", function (e) {
      e.preventDefault();

      $(".flip-card-inner").css("transform", "rotateY(0)");
    });
  }

  function builder() {
    loadEvents();
  }

  builder();
});
