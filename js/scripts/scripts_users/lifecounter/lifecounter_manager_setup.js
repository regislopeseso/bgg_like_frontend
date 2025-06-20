function life_counter_manager_setup() {
  let self = this;

  // LIFE COUNTER MANAGER DB
  self.LifeCounterManagerId = null;
  self.LifeCounterManagerName = null;
  self.PlayersCount = null;
  self.LifeCounterPlayers = [];
  self.PlayersStartingLifePoints = null;
  self.FixedMaxLifePointsMode = null;
  self.PlayersMaxLifePoints = null;
  self.AutoDefeatMode = null;
  self.AutoEndMode = null;

  self.GetLifeCounterManagerId = () => {
    self.LifeCounterManagerId = new URLSearchParams(window.location.search).get(
      "LifeCounterManagerId"
    );
  };

  self.GetLifeCounterManagerDetails = () => {
    if (!self.LifeCounterManagerId) {
      sweetAlertError("Failed to fetch id", "self.LifeCounterTemplateId");
      return;
    }

    // Fetch Life Counter Details based on provided LifeCounterId
    $.ajax({
      type: "GET",
      url: `https://localhost:7081/users/getlifecountermanagerdetails?LifeCounterManagerId=${self.LifeCounterManagerId}`,
      xhrFields: { withCredentials: true },
      success: function (response) {
        if (!response.content) {
          sweetAlertError(response.message_text);
          return;
        }

        const lifeCounterManagerDB = response.content;

        self.LifeCounterManagerName =
          lifeCounterManagerDB.lifeCounterManagerName;

        self.PlayersCount = lifeCounterManagerDB.playersCount;

        self.LifeCounterPlayers = lifeCounterManagerDB.lifeCounterPlayers;

        self.PlayersStartingLifePoints =
          lifeCounterManagerDB.playersStartingLifePoints;

        self.FixedMaxLifePointsMode =
          lifeCounterManagerDB.fixedMaxLifePointsMode;

        self.PlayersMaxLifePoints = lifeCounterManagerDB.playersMaxLifePoints;

        self.AutoDefeatMode = lifeCounterManagerDB.autoDefeatMode;

        self.AutoEndMode = lifeCounterManagerDB.autoEndMode;

        self.PreFillForm();
      },
      error: function (xhr, status, error) {
        sweetAlertError("Could not load life counter");
      },
    });
  };

  self.LoadReferences = () => {
    self.DOM = $("#main-lifeCounter-manager-setUp");

    self.Form = self.DOM.find("#form-lifeCounter-manager-setUp");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.Close = self.DOM.find(
      "#button-close-lifeCounter-manager-setUp"
    );
    self.Buttons[self.Buttons.length] = self.Buttons.ClearForm = self.DOM.find(
      "#button-clear-lifeCounter-manager-setup"
    );
    self.Buttons[self.Buttons.length] = self.Buttons.Confirm = self.DOM.find(
      "#button-confirm-lifeCounter-manager-setup"
    );

    self.LifeCounterMenu = self.DOM.find("#a-menu-lifeCounter-manager-setup");

    self.Inputs = [];
    self.Inputs[self.Inputs.length] = self.Inputs.GameName = self.DOM.find(
      "#input-gameName-lifeCounter-manager-setup"
    );
    self.Inputs[self.Inputs.length] = self.Inputs.PlayersStartingLifePoints =
      self.DOM.find(
        "#input-PlayersStartingLifePoints-lifeCounter-manager-setup"
      );
    self.Inputs[self.Inputs.length] = self.Inputs.PlayersCount = self.DOM.find(
      ".players-count-options"
    );
    self.Inputs[self.Inputs.length] = self.Inputs.FixedMaxLifePointsMode =
      self.DOM.find("#input-fixedMaxLifePointsMode-lifeCounter-manager-setup");
    self.Inputs[self.Inputs.length] = self.Inputs.MaxLifePointsInputWrapper =
      self.DOM.find("#div-PlayersMaxLifePoints-input-wrapper");
    self.Inputs[self.Inputs.length] = self.Inputs.PlayersMaxLifePoints =
      self.DOM.find("#input-playersMaxLifePoints-lifeCounter-manager-setup");
    self.Inputs[self.Inputs.length] = self.Inputs.AutoDefeatMode =
      self.DOM.find("#input-autoDefeatMode-lifeCounter-manager-setup");
    self.Inputs[self.Inputs.length] = self.Inputs.AutoEndMode = self.DOM.find(
      "#input-autoEndMode-lifeCounter-manager-setup"
    );

    self.Locations = [];
    self.Locations[self.Locations.length] = self.Locations.UsersPage =
      "/html/pages_users/users_page.html";
    self.Locations[self.Locations.length] = self.Locations.LifeCounterManager =
      "/html/pages_users/lifecounter/lifecounter_manager.html";
    self.Locations[self.Locations.length] = self.Locations.LifeCounterMenu =
      "/html/pages_users/lifecounter/lifecounter_menu.html";
  };

  self.RedirectToUsersPage = () => {
    window.location.href = self.Locations.UsersPage;
  };
  self.RedirectToSetUpLifeCounterPage = () => {
    window.location.href = self.Locations.SetUpLifeCounter;
  };
  self.RedirectToLifeCounterManager = (lifeCounterManagerId) => {
    window.location.href = `${
      self.Locations.LifeCounterManager
    }?LifeCounterManagerId=${encodeURIComponent(lifeCounterManagerId)}`;
  };
  self.RedirectToLifeCounterMenu = (lifeCounterManagerId) => {
    window.location.href = `${
      self.Locations.LifeCounterMenu
    }?LifeCounterManagerId=${encodeURIComponent(lifeCounterManagerId)}`;
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

    self.LifeCounterMenu.on("click", function (e) {
      e.preventDefault();

      self.RedirectToLifeCounterMenu(self.LifeCounterManagerId);
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
    self.GetLifeCounterManagerId();
    self.GetLifeCounterManagerDetails();
    self.LoadReferences();
    self.LoadEvents();
  };

  self.Build();
}

$(function () {
  new life_counter_manager_setup();
});
