function life_counter_explore_setup() {
  let self = this;

  self.LifeCounter = [];
  self.LifeCounterPlayers = [];

  self.OldName = null;
  self.OldPlayersStartingLifePoints = null;
  self.OldPlayersMaxLifePoints = null;

  self.newPlayersCount = null;

  self.GetLifeCounter = () => {
    self.LifeCounter = JSON.parse(localStorage.getItem("LifeCounter"));
  };
  self.SetLifeCounter = () => {
    localStorage.setItem("LifeCounter", JSON.stringify(self.LifeCounter));
  };

  self.GetLifeCounterPlayers = () => {
    self.LifeCounterPlayers = JSON.parse(
      localStorage.getItem("LifeCounterPlayers")
    );
  };
  self.SetLifeCounterPlayers = () => {
    localStorage.setItem(
      "LifeCounterPlayers",
      JSON.stringify(self.LifeCounterPlayers)
    );
  };

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
    self.Inputs[self.Inputs.length] = self.Inputs.LifeCounterName =
      self.DOM.find("#input-gameName-lifeCounter-explore-setup");
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
      "/html/lifecounter_explore.html";
  };

  self.RedirectToLifeCounter = (lifeCounterId) => {
    window.location.href = `${self.Locations.LifeCounter}`;
  };

  self.FetchMaxCurrentLifePoints = () => {
    self.GetLifeCounterPlayers();

    let playersCurrentLifePoints = [];

    self.LifeCounterPlayers.forEach((player) => {
      playersCurrentLifePoints.push(player.CurrentLifePoints);
    });

    let maxCurrentLifePoints = Math.max(...playersCurrentLifePoints);

    return maxCurrentLifePoints;
  };

  self.PreFillForm = () => {
    self.GetLifeCounter();
    self.GetLifeCounterPlayers();

    self.OldName = self.LifeCounter.LifeCounterName;
    self.OldPlayersStartingLifePoints =
      self.LifeCounter.PlayersStartingLifePoints;

    let maxCurrentLifePoints = self.FetchMaxCurrentLifePoints();

    self.OldPlayersMaxLifePoints = self.LifeCounter.MaxLifePoints;
    if (
      self.OldPlayersMaxLifePoints === "" ||
      self.OldPlayersMaxLifePoints === null ||
      self.OldPlayersMaxLifePoints === undefined ||
      self.OldPlayersMaxLifePoints > maxCurrentLifePoints
    ) {
      self.OldPlayersMaxLifePoints = maxCurrentLifePoints;
      self.Inputs.MaxLifePoints = maxCurrentLifePoints;
    }

    self.Inputs.LifeCounterName.val(self.LifeCounter.LifeCounterName)
      .trigger("focus")
      .trigger("select");

    self.Inputs.PlayersStartingLifePoints.val(
      self.LifeCounter.PlayersStartingLifePoints
    );

    self.Inputs.PlayersCount.each(function () {
      const $button = $(this);
      const increment = parseInt($button.text().replace("+", ""), 10);

      if (self.LifeCounter.PlayersCount + increment > 6) {
        $button.addClass("d-none");
      } else {
        $button.removeClass("d-none");
      }
    });

    self.Inputs.FixedMaxLifePointsMode.attr(
      "checked",
      self.LifeCounter.FixedMaxLifePointsMode == true
    );
    if (self.LifeCounter.FixedMaxLifePointsMode == true) {
      self.Inputs.MaxLifePointsInputWrapper.removeClass("d-none");

      self.Inputs.PlayersMaxLifePoints.val(
        self.LifeCounter.PlayersMaxLifePoints
      );
    }

    self.Inputs.AutoDefeatMode.attr(
      "checked",
      self.LifeCounter.AutoDefeatMode == true
    );

    self.Inputs.AutoEndMode.attr(
      "checked",
      self.LifeCounter.AutoEndMode == true
    );
  };
  self.CheckForValidMaxLifePoints = () => {
    let maxCurrentLifePoints = self.FetchMaxCurrentLifePoints();

    if (self.Inputs.PlayersMaxLifePoints < maxCurrentLifePoints) {
      sweetAlertError(
        "Max Life Points can only be equal or less than:",
        maxCurrentLifePoints
      );
      return;
    }
  };
  self.CheckFormFilling = () => {
    let nameInput = self.Inputs.LifeCounterName.val().trim();

    console.log("nameInput: ", nameInput);

    if (nameInput.length === 0) {
      self.LifeCounter.LifeCounterName = self.OldName;

      self.SetLifeCounter();
    }

    let startingLifePoints = self.Inputs.PlayersStartingLifePoints.val().trim();
    if (
      startingLifePoints === "" ||
      !Number.isInteger(Number(startingLifePoints))
    ) {
      self.LifeCounter.PlayersStartingLifePoints =
        self.OldPlayersStartingLifePoints;

      self.SetLifeCounter();
    }

    if (self.Inputs.FixedMaxLifePointsMode.is(":checked") == true) {
      let maxLifePoints = self.Inputs.PlayersMaxLifePoints.val().trim();

      if (
        maxLifePoints.length === "" ||
        !Number.isInteger(Number(maxLifePoints)) ||
        maxLifePoints == undefined
      ) {
        self.LifeCounter.PlayersMaxLifePoints = self.OldPlayersMaxLifePoints;
      }
      self.SetLifeCounter();
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

    self.Inputs.LifeCounterName.trigger("focus");
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
    self.LifeCounter.LifeCounterName = self.Inputs.LifeCounterName.val().trim();

    self.LifeCounter.PlayesStartingLifePoints =
      self.Inputs.PlayersStartingLifePoints.val().trim();

    if (self.newPlayersCount) {
      self.LifeCounter.PlayersCount = self.newPlayersCount;
    }

    self.LifeCounter.FixedMaxLifeMode =
      self.Inputs.FixedMaxLifePointsMode.is(":checked");

    if (self.Inputs.FixedMaxLifePointsMode.is(":checked") === true) {
      self.LifeCounter.MaxLifePoints = self.Inputs.PlayersMaxLifePoints.val();
    } else {
      self.LifeCounter.MaxLifePoints = null;
    }

    self.LifeCounter.AutoDefeatMode = self.Inputs.AutoDefeatMode.is(":checked");

    if (self.Inputs.AutoDefeatMode.is(":checked") === true) {
      self.LifeCounter.AutoEndMode = self.Inputs.AutoEndMode.is(":checked");
    } else {
      self.LifeCounter.AutoEndMode = false;
    }

    self.SetLifeCounter();
    self.SetLifeCounterPlayers();

    self.RedirectToLifeCounter();
  };

  self.LoadEvents = () => {
    self.Buttons.Close.on("click", function (e) {
      e.preventDefault();

      self.RedirectToLifeCounter();
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
    });

    self.Buttons.Confirm.on("click", (e) => {
      self.CheckFormFilling();

      self.CheckForValidMaxLifePoints();

      self.ConfirmLifeCounterManagerSetUp();
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
      self.newPlayersCount = self.LifeCounter.PlayersCount + increment;
    });

    closeOnAnyKey();
  };

  self.Build = () => {
    self.LoadReferences();
    self.PreFillForm();
    self.LoadEvents();
  };

  self.Build();
}

$(function () {
  new life_counter_explore_setup();
});
