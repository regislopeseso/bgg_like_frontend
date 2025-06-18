function life_counter_player_setup() {
  let self = this;

  // LIFE COUNTER MANAGER DB
  self.LifeCounterPlayerId = null;
  self.LifeCounterPlayerName = null;
  self.StartingLifePoints = null;
  self.CurrentLifePoints = null;
  self.FixedMaxLifeMode = null;
  self.MaxLifePoints = null;
  self.AutoDefeatMode = null;

  self.LifeCounterManagerId = null;
  self.PlayersCount = null;

  self.GetLifeCounterPlayerId = () => {
    self.LifeCounterPlayerId = new URLSearchParams(window.location.search).get(
      "PlayerId"
    );
  };

  self.GetLifeCounterPlayerDetails = () => {
    if (!self.LifeCounterPlayerId) {
      sweetAlertError("Failed to receive player id from life counter manager");
      return;
    }

    // Fetch Life Counter Player Name based on provided LifeCounterPlayerId
    $.ajax({
      type: "GET",
      url: `https://localhost:7081/users/getlifecounterplayerdetails?LifeCounterPlayerId=${self.LifeCounterPlayerId}`,
      xhrFields: { withCredentials: true },
      success: function (response) {
        if (!response.content) {
          sweetAlertError(response.message_text);
          return;
        }

        const lifeCounterPlayerDB = response.content;

        self.LifeCounterPlayerName = lifeCounterPlayerDB.lifeCounterPlayerName;
        self.StartingLifePoints = lifeCounterPlayerDB.playerStartingLifePoints;
        self.CurrentLifePoints = lifeCounterPlayerDB.playerCurrentLifePoints;
        self.FixedMaxLifeMode = lifeCounterPlayerDB.fixedMaxLifePointsMode;
        self.MaxLifePoints = lifeCounterPlayerDB.playerMaxLifePoints;
        self.AutoDefeatMode = lifeCounterPlayerDB.autoDefeatMode;

        self.LifeCounterManagerId = lifeCounterPlayerDB.lifeCounterManagerId;

        self.PreFillForm();
      },
      error: function (xhr, status, error) {
        sweetAlertError("Could not load life counter");
      },
    });
  };

  self.LoadReferences = () => {
    self.DOM = $("#main-lifeCounter-player-setUp");

    self.Form = self.DOM.find("#form-lifeCounter-player-setUp");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.Close = self.DOM.find(
      "#button-close-lifeCounter-player-setUp"
    );
    self.Buttons[self.Buttons.length] = self.Buttons.RemovePlayer =
      self.DOM.find("#button-removePlayer-lifeCounter-player-setup");
    self.Buttons[self.Buttons.length] = self.Buttons.Confirm = self.DOM.find(
      "#button-confirm-lifeCounter-player-setup"
    );

    self.Locations = [];
    self.Locations[self.Locations.length] = self.Locations.LifeCounterManager =
      "/html/pages_users/lifecounter/lifecounter_manager.html";

    self.Inputs = [];
    self.Inputs[self.Inputs.length] = self.Inputs.LifeCounterPlayerName =
      self.DOM.find("#input-name-lifeCounter-player-setup");

    self.Fields = [];
    self.Fields[self.Fields.length] = self.Fields.PlayerStartingLifePoints =
      self.DOM.find("#div-playerStartingLifePoints-lifeCounter-player-setup");

    self.Fields[self.Fields.length] = self.Fields.PlayerCurrentLifePoints =
      self.DOM.find("#div-playerCurrentLifePoints-lifeCounter-player-setup");

    self.Fields[self.Fields.length] = self.Fields.FixedMaxLifePointsMode =
      self.DOM.find("#div-fixedMaxLifePointsMode-lifeCounter-player-setup");
    self.Fields[self.Fields.length] = self.Fields.MaxLifePointsInputWrapper =
      self.DOM.find("#div-playerMaxLifePoints-input-wrapper");
    self.Fields[self.Fields.length] = self.Fields.PlayerMaxLifePoints =
      self.DOM.find("#div-playerMaxLifePointsMode-lifeCounter-player-setup");

    self.Fields[self.Inputs.length] = self.Fields.AutoDefeatMode =
      self.DOM.find("#div-autoDefeatMode-lifeCounter-player-setup");
  };

  self.RedirectToLifeCounterManager = (lifeCounterManagerId) => {
    window.location.href = `${
      self.Locations.LifeCounterManager
    }?id=${encodeURIComponent(lifeCounterManagerId)}`;
  };

  self.PreFillForm = () => {
    self.Inputs.LifeCounterPlayerName.val(self.LifeCounterPlayerName)
      .trigger("focus")
      .trigger("select");

    self.Fields.PlayerStartingLifePoints.html(self.StartingLifePoints);
    self.Fields.PlayerCurrentLifePoints.html(self.CurrentLifePoints);
    self.Fields.FixedMaxLifePointsMode.html(self.FixedMaxLifeMode);
    self.Fields.PlayerMaxLifePoints.html(self.MaxLifePoints);
    self.Fields.AutoDefeatMode.html(self.AutoDefeatMode);

    sweetAlertSuccess(self.LifeCounterPlayerName);
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
    self.Buttons.Close.on("click", function (e) {
      e.preventDefault();
      self.RedirectToLifeCounterManager(self.LifeCounterManagerId);
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

  self.ConfirmLifeCounterManagerSetUp = () => {
    //Disable submit button to prevent double submissions
    const confirmBtn = self.Buttons.Confirm;
    const originalBtnText = confirmBtn.text();
    confirmBtn.attr("disabled", true).text("Submitting...");

    $.ajax({
      type: "PUT",
      url: "https://localhost:7081/users/editlifecountermanager",
      data: JSON.stringify({
        LifeCounterManagerId: self.LifeCounterManagerId,
        NewLifeCounterManagerName: self.Inputs.GameName.val(),
        NewPlayersCount: self.PlayersCount,
        NewPlayersStartingLifePoints:
          self.Inputs.PlayersStartingLifePoints.val(),
        FixedMaxLifePointsMode:
          self.Inputs.FixedMaxLifePointsMode.is(":checked"),
        NewPlayersMaxLifePoints: self.Inputs.PlayersMaxLifePoints.val(),
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
        self.RedirectToLifeCounterManager(self.LifeCounterManagerId);
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

  self.Build = () => {
    self.LoadReferences();
    self.GetLifeCounterPlayerId();
    self.GetLifeCounterPlayerDetails();
    //self.LoadEvents();
  };

  self.Build();
}

$(function () {
  new life_counter_player_setup();
});
