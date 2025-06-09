function life_counter_setup() {
  let self = this;
  self.defaultPlayersCount = null;

  self.LoadReferences = () => {
    self.DOM = $("#lifecounter-new");

    self.Form = self.DOM.find("#form-lifecounter-new");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.CloseNew = self.DOM.find(
      "#close-lifecounter-new"
    );
    self.Buttons[self.Buttons.length] = self.Buttons.BackToSetup =
      self.DOM.find("#back-lifecounter-new");
    self.Buttons[self.Buttons.length] = self.Buttons.ClearForm = self.DOM.find(
      "#clear-lifecounter-new"
    );
    self.Buttons[self.Buttons.length] = self.Buttons.CreateAndStartLifeCounter =
      self.DOM.find("#create-and-start-lifecounter-new");
    self.Buttons[self.Buttons.length] = self.Buttons.CreateLifeCounter =
      self.DOM.find("#create-lifecounter-new");

    self.Locations = [];
    self.Locations[self.Locations.length] = self.Locations.UsersPage =
      "/html/pages_users/users_page.html";
    self.Locations[self.Locations.length] = self.Locations.SetUpLifeCounter =
      "/html/pages_users/lifecounter/users_lifecounter_menu.html";
    self.Locations[self.Locations.length] = self.Locations.LifeCounter =
      "/html/pages_users/lifecounter/users_lifecounter.html";

    self.Inputs = [];
    self.Inputs[self.Inputs.length] = self.Inputs.Name = self.DOM.find(
      "#name-lifecounter-new"
    );
    self.Inputs[self.Inputs.length] = self.Inputs.DefaultPlayersCount =
      self.DOM.find(".players-count-options");
    self.Inputs[self.Inputs.length] = self.Inputs.StartingLifePoints =
      self.DOM.find("#players-starting-life-lifecounter-new");
    self.Inputs[self.Inputs.length] = self.Inputs.FixedMaxLife = self.DOM.find(
      "#fixed-max-life-lifecounter-new"
    );
    self.Inputs[self.Inputs.length] = self.Inputs.MaxLifeWrapper =
      self.DOM.find("#max-life-wrapper");
    self.Inputs[self.Inputs.length] = self.Inputs.MaxLifePoints = self.DOM.find(
      "#max-life-points-lifecounter-new"
    );

    self.Inputs[self.Inputs.length] = self.Inputs.AutoEndMatch = self.DOM.find(
      "#auto-end-match-lifecounter-new"
    );
  };

  self.RedirectToUsersPage = () => {
    window.location.href = self.Locations.UsersPage;
  };
  self.RedirectToSetUpLifeCounterPage = () => {
    window.location.href = self.Locations.SetUpLifeCounter;
  };
  self.RedirectToLifeCounter = (lifeCounterId) => {
    window.location.href = `${
      self.Locations.LifeCounter
    }?id=${encodeURIComponent(lifeCounterId)}`;
  };

  self.PreFillForm = () => {
    $.ajax({
      type: "GET",
      url: "https://localhost:7081/users/countlifecounters",
      xhrFields: {
        withCredentials: true, // Only if you're using cookies; otherwise can be removed
      },
      success: (resp) => {
        if (resp.content === null) {
          sweetAlertError(resp.message);
        } else {
          self.Inputs.Name.val(
            `Life Counter #${resp.content.lifeCountersCount}`
          )
            .trigger("focus")
            .trigger("select");

          self.Inputs.DefaultPlayersCount.eq(0).addClass("clickedState");

          self.defaultPlayersCount = parseInt(
            self.Inputs.DefaultPlayersCount.filter(".clickedState").text()
          );
        }
      },
      error: (err) => {
        sweetAlertError(err);
      },
    });
  };
  self.CheckFormFilling = () => {
    let areFieldsFilled = true;
    let isPlayersCountChosen = true;

    $("#form-lifecounter-new .required:visible:enabled").each(function () {
      if ($(this).val().trim() === "") {
        areFieldsFilled = false;
      }
    });

    isPlayersCountChosen =
      self.Inputs.DefaultPlayersCount.filter(".clickedState").length > 0;
    console.log(isPlayersCountChosen);

    // Set disabled state
    self.Buttons.CreateAndStartLifeCounter.prop(
      "disabled",
      !areFieldsFilled || !isPlayersCountChosen
    );

    // Tooltip logic
    const tooltipMessage = "All fields must be filled";

    if (!areFieldsFilled) {
      self.Buttons.CreateAndStartLifeCounter.parent().attr(
        "title",
        tooltipMessage
      );
      self.Buttons.CreateLifeCounter.parent().attr("title", tooltipMessage);
    } else {
      self.Buttons.CreateAndStartLifeCounter.parent().removeAttr("title");
      self.Buttons.CreateLifeCounter.parent().removeAttr("title");
    }
  };
  self.ClearForm = () => {
    $.each(self.Inputs, function (i, input) {
      input.val("");
    });

    self.Inputs.Name.trigger("focus");
    self.Inputs.DefaultPlayersCount.removeClass("clickedState");
  };

  function sweetAlertSuccess(title_text, message_text) {
    Swal.fire({
      position: "center",
      confirmButtonText: "OK!",
      icon: "success",
      theme: "bulma",
      title: title_text,
      text: message_text || "",
      showConfirmButton: false,
      timer: 1500,
    });
  }
  function sweetAlertError(title_text, message_text) {
    Swal.fire({
      position: "center",
      cancelButtonText: "close",
      icon: "error",
      theme: "bulma",
      title: title_text,
      text: message_text || "",
      showConfirmButton: false,
      showCancelButton: true,
      didOpen: () => {
        // Attach keydown listener
        document.addEventListener("keydown", closeOnAnyKey);
      },
      willClose: () => {
        // Clean up listener when modal closes
        document.removeEventListener("keydown", closeOnAnyKey);
      },
    });
  }
  function closeOnAnyKey() {
    Swal.close();
  }

  self.LoadEvents = () => {
    self.Buttons.CloseNew.on("click", function (e) {
      e.preventDefault();
      self.RedirectToUsersPage();
    });

    self.Inputs.FixedMaxLife.on("change", function (e) {
      if ($(this).is(":checked")) {
        // Checkbox is checked
        self.Inputs.MaxLifeWrapper.removeClass("d-none");
      } else {
        // Checkbox is unchecked
        self.Inputs.MaxLifeWrapper.addClass("d-none");
      }
    });

    self.Buttons.BackToSetup.on("click", function (e) {
      e.preventDefault();
      self.RedirectToSetUpLifeCounterPage();
    });

    self.Buttons.ClearForm.on("click", (e) => {
      e.preventDefault();

      self.ClearForm();

      self.CheckFormFilling();
    });

    self.Buttons.CreateAndStartLifeCounter.on("click", (e) => {
      e.preventDefault();

      self.CreateLifeCounter(true);
    });

    // Hook input and change events for form inputs
    self.Form.find(".required:visible:enabled").on("input change", function () {
      self.CheckFormFilling();
    });

    self.Inputs.DefaultPlayersCount.on("click", function (e) {
      e.preventDefault();
      // Remove the class from all
      self.Inputs.DefaultPlayersCount.removeClass("clickedState");

      self.defaultPlayersCount = parseInt($(this).text());
      console.log("Choosing for: >", self.defaultPlayersCount, "< players..");

      // Add the class to the one that was clicked
      $(this).addClass("clickedState");
    });

    closeOnAnyKey();
  };

  self.SetUpLifeCounterForm = () => {
    $(document)
      .off("submit", self.Form)
      .on("submit", self.Form, function (e) {
        e.preventDefault();

        self.CreateLifeCounter(false);
      });
  };
  self.CreateLifeCounter = (isPlayMode) => {
    //Disable submit button to prevent double submissions
    const submitBtn = self.Buttons.CreateLifeCounter;
    const originalBtnText = submitBtn.text();
    submitBtn.attr("disabled", true).text("Submitting...");

    const formData = new FormData();
    formData.append("Name", self.Inputs.Name.val());
    formData.append("DefaultPlayersCount", self.defaultPlayersCount);
    formData.append("StartingLifePoints", self.Inputs.StartingLifePoints.val());
    formData.append("FixedMaxLife", self.Inputs.FixedMaxLife.is(":checked"));
    formData.append("MaxLifePoints", self.Inputs.MaxLifePoints.val());
    formData.append("AutoEndMatch", self.Inputs.AutoEndMatch.is(":checked"));

    let lifeCounterId = null;

    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/newlifecounter",
      data: formData,
      processData: false,
      contentType: false,
      xhrFields: {
        withCredentials: true, // Only if you're using cookies; otherwise can be removed
      },
      success: (resp) => {
        if (resp.content === null) {
          sweetAlertError(resp.message);
        } else {
          if (isPlayMode === true) {
            lifeCounterId = resp.content.lifeCounterId;

            $("body").loadpage("charge");
          } else {
            sweetAlertSuccess(resp.message);
          }
        }
      },
      error: (err) => {
        sweetAlertError(err);
      },
      complete: () => {
        submitBtn.attr("disabled", false).text(originalBtnText);
        self.ClearForm();

        if (isPlayMode === true) {
          // setTimeout(() => {
          //   $("body").loadpage("demolish");
          // }, 1000);

          self.RedirectToLifeCounter(lifeCounterId);
        }
      },
    });
  };

  self.Build = () => {
    self.LoadReferences();
    self.LoadEvents();
    self.PreFillForm();
    self.SetUpLifeCounterForm();
  };

  self.Build();
}

$(function () {
  new life_counter_setup();
});
