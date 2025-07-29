function devs_page() {
  let self = this;

  self.IsBuilt = false;

  self.LoadReferences = () => {
    self.DOM = $("#body-devs-page");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.BoardGames_Seed =
      self.DOM.find("#seedBg");
    self.Buttons[self.Buttons.length] = self.Buttons.BoardGames_DeleteSeed =
      self.DOM.find("#deleteSeededBg");
    self.Buttons[self.Buttons.length] = self.Buttons.MedievalAutoBattler_Seed =
      self.DOM.find("#seedMab");
    self.Buttons[self.Buttons.length] =
      self.Buttons.MedievalAutoBattler_DeleteSeed =
        self.DOM.find("#deleteSeededMab");

    self.BoardGames_ProgressBar = self.DOM.find(".bg-progressBar");
    self.MedievalAutoBattler_ProgressBar = self.DOM.find(".mab-progressBar");

    self.LoadingBar_Element = ".ldBar";
  };

  self.BoardGames_Seed = () => {
    self.BoardGames_ProgressBar.empty();

    let pg = `
        <div
          class="ldBar label-center"
          data-type="stroke"
          data-stroke="red"
          data-stroke-trail="white"
        ></div>
      `;

    self.BoardGames_ProgressBar.append(pg);

    let bar = new ldBar(self.LoadingBar_Element); // target the ldBar element
    let progress = 0;
    let interval;

    // Reset progress
    progress = 0;
    bar.set(progress);

    self.Buttons.BoardGames_Seed.prop("disabled", true);
    self.Buttons.BoardGames_DeleteSeed.prop("disabled", true);

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
      url: "https://localhost:7081/devs/boardgamesseed",
      xhrFields: {
        withCredentials: true,
      },
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
              self.Buttons.BoardGames_Seed.prop("disabled", false);
              self.Buttons.BoardGames_DeleteSeed.prop("disabled", false);
              self.BoardGames_ProgressBar.empty();
            }
          }, 15);
        }, 2000);
      },
      error: function (xhr, status, error) {
        clearInterval(interval);
        bar.set(0); // reset on error
        console.error("Error seeding:", error);
        self.Buttons.BoardGames_Seed.prop("disabled", false);
        self.Buttons.BoardGames_DeleteSeed.prop("disabled", false);
        self.BoardGames_ProgressBar.empty();
      },
    });
  };
  self.BoardGames_DeleteSeed = () => {
    self.BoardGames_ProgressBar.empty();

    let pg = `
        <div
          class="ldBar label-center"
          data-type="stroke"
          data-stroke="red"
          data-stroke-trail="white"
        ></div>
      `;

    self.BoardGames_ProgressBar.append(pg);

    let bar = new ldBar(self.LoadingBar_Element); // target the ldBar element
    let progress = 0;
    let interval;
    $(".ldBar svg").css("transform", "rotate(180deg)");

    // Reset progress
    progress = 0;
    bar.set(progress);

    self.Buttons.BoardGames_Seed.prop("disabled", true);
    self.Buttons.BoardGames_DeleteSeed.prop("disabled", true);

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
      url: "https://localhost:7081/devs/boardgamesdeleteseed",
      xhrFields: {
        withCredentials: true,
      },
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

              self.Buttons.BoardGames_Seed.prop("disabled", false);

              self.Buttons.BoardGames_DeleteSeed.prop("disabled", false);

              self.BoardGames_ProgressBar.empty();
            }
          }, 15);
        }, 2000);
      },
      error: function (xhr, status, error) {
        clearInterval(interval);
        bar.set(0); // reset on error
        console.error("Error seeding:", error);
        self.Buttons.BoardGames_Seed.prop("disabled", false);
        self.Buttons.BoardGames_DeleteSeed.prop("disabled", false);
        self.BoardGames_ProgressBar.empty();
      },
    });
  };

  self.MedievalBattler_Seed = () => {
    self.MedievalAutoBattler_ProgressBar.empty();

    let pg = `
        <div
          class="ldBar label-center"
          data-type="stroke"
          data-stroke="red"
          data-stroke-trail="white"
        ></div>
      `;

    self.MedievalAutoBattler_ProgressBar.append(pg);

    let bar = new ldBar(self.LoadingBar_Element); // target the ldBar element
    let progress = 0;
    let interval;

    // Reset progress
    progress = 0;
    bar.set(progress);

    self.Buttons.MedievalAutoBattler_Seed.prop("disabled", true);
    self.Buttons.MedievalAutoBattler_DeleteSeed.prop("disabled", true);

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
      url: "https://localhost:7081/devs/medievalautobattlerseed",
      xhrFields: {
        withCredentials: true,
      },
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
              self.Buttons.MedievalAutoBattler_Seed.prop("disabled", false);
              self.Buttons.MedievalAutoBattler_DeleteSeed.prop(
                "disabled",
                false
              );
              self.MedievalAutoBattler_ProgressBar.empty();
            }
          }, 15);
        }, 2000);
      },
      error: function (xhr, status, error) {
        clearInterval(interval);
        bar.set(0); // reset on error
        console.error("Error seeding:", error);
        self.Buttons.MedievalAutoBattler_Seed.prop("disabled", false);
        self.Buttons.MedievalAutoBattler_DeleteSeed.prop("disabled", false);
        self.MedievalAutoBattler_ProgressBar.empty();
      },
    });
  };
  self.MedievalBattler_DeleteSeed = () => {
    self.MedievalAutoBattler_ProgressBar.empty();
    let pg = `
        <div
          class="ldBar label-center"
          data-type="stroke"
          data-stroke="red"
          data-stroke-trail="white"
        ></div>
      `;

    self.MedievalAutoBattler_ProgressBar.append(pg);

    let bar = new ldBar(".ldBar"); // target the ldBar element
    let progress = 0;
    let interval;
    $(".ldBar svg").css("transform", "rotate(180deg)");

    // Reset progress
    progress = 0;
    bar.set(progress);

    self.Buttons.MedievalAutoBattler_Seed.prop("disabled", true);
    self.Buttons.MedievalAutoBattler_DeleteSeed.prop("disabled", true);

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
      url: "https://localhost:7081/devs/medievalautobattlerdeleteseed",
      xhrFields: {
        withCredentials: true,
      },
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
              self.Buttons.MedievalAutoBattler_Seed.prop("disabled", false);
              self.Buttons.MedievalAutoBattler_DeleteSeed.prop(
                "disabled",
                false
              );
              self.MedievalAutoBattler_ProgressBar.empty();
            }
          }, 15);
        }, 2000);
      },
      error: function (xhr, status, error) {
        clearInterval(interval);
        bar.set(0); // reset on error
        console.error("Error seeding:", error);
        self.Buttons.MedievalAutoBattler_Seed.prop("disabled", false);
        self.Buttons.MedievalAutoBattler_DeleteSeed.prop("disabled", false);
        self.MedievalAutoBattler_ProgressBar.empty();
      },
    });
  };

  self.LoadEvents = () => {
    self.Buttons.BoardGames_Seed.on("click", function (e) {
      e.preventDefault();

      self.BoardGames_Seed();
    });

    self.Buttons.BoardGames_DeleteSeed.on("click", function (e) {
      e.preventDefault();

      console.log("Deleting seeded board games...");

      self.BoardGames_DeleteSeed();
    });

    self.Buttons.MedievalAutoBattler_Seed.on("click", function (e) {
      e.preventDefault();

      self.MedievalBattler_Seed();
    });

    self.Buttons.MedievalAutoBattler_DeleteSeed.on("click", function (e) {
      e.preventDefault();

      self.MedievalBattler_DeleteSeed();
    });
  };

  self.Build = () => {
    if (self.IsBuilt === false) {
      self.LoadReferences();
      self.LoadEvents();
      self.IsBuilt = true;
    }
  };

  self.Build();
}

$(function () {
  new devs_page();
});
