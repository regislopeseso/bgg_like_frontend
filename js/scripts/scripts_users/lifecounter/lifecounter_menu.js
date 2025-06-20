function life_counter_menu() {
  let self = this;

  self.LifeCounterManagerId = null;
  self.PlayersCount = null;

  self.GetLifeCounterManagerId = () => {
    self.LifeCounterManagerId = new URLSearchParams(window.location.search).get(
      "LifeCounterManagerId"
    );
  };

  self.LoadReferences = () => {
    self.DOM = $("#main-lifeCounter-menu");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.CloseMenu = self.DOM.find(
      "#button-close-lifeCounter-menu"
    );
    self.Buttons[self.Buttons.length] = self.Buttons.CreateLifeCounterTemplate =
      self.DOM.find("#button-createTemplate-lifeCounter-menu");
    self.Buttons[self.Buttons.length] = self.Buttons.SelectLifeCounterTemplate =
      self.DOM.find("#button-selectTemplate-lifeCounter-menu");
    self.Buttons[self.Buttons.length] = self.Buttons.ReloadLifeCounter =
      self.DOM.find("#button-reloadLifeCounterManager-lifeCounter-menu");
    self.Buttons[self.Buttons.length] = self.Buttons.ShowLifeCounterStatistics =
      self.DOM.find("#button-showStatistics-lifeCounter-menu");

    self.Togglers = [];
    self.Togglers[self.Togglers.length] =
      self.Togglers.ToggleCreateLifeCounterTemplate = self.DOM.find(
        "#toggle-createTemplate-lifeCounter-menu"
      );
    self.Togglers[self.Togglers.length] =
      self.Togglers.ToggleSelectLifeCounterTemplate = self.DOM.find(
        "#toggle-selectTemplate-lifeCounter-menu"
      );
    self.Togglers[self.Togglers.length] =
      self.Togglers.ToggleReloadLifeCounterManager = self.DOM.find(
        "#toggle-reloadLifeCounterManager-lifeCounter-menu"
      );
    self.Togglers[self.Togglers.length] =
      self.Togglers.ShowLifeCounterStatistics = self.DOM.find(
        "#toggle-showStatistics-lifeCounter-menu"
      );

    self.Inputs = [];
    self.Inputs[self.Inputs.length] = self.Inputs.CreateTemplate_Name =
      self.DOM.find("#input-templateName-lifeCounter-menu");
    self.Inputs[self.Inputs.length] =
      self.Inputs.CreateTemplate_PlayersStartingLifePoints = self.DOM.find(
        "#input-playersStartingLifePoints-lifeCounter-menu"
      );
    self.Inputs[self.Inputs.length] = self.Inputs.CreateTemplate_PlayersCount =
      self.DOM.find(".players-count-options");
    self.Inputs[self.Inputs.length] =
      self.Inputs.CreateTemplate_FixedMaxLifePointsMode = self.DOM.find(
        "#input-fixedMaxLifePointsMode-lifeCounter-menu"
      );
    self.Inputs[self.Inputs.length] =
      self.Inputs.CreateTemplate_MaxLifePointsInputWrapper = self.DOM.find(
        "#div-PlayersMaxLifePoints-input-wrapper"
      );
    self.Inputs[self.Inputs.length] =
      self.Inputs.CreateTemplate_PlayersMaxLifePoints = self.DOM.find(
        "#input-playersMaxLifePoints-lifeCounter-menu"
      );
    self.Inputs[self.Inputs.length] =
      self.Inputs.CreateTemplate_AutoDefeatMode = self.DOM.find(
        "#input-autoDefeatMode-lifeCounter-menu"
      );
    self.Inputs[self.Inputs.length] =
      self.Inputs.CreateTemplate_AutoEndMatchMode = self.DOM.find(
        "#input-autoEndMode-lifeCounter-menu"
      );

    self.Locations = [];
    self.Locations[self.Locations.length] =
      self.Locations.LifeCounterManagerSetUp =
        "/html/pages_users/lifecounter/lifecounter_manager_setup.html";
    self.Locations.LifeCounterManager =
      "/html/pages_users/lifecounter/lifecounter_manager.html";
  };

  self.RedirectToLifeCounterManagerSetUp = (lifeCounterManagerId) => {
    window.location.href = `${
      self.Locations.LifeCounterManagerSetUp
    }?LifeCounterManagerId=${encodeURIComponent(lifeCounterManagerId)}`;
  };

  self.RedirectToLifeCounterManager = (lifeCounterManagerId) => {
    window.location.href = `${
      self.Locations.LifeCounterManagerSetUp
    }?LifeCounterManagerId=${encodeURIComponent(lifeCounterManagerId)}`;
  };

  self.ResetMenuOptions = () => {
    self.Togglers.forEach((toggler) => {
      toggler.css("display", "none");
    });

    self.Buttons.forEach((button) => {
      button.removeClass("chosenMenuOption");
    });
  };

  self.LoadEvents = () => {
    self.Buttons.CloseMenu.on("click", function (e) {
      e.preventDefault();

      self.RedirectToLifeCounterManagerSetUp(self.LifeCounterManagerId);
    });

    self.Buttons.CreateLifeCounterTemplate.on("click", function (e) {
      if ($(this).hasClass("chosenMenuOption")) {
        $(this).removeClass("chosenMenuOption");
        self.Togglers.ToggleCreateLifeCounterTemplate.slideToggle();
        return;
      }
      self.Inputs.CreateTemplate_Name.trigger("focus");

      self.ResetMenuOptions();

      self.Buttons.CreateLifeCounterTemplate.addClass("chosenMenuOption");

      self.Togglers.ToggleCreateLifeCounterTemplate.slideToggle(() => {
        self.Inputs.CreateTemplate_Name.trigger("focus");
      });
    });
    self.Inputs.CreateTemplate_PlayersCount.on("click", function (e) {
      e.preventDefault();

      // Remove the class from all
      self.Inputs.CreateTemplate_PlayersCount.removeClass("clickedState");

      // Parse increment value from the button
      const increment = parseInt($(this).text().replace("+", ""), 10);

      // Add class to selected
      $(this).addClass("clickedState");

      // Update the player count
      self.PlayersCount += increment;
    });
    self.Inputs.CreateTemplate_FixedMaxLifePointsMode.on(
      "change",
      function (e) {
        if ($(this).is(":checked")) {
          // Checkbox is checked
          self.Inputs.CreateTemplate_MaxLifePointsInputWrapper.removeClass(
            "d-none"
          );
        } else {
          // Checkbox is unchecked
          self.Inputs.CreateTemplate_MaxLifePointsInputWrapper.addClass(
            "d-none"
          );
        }
      }
    );
    self.Inputs.CreateTemplate_AutoDefeatMode.on("change", (e) => {
      if (!self.Inputs.CreateTemplate_AutoDefeatMode.is(":checked")) {
        self.Inputs.CreateTemplate_AutoEndMatchMode.prop("checked", false) // <-- Correct way to uncheck
          .prop("disabled", true); // <-- Properly disables the checkbox
      } else {
        self.Inputs.CreateTemplate_AutoEndMatchMode.prop("disabled", false); // Re-enable if needed
      }
    });

    self.Buttons.SelectLifeCounterTemplate.on("click", function (e) {
      if ($(this).hasClass("chosenMenuOption")) {
        $(this).removeClass("chosenMenuOption");
        self.Togglers.ToggleSelectLifeCounterTemplate.slideToggle();
        return;
      }

      self.ResetMenuOptions();

      self.Buttons.SelectLifeCounterTemplate.addClass("chosenMenuOption");

      self.Togglers.ToggleSelectLifeCounterTemplate.slideToggle();
    });

    self.Buttons.ReloadLifeCounter.on("click", function (e) {
      if ($(this).hasClass("chosenMenuOption")) {
        $(this).removeClass("chosenMenuOption");
        self.Togglers.ToggleReloadLifeCounterManager.slideToggle();
        return;
      }

      self.ResetMenuOptions();

      self.Buttons.ReloadLifeCounter.addClass("chosenMenuOption");

      self.Togglers.ToggleReloadLifeCounterManager.slideToggle();
    });

    self.Buttons.ShowLifeCounterStatistics.on("click", function (e) {
      if ($(this).hasClass("chosenMenuOption")) {
        $(this).removeClass("chosenMenuOption");
        self.Togglers.ShowLifeCounterStatistics.slideToggle();
        return;
      }

      self.ResetMenuOptions();

      self.Buttons.ShowLifeCounterStatistics.addClass("chosenMenuOption");

      self.Togglers.ShowLifeCounterStatistics.slideToggle();
    });
  };

  self.Build = () => {
    self.GetLifeCounterManagerId();
    self.LoadReferences();
    self.LoadEvents();
  };

  self.Build();
}

$(function () {
  new life_counter_menu();
});
