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

  self.PreFillForm = () => {
    self.GetLifeCounter();
    self.GetLifeCounterPlayers();

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
      self.Inputs.PlayersMaxLifePoints.prop("disabled", false);

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

  self.ConfirmLifeCounterManagerSetUp = () => {
    self.LifeCounter.LifeCounterName = self.Inputs.LifeCounterName.val();

    self.LifeCounter.PlayesStartingLifePoints =
      self.Inputs.PlayersStartingLifePoints.val().trim();

    if (self.newPlayersCount) {
      self.LifeCounter.PlayersCount = self.newPlayersCount;
    }

    self.LifeCounter.FixedMaxLifePointsMode =
      self.Inputs.FixedMaxLifePointsMode.is(":checked");

    if (self.Inputs.FixedMaxLifePointsMode.is(":checked") === true) {
      let maxLifePointsInput = self.Inputs.PlayersMaxLifePoints.val();

      const playersCurrentLifePoints = [];
      self.LifeCounterPlayers.forEach((player) => {
        playersCurrentLifePoints.push(player.CurrentLifePoints);
      });

      let playersMaxCurrentLifePoints = Math.max(...playersCurrentLifePoints);

      if (playersMaxCurrentLifePoints > maxLifePointsInput) {
        maxLifePointsInput = playersMaxCurrentLifePoints;
      }

      self.LifeCounter.PlayersMaxLifePoints = maxLifePointsInput;
    } else {
      self.LifeCounter.PlayersMaxLifePoints = null;
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
        self.Inputs.PlayersMaxLifePoints.prop("disabled", false).trigger(
          "focus"
        );
      } else {
        // Checkbox is unchecked
        self.Inputs.PlayersMaxLifePoints.prop("disabled", true);
        self.Inputs.MaxLifePointsInputWrapper.addClass("d-none");
      }
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

    self.Buttons.ClearForm.on("click", (e) => {
      e.preventDefault();

      self.ClearForm();
    });

    self.Form.on("submit", (e) => {
      e.preventDefault();

      self.ConfirmLifeCounterManagerSetUp();
    });
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
