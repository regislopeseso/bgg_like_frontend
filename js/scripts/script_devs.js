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

    // $("#logIn-flipper").on("dblclick", function (e) {
    //   $(".imgBlock").hide();
    //   $(".hiddenBlock").show();
    // });

    $("#seedBg").on("click", function (e) {
      e.preventDefault();

      $(".bg-progressBar").empty();
      let pg = `
        <div
          class="ldBar label-center"
          data-type="stroke"
          data-stroke="red"
          data-stroke-trail="white"
        ></div>
      `;

      $(".bg-progressBar").append(pg);

      let bar = new ldBar(".ldBar"); // target the ldBar element
      let progress = 0;
      let interval;

      // Reset progress
      progress = 0;
      bar.set(progress);

      $("#seedBg").prop("disabled", true);
      $("#deleteSeededBg").prop("disabled", true);

      // Simulate loading animation
      interval = setInterval(() => {
        if (progress < 95) {
          // stop before 100% to allow success to finalize it
          progress += 1;
          bar.set(progress);
        }
      }, 50); // speed of animation, adjust if needed

      $.ajax({
        method: "POST",
        url: "https://localhost:7081/devs/seed",
        data: JSON.stringify({}),
        contentType: "application/json",
        success: function (response) {
          clearInterval(interval);
          bar.set(100); // complete the progress

          setTimeout(() => {
            document.querySelector(".ldBar .ldBar-label").style.color =
              "var(--main-color)";

            const svgPath = document.querySelector(".ldBar svg path.mainline");
            svgPath.setAttribute("stroke", "var(--main-color)");
          }, 1000);

          console.log("Seeded successfully:", response);

          setTimeout(() => {
            const fadeInterval = setInterval(() => {
              if (progress > 0) {
                document.querySelector(".ldBar .ldBar-label").style.color = ""; // reset to default
                const svgPath = document.querySelector(
                  ".ldBar svg path.mainline"
                );
                svgPath.setAttribute("stroke", "red");
                progress -= 0.3;
                bar.set(progress);
              } else {
                clearInterval(fadeInterval);
                $("#seedBg").prop("disabled", false);
                $("#deleteSeededBg").prop("disabled", false);
                $(".bg-progressBar").empty();
              }
            }, 15);
          }, 2000);
        },
        error: function (xhr, status, error) {
          clearInterval(interval);
          bar.set(0); // reset on error
          console.error("Error seeding:", error);
          $("#seedBg").prop("disabled", false);
          $("#deleteSeededBg").prop("disabled", false);
          $(".bg-progressBar").empty();
        },
      });
    });

    $("#deleteSeededBg").on("click", function (e) {
      e.preventDefault();

      $(".bg-progressBar").empty();
      let pg = `
        <div
          class="ldBar label-center"
          data-type="stroke"
          data-stroke="red"
          data-stroke-trail="white"
        ></div>
      `;

      $(".bg-progressBar").append(pg);

      let bar = new ldBar(".ldBar"); // target the ldBar element
      let progress = 0;
      let interval;
      $(".ldBar svg").css("transform", "rotate(180deg)");

      // Reset progress
      progress = 0;
      bar.set(progress);

      $("#seedBg").prop("disabled", true);
      $("#deleteSeededBg").prop("disabled", true);

      // Simulate loading animation
      interval = setInterval(() => {
        if (progress < 95) {
          // stop before 100% to allow success to finalize it
          progress += 1;
          bar.set(progress);
        }
      }, 50); // speed of animation, adjust if needed

      $.ajax({
        method: "DELETE",
        url: "https://localhost:7081/devs/deleteseed",
        data: JSON.stringify({}),
        contentType: "application/json",
        success: function (response) {
          clearInterval(interval);
          bar.set(100); // complete the progress

          setTimeout(() => {
            document.querySelector(".ldBar .ldBar-label").style.color =
              "var(--main-color)";

            const svgPath = document.querySelector(".ldBar svg path.mainline");
            svgPath.setAttribute("stroke", "var(--main-color)");
          }, 1000);

          console.log("Seeded successfully:", response);

          setTimeout(() => {
            const fadeInterval = setInterval(() => {
              if (progress > 0) {
                document.querySelector(".ldBar .ldBar-label").style.color = ""; // reset to default
                const svgPath = document.querySelector(
                  ".ldBar svg path.mainline"
                );
                svgPath.setAttribute("stroke", "red");
                progress -= 0.3;
                bar.set(progress);
              } else {
                clearInterval(fadeInterval);
                $("#seedBg").prop("disabled", false);
                $("#deleteSeededBg").prop("disabled", false);
                $(".bg-progressBar").empty();
              }
            }, 15);
          }, 2000);
        },
        error: function (xhr, status, error) {
          clearInterval(interval);
          bar.set(0); // reset on error
          console.error("Error seeding:", error);
          $("#seedBg").prop("disabled", false);
          $("#deleteSeededBg").prop("disabled", false);
          $(".bg-progressBar").empty();
        },
      });
    });

    $("#seedMab").on("click", function (e) {
      e.preventDefault();

      $(".mab-progressBar").empty();
      let pg = `
        <div
          class="ldBar label-center"
          data-type="stroke"
          data-stroke="red"
          data-stroke-trail="white"
        ></div>
      `;

      $(".mab-progressBar").append(pg);

      let bar = new ldBar(".ldBar"); // target the ldBar element
      let progress = 0;
      let interval;

      // Reset progress
      progress = 0;
      bar.set(progress);

      $("#seedMab").prop("disabled", true);
      $("#deleteSeededMab").prop("disabled", true);

      // Simulate loading animation
      interval = setInterval(() => {
        if (progress < 95) {
          // stop before 100% to allow success to finalize it
          progress += 1;
          bar.set(progress);
        }
      }, 50); // speed of animation, adjust if needed

      $.ajax({
        method: "POST",
        url: "https://localhost:7108/devs/seed",
        data: JSON.stringify({}),
        contentType: "application/json",
        success: function (response) {
          clearInterval(interval);
          bar.set(100); // complete the progress

          setTimeout(() => {
            document.querySelector(".ldBar .ldBar-label").style.color =
              "var(--main-color)";

            const svgPath = document.querySelector(".ldBar svg path.mainline");
            svgPath.setAttribute("stroke", "var(--main-color)");
          }, 1000);

          console.log("Seeded successfully:", response);

          setTimeout(() => {
            const fadeInterval = setInterval(() => {
              if (progress > 0) {
                document.querySelector(".ldBar .ldBar-label").style.color = ""; // reset to default
                const svgPath = document.querySelector(
                  ".ldBar svg path.mainline"
                );
                svgPath.setAttribute("stroke", "red");
                progress -= 0.3;
                bar.set(progress);
              } else {
                clearInterval(fadeInterval);
                $("#seedMab").prop("disabled", false);
                $("#deleteSeededMab").prop("disabled", false);
                $(".mab-progressBar").empty();
              }
            }, 15);
          }, 2000);
        },
        error: function (xhr, status, error) {
          clearInterval(interval);
          bar.set(0); // reset on error
          console.error("Error seeding:", error);
          $("#seedMab").prop("disabled", false);
          $("#deleteSeededMab").prop("disabled", false);
          $(".mab-progressBar").empty();
        },
      });
    });

    $("#deleteSeededMab").on("click", function (e) {
      e.preventDefault();

      $(".mab-progressBar").empty();
      let pg = `
        <div
          class="ldBar label-center"
          data-type="stroke"
          data-stroke="red"
          data-stroke-trail="white"
        ></div>
      `;

      $(".mab-progressBar").append(pg);

      let bar = new ldBar(".ldBar"); // target the ldBar element
      let progress = 0;
      let interval;
      $(".ldBar svg").css("transform", "rotate(180deg)");

      // Reset progress
      progress = 0;
      bar.set(progress);

      $("#seedMab").prop("disabled", true);
      $("#deleteSeededMab").prop("disabled", true);

      // Simulate loading animation
      interval = setInterval(() => {
        if (progress < 95) {
          // stop before 100% to allow success to finalize it
          progress += 1;
          bar.set(progress);
        }
      }, 50); // speed of animation, adjust if needed

      $.ajax({
        method: "DELETE",
        url: "https://localhost:7108/devs/deleteseed",
        data: JSON.stringify({}),
        contentType: "application/json",
        success: function (response) {
          clearInterval(interval);
          bar.set(100); // complete the progress

          setTimeout(() => {
            document.querySelector(".ldBar .ldBar-label").style.color =
              "var(--main-color)";

            const svgPath = document.querySelector(".ldBar svg path.mainline");
            svgPath.setAttribute("stroke", "var(--main-color)");
          }, 1000);

          console.log("Seeded successfully:", response);

          setTimeout(() => {
            const fadeInterval = setInterval(() => {
              if (progress > 0) {
                document.querySelector(".ldBar .ldBar-label").style.color = ""; // reset to default
                const svgPath = document.querySelector(
                  ".ldBar svg path.mainline"
                );
                svgPath.setAttribute("stroke", "red");
                progress -= 0.3;
                bar.set(progress);
              } else {
                clearInterval(fadeInterval);
                $("#seedMab").prop("disabled", false);
                $("#deleteSeededMab").prop("disabled", false);
                $(".mab-progressBar").empty();
              }
            }, 15);
          }, 2000);
        },
        error: function (xhr, status, error) {
          clearInterval(interval);
          bar.set(0); // reset on error
          console.error("Error seeding:", error);
          $("#seedMab").prop("disabled", false);
          $("#deleteSeededMab").prop("disabled", false);
          $(".mab-progressBar").empty();
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
