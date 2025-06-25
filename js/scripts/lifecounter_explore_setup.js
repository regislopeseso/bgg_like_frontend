function life_counter_explore_setup() {
  let self = this;

  self.LoadReferences = () => {
    self.DOM = $("#main-lifeCounter-explore-setUp");

    self.Form = self.DOM.find("#form-lifeCounter-explore-setUp");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.Close = self.DOM.find(
      "#button-close-lifeCounter-explore-setUp"
    );
    self.Buttons[self.Buttons.length] = self.Buttons.FinishLifeCounterManager =
      self.DOM.find("#button-finish-lifeCounter-explore-setup");
    self.Buttons[self.Buttons.length] = self.Buttons.ClearForm = self.DOM.find(
      "#button-clear-lifeCounter-explore-setup"
    );
    self.Buttons[self.Buttons.length] = self.Buttons.Confirm = self.DOM.find(
      "#button-confirm-lifeCounter-explore-setup"
    );

    self.LifeCounterMenu = self.DOM.find("#a-menu-lifeCounter-explore-setup");

    self.Inputs = [];
    self.Inputs[self.Inputs.length] = self.Inputs.GameName = self.DOM.find(
      "#input-gameName-lifeCounter-explore-setup"
    );
    self.Inputs[self.Inputs.length] = self.Inputs.PlayersStartingLifePoints =
      self.DOM.find(
        "#input-PlayersStartingLifePoints-lifeCounter-explore-setup"
      );
    self.Inputs[self.Inputs.length] = self.Inputs.PlayersCount = self.DOM.find(
      ".players-count-options"
    );
    self.Inputs[self.Inputs.length] = self.Inputs.FixedMaxLifePointsMode =
      self.DOM.find("#input-fixedMaxLifePointsMode-lifeCounter-explore-setup");
    self.Inputs[self.Inputs.length] = self.Inputs.MaxLifePointsInputWrapper =
      self.DOM.find("#div-PlayersMaxLifePoints-input-wrapper");
    self.Inputs[self.Inputs.length] = self.Inputs.PlayersMaxLifePoints =
      self.DOM.find("#input-playersMaxLifePoints-lifeCounter-explore-setup");
    self.Inputs[self.Inputs.length] = self.Inputs.AutoDefeatMode =
      self.DOM.find("#input-autoDefeatMode-lifeCounter-explore-setup");
    self.Inputs[self.Inputs.length] = self.Inputs.AutoEndMode = self.DOM.find(
      "#input-autoEndMode-lifeCounter-explore-setup"
    );

    self.Locations = [];
    self.Locations[self.Locations.length] = self.Locations.LifeCounter =
      "/html/pages_users/lifecounter/lifecounter_manager.html";
  };

  // LIFE COUNTER Explroe
  self.LifeCounterId = 999;
  self.LifeCounterManagerName = "Life Counter";
  self.PlayersCount = 1;
  self.LifeCounterPlayers = [];
  self.PlayersStartingLifePoints = 10;
  self.FixedMaxLifePointsMode = false;
  self.PlayersMaxLifePoints = null;
  self.AutoDefeatMode = false;
  self.AutoEndMode = false;

  self.RedirectToLifeCounter = (lifeCounterId) => {
    window.location.href = `${
      self.Locations.LifeCounter
    }?LifeCounterId=${encodeURIComponent(lifeCounterId)}`;
  };

  self.PreFillForm = () => {
    self.Inputs.GameName.val(self.LifeCounterManagerName)
      .trigger("focus")
      .trigger("select");

    self.Inputs.PlayersStartingLifePoints.val(self.PlayersStartingLifePoints);

    //self.Inputs.PlayersCount.eq(self.PlayersCount - 1).addClass("clickedState");
    // for (let i = 4; i > self.PlayersCount; i--) {
    //   self.Inputs.PlayersCount.eq(i).addClass("d-none");
    // }
    self.Inputs.PlayersCount.each(function () {
      const $button = $(this);
      const increment = parseInt($button.text().replace("+", ""), 10);

      if (self.PlayersCount + increment > 6) {
        $button.addClass("d-none");
      } else {
        $button.removeClass("d-none");
      }
    });

    self.Inputs.FixedMaxLifePointsMode.attr(
      "checked",
      self.FixedMaxLifePointsMode == true
    );
    if (self.FixedMaxLifePointsMode == true) {
      self.Inputs.MaxLifePointsInputWrapper.removeClass("d-none");

      self.Inputs.PlayersMaxLifePoints.val(self.PlayersMaxLifePoints);
    }

    self.Inputs.AutoDefeatMode.attr("checked", self.AutoDefeatMode == true);

    self.Inputs.AutoEndMode.attr("checked", self.AutoEndMode == true);
  };
  self.CheckFormFilling = () => {
    let areFieldsFilled = true;

    $("#form-lifeCounter-manager-setUp .required:visible:enabled").each(
      function () {
        if ($(this).val().trim() === "") {
          areFieldsFilled = false;
        }
      }
    );

    // Set disabled state
    $("#button-confirm-lifeCounter-manager-setup").attr(
      "disabled",
      !areFieldsFilled
    );

    // Tooltip logic
    const tooltipMessage = "All fields must be filled";

    if (!areFieldsFilled) {
      self.Buttons.Confirm.parent().attr("title", tooltipMessage);
    } else {
      self.Buttons.Confirm.parent().removeAttr("title");
    }
  };
  self.ClearForm = () => {
    $.each(self.Inputs, function (i, input) {
      input.val("");
    });
    self.Inputs.FixedMaxLifePointsMode.prop("checked", false);
    self.Inputs.MaxLifePointsInputWrapper.fadeOut().addClass("d-none");

    self.Inputs.AutoDefeatMode.prop("checked", false);

    self.Inputs.AutoEndMode.prop("checked", false).prop("disabled", true);

    self.Inputs.GameName.trigger("focus");
    self.Inputs.PlayersCount.removeClass("clickedState");
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

  self.ConfirmLifeCounterManagerSetUp = () => {
    //Disable submit button to prevent double submissions
    const confirmBtn = self.Buttons.Confirm;
    const originalBtnText = confirmBtn.text();

    let playersMaxLifePoints = self.Inputs.PlayersMaxLifePoints.val();

    if (self.Inputs.FixedMaxLifePointsMode.is(":checked") == false) {
      playersMaxLifePoints = null;
    }

    $.ajax({
      type: "PUT",
      url: "https://localhost:7081/users/editlifecountermanager",
      data: JSON.stringify({
        LifeCounterManagerId: self.LifeCounterId,
        NewLifeCounterManagerName: self.Inputs.GameName.val(),
        NewPlayersCount: self.PlayersCount,
        NewPlayersStartingLifePoints: parseInt(
          self.Inputs.PlayersStartingLifePoints.val(),
          10
        ),
        FixedMaxLifePointsMode:
          self.Inputs.FixedMaxLifePointsMode.is(":checked"),
        NewPlayersMaxLifePoints: playersMaxLifePoints,
        AutoDefeatMode: self.Inputs.AutoDefeatMode.is(":checked"),
        AutoEndMode: self.Inputs.AutoEndMode.is(":checked"),
      }),
      contentType: "application/json",
      xhrFields: {
        withCredentials: true,
      },
      success: (resp) => {
        if (resp.content === null) {
          sweetAlertError(resp.message);
          return;
        }
        self.RedirectToLifeCounter(self.LifeCounterId);
      },
      error: (err) => {
        sweetAlertError(err);
      },
      complete: () => {
        confirmBtn.attr("disabled", false).text(originalBtnText);
        self.ClearForm();
      },
    });
  };

  self.LoadEvents = () => {
    self.Buttons.Close.on("click", function (e) {
      e.preventDefault();
      self.RedirectToLifeCounter(self.LifeCounterId);
    });

    self.Inputs.FixedMaxLifePointsMode.on("change", function (e) {
      if ($(this).is(":checked")) {
        // Checkbox is checked
        self.Inputs.MaxLifePointsInputWrapper.removeClass("d-none");
      } else {
        // Checkbox is unchecked
        self.Inputs.MaxLifePointsInputWrapper.addClass("d-none");
      }
    });

    self.Buttons.ClearForm.on("click", (e) => {
      e.preventDefault();

      self.ClearForm();

      self.CheckFormFilling();
    });

    self.Buttons.Confirm.on("click", (e) => {
      self.ConfirmLifeCounterManagerSetUp();
    });

    // Hook input and change events for form inputs
    self.Form.find(".required:visible:enabled").on("input change", function () {
      self.CheckFormFilling();
    });

    self.Inputs.AutoDefeatMode.on("change", (e) => {
      if (!self.Inputs.AutoDefeatMode.is(":checked")) {
        self.Inputs.AutoEndMode.prop("checked", false) // <-- Correct way to uncheck
          .prop("disabled", true); // <-- Properly disables the checkbox
      } else {
        self.Inputs.AutoEndMode.prop("disabled", false); // Re-enable if needed
      }
    });

    self.Inputs.PlayersCount.on("click", function (e) {
      e.preventDefault();

      // Remove the class from all
      self.Inputs.PlayersCount.removeClass("clickedState");

      // Parse increment value from the button
      const increment = parseInt($(this).text().replace("+", ""), 10);

      // Add class to selected
      $(this).addClass("clickedState");

      // Update the player count
      self.PlayersCount += increment;
    });

    closeOnAnyKey();
  };

  self.Build = () => {
    self.LoadReferences();
    self.LoadEvents();
  };

  self.Build();
}

$(function () {
  new life_counter_explore_setup();
});
