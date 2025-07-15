function life_counter_manager_edit() {
  let self = this;

  self.IsUserLoggedIn = false;
  self.CheckAuthenticationStatus = () => {
    $("body").loadpage("charge");

    $.ajax({
      type: "GET",
      url: "https://localhost:7081/users/validatestatus",
      xhrFields: { withCredentials: true },
      success: function (response) {
        if (response.content == null) {
          sweetAlertError("Error", response.message);
          return;
        }

        self.IsUserLoggedIn = response.content.isUserLoggedIn;

        self.Build();
      },
      error: function (xhr, status, error) {
        sweetAlertError("Failed to fetch user details. Try again later.");
      },
      complete: function () {
        $("body").loadpage("demolish");
      },
    });
  };

  self.LifeCounterTemplates = [];
  self.GetLifeCounterTemplates = () => {
    return JSON.parse(localStorage.getItem("LifeCounterTemplates"));
  };
  self.SetLifeCounterTemplates = () => {
    localStorage.setItem(
      "LifeCounterTemplates",
      JSON.stringify(self.LifeCounterTemplates)
    );
  };

  self.Current_LifeCounter_Template = {};
  self.Current_LifeCounter_Manager = {};
  self.Current_LifeCounter_Players = [];
  self.FirstPlayerIndex = null;

  self.OldPlayersCount = null;
  self.NewPlayersCount = null;

  self.LifeCounterManagerId = null;
  self.GetLifeCounterManagerId = () => {
    self.LifeCounterManagerId = new URLSearchParams(window.location.search).get(
      "LifeCounterManagerId"
    );

    if (!self.LifeCounterManagerId) {
      sweetAlertError("failed");

      return;
    }

    self.GetLifeCounterManagerDetails();
  };

  self.LoadReferences = () => {
    self.DOM = $("#main-lifeCounter-explore-setUp");

    self.Form = self.DOM.find("#form-lifeCounter-explore-setUp");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.Close = self.DOM.find(
      "#button-close-lifeCounter-explore-setUp"
    );
    self.Buttons[self.Buttons.length] = self.Buttons.Delete = self.DOM.find(
      "#button-delete-lifeCounter-explore-setup"
    );
    self.Buttons[self.Buttons.length] = self.Buttons.ClearForm = self.DOM.find(
      "#button-clear-lifeCounter-explore-setup"
    );
    self.Buttons[self.Buttons.length] = self.Buttons.Confirm = self.DOM.find(
      "#button-confirm-lifeCounter-explore-setup"
    );

    self.LifeCounterMenu = self.DOM.find("#a-menu-lifeCounter-explore-setup");

    self.Inputs = [];
    self.Inputs[self.Inputs.length] = self.Inputs.LifeCounterManagerName =
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
    self.Locations[self.Locations.length] = self.Locations.LifeCounterManager =
      "/html/lifecounter/lifecounter_manager.html";
  };

  self.RedirectToLifeCounterManager = (lifeCounterManagerId) => {
    if (!lifeCounterManagerId) {
      window.location.href = `${self.Locations.LifeCounterManager}`;

      return;
    }

    window.location.href = `${
      self.Locations.LifeCounterManager
    }?LifeCounterManagerId=${encodeURIComponent(lifeCounterManagerId)}`;
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

  self.GetLifeCounterManagerDetails = () => {
    self.OldPlayersCount = null;
    self.NewPlayersCount = null;

    if (!self.LifeCounterManagerId) {
      sweetAlertError("Failed to fetch id", "self.LifeCounterTemplateId");
      return;
    }

    if (self.IsUserLoggedIn === true) {
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

          // Fetching LIFE COUNTER TEMPLATE
          const templateId = response.content.lifeCounterTemplateId;
          const templateName = response.content.lifeCounterTemplateName;

          self.Current_LifeCounter_Template = {
            LifeCounterTemplateId: templateId,
            LifeCounterTemplateName: templateName,
          };

          // Fetching LIFE COUNTER MANAGER
          const manager = response.content;

          self.Current_LifeCounter_Manager = {
            LifeCounterTemplateId: templateId,

            LifeCounterManagerId: self.LifeCounterManagerId,
            LifeCounterManagerName: manager.lifeCounterManagerName,
            PlayersStartingLifePoints: manager.playersStartingLifePoints,
            PlayersCount: manager.playersCount,
            FirstPlayerIndex: manager.firstPlayerIndex,
            LifeCounterPlayers: [],
            FixedMaxLifePointsMode: manager.fixedMaxLifePointsMode,
            PlayersMaxLifePoints: manager.playersMaxLifePoints,
            AutoDefeatMode: manager.autoDefeatMode,
            AutoEndMode: manager.autoEndMode,
            StartingTime: manager.startingTime,
            EndingTime: manager.endingTime,
            Duration_minutes: manager.duration_minutes,
            IsFinished: manager.isFinished,
          };

          self.FirstPlayerIndex = manager.FirstPlayerIndex;

          // Fetching LIFE COUNTER PLAYERS
          const players = manager.lifeCounterPlayers;
          self.Current_LifeCounter_Players = [];
          players.forEach((player) => {
            const newPlayer = {
              LifeCounterManagerId: self.LifeCounterManagerId,
              PlayerId: player.playerId,
              PlayerName: player.playerName,
              CurrentLifePoints: player.currentLifePoints,
              IsDefeated: player.isDefeated,
            };
            self.Current_LifeCounter_Players.push(newPlayer);
          });

          self.Current_LifeCounter_Manager.LifeCounterPlayers =
            self.Current_LifeCounter_Players;

          self.PreFillForm();
        },
        error: function (xhr, status, error) {
          sweetAlertError("Could not load life counter");
        },
      });

      return;
    }
    self.LifeCounterTemplates = self.GetLifeCounterTemplates();

    self.Current_LifeCounter_Template = self.LifeCounterTemplates.find(
      (template) =>
        template.LifeCounterManagers.find(
          (manager) => manager.LifeCounterManagerId == self.LifeCounterManagerId
        )
    );
    self.Current_LifeCounter_Manager =
      self.Current_LifeCounter_Template.LifeCounterManagers.find(
        (manager) => manager.LifeCounterManagerId == self.LifeCounterManagerId
      );

    self.OldPlayersCount = parseInt(
      self.Current_LifeCounter_Manager.PlayersCount,
      10
    );

    self.Current_LifeCounter_Players =
      self.Current_LifeCounter_Manager.LifeCounterPlayers;

    self.PreFillForm();
  };

  self.PreFillForm = () => {
    const manager = self.Current_LifeCounter_Manager;

    self.Inputs.LifeCounterManagerName.val(manager.LifeCounterManagerName)
      .trigger("focus")
      .trigger("select");

    self.Inputs.PlayersStartingLifePoints.val(
      manager.PlayersStartingLifePoints
    );

    self.Inputs.PlayersCount.each(function () {
      self.Inputs.PlayersCount.eq(manager.PlayersCount - 1).addClass(
        "clickedState"
      );
    });

    self.Inputs.FixedMaxLifePointsMode.attr(
      "checked",
      manager.FixedMaxLifePointsMode == true
    );

    if (manager.FixedMaxLifePointsMode == true) {
      self.Inputs.MaxLifePointsInputWrapper.removeClass("d-none");
      self.Inputs.PlayersMaxLifePoints.prop("disabled", false);

      self.Inputs.PlayersMaxLifePoints.val(manager.PlayersMaxLifePoints);
    }

    self.Inputs.AutoDefeatMode.attr("checked", manager.AutoDefeatMode == true);

    self.Inputs.AutoEndMode.attr("checked", manager.AutoEndMode == true);
  };

  self.DeleteLifeCounterManager = () => {
    if (self.IsUserLoggedIn === true) {
      const formData = new FormData();
      formData.append("LifeCounterTemplateId", self.LifeCounterTemplateId);
      $.ajax({
        type: "DELETE",
        url: `https://localhost:7081/users/deletelifecountermanager?LifeCounterManagerId=${self.LifeCounterManagerId}`,
        xhrFields: { withCredentials: true },
        success: function (resp) {
          if (!resp.content) {
            sweetAlertSuccess(resp.message);
            return;
          }

          self.RedirectToLifeCounterManager();
        },
        error: function (err) {
          sweetAlertError(err);
        },
      });

      return;
    }

    const template = self.Current_LifeCounter_Template;
    const current_manager = self.Current_LifeCounter_Manager;

    template.LifeCounterManagers = template.LifeCounterManagers.filter(
      (manager) => manager !== current_manager
    );

    self.SetLifeCounterTemplates();

    self.RedirectToLifeCounterManager();
  };

  self.ClearForm = () => {
    $.each(self.Inputs, function (i, input) {
      input.val("");
    });

    self.Inputs.LifeCounterManagerName.trigger("focus");

    self.Inputs.PlayersStartingLifePoints.val(1);

    self.Inputs.PlayersCount.removeClass("clickedState");
    self.Inputs.PlayersCount.eq(0).addClass("clickedState");

    self.Inputs.FixedMaxLifePointsMode.prop("checked", false);
    self.Inputs.MaxLifePointsInputWrapper.fadeOut().addClass("d-none");

    self.Inputs.AutoDefeatMode.prop("checked", false);

    self.Inputs.AutoEndMode.prop("checked", false).prop("disabled", true);
  };

  self.EditLifeCounterManager = () => {
    const manager = self.Current_LifeCounter_Manager;

    let newName = self.Inputs.LifeCounterManagerName.val();

    if (self.IsUserLoggedIn === false) {
      let isNameValid = self.EvaluateNewName(newName);

      if (isNameValid === false) {
        sweetAlertError(
          "Requested name is already in use, please choose another one."
        );

        return;
      }
    }

    manager.LifeCounterManagerName = self.Inputs.LifeCounterManagerName.val();

    manager.PlayesStartingLifePoints =
      self.Inputs.PlayersStartingLifePoints.val().trim();

    if (self.NewPlayersCount) {
      self.EvaluatePlayersCount();

      manager.PlayersCount = self.NewPlayersCount;
    }

    manager.FixedMaxLifePointsMode =
      self.Inputs.FixedMaxLifePointsMode.is(":checked");

    if (self.Inputs.FixedMaxLifePointsMode.is(":checked") === true) {
      manager.PlayersMaxLifePoints = parseInt(
        self.Inputs.PlayersMaxLifePoints.val(),
        10
      );

      let playersCurrentLifePoints = [];

      self.Current_LifeCounter_Players.forEach((player) => {
        playersCurrentLifePoints.push(player.CurrentLifePoints);
      });

      let playersMaxCurrentLifePoints = Math.max(...playersCurrentLifePoints);

      if (playersMaxCurrentLifePoints > manager.PlayersMaxLifePoints) {
        manager.PlayersMaxLifePoints = playersMaxCurrentLifePoints;
      }
    } else {
      manager.PlayersMaxLifePoints = null;
    }

    manager.AutoDefeatMode = self.Inputs.AutoDefeatMode.is(":checked");

    if (self.Inputs.AutoDefeatMode.is(":checked") === true) {
      manager.AutoEndMode = self.Inputs.AutoEndMode.is(":checked");
    } else {
      manager.AutoEndMode = false;
    }

    const lifeCounterManagerId =
      self.Current_LifeCounter_Manager.LifeCounterManagerId;
    const lifeCounterManagerName =
      self.Current_LifeCounter_Manager.LifeCounterManagerName;
    const playersStartingLifePoints =
      self.Current_LifeCounter_Manager.PlayersStartingLifePoints;
    const playersCount = self.Current_LifeCounter_Manager.PlayersCount;
    const firstPlayerIndex = self.Current_LifeCounter_Manager.FirstPlayerIndex;
    const fixedMaxLifeMode =
      self.Current_LifeCounter_Manager.FixedMaxLifePointsMode;
    const playersMaxLifePoints =
      self.Current_LifeCounter_Manager.PlayersMaxLifePoints;
    const autoDefeatMode = self.Current_LifeCounter_Manager.AutoDefeatMode;
    const autoEndMode = self.Current_LifeCounter_Manager.AutoEndMode;

    if (self.IsUserLoggedIn === true) {
      $.ajax({
        type: "PUT",
        url: "https://localhost:7081/users/editlifecountermanager",
        data: JSON.stringify({
          LifeCounterManagerId: lifeCounterManagerId,
          NewLifeCounterManagerName: lifeCounterManagerName,
          NewPlayersStartingLifePoints: playersStartingLifePoints,
          NewPlayersCount: playersCount,
          FirstPlayerIndex: firstPlayerIndex,
          FixedMaxLifePointsMode: fixedMaxLifeMode,
          NewPlayersMaxLifePoints: playersMaxLifePoints,
          AutoDefeatMode: autoDefeatMode,
          AutoEndMode: autoEndMode,
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
        },
        error: (err) => {
          sweetAlertError(err);
        },
        complete: () => {
          confirmBtn.attr("disabled", false).text(originalBtnText);
          self.ClearForm();
        },
      });

      self.RedirectToLifeCounterManager(self.LifeCounterManagerId);
      return;
    }

    self.SetLifeCounterTemplates();

    self.RedirectToLifeCounterManager(manager.LifeCounterManagerId);
  };
  self.EvaluateNewName = (newName) => {
    const newNameAlreadyExists =
      self.Current_LifeCounter_Template.LifeCounterManagers.some(
        (manager) =>
          manager.LifeCounterManagerId !=
            self.Current_LifeCounter_Manager.LifeCounterManagerId &&
          manager.LifeCounterManagerName.trim().toLowerCase() ===
            newName.trim().toLowerCase()
      );

    if (newNameAlreadyExists) {
      return false;
    }

    return true;
  };
  self.EvaluatePlayersCount = () => {
    const manager = self.Current_LifeCounter_Manager;

    const players = self.Current_LifeCounter_Players;

    if (self.NewPlayersCount > self.OldPlayersCount) {
      for (let i = self.OldPlayersCount; i < self.NewPlayersCount; i++) {
        const player_virtualId = "lcp" + (i + 1);
        let newPlayer = {
          LifeCounterManagerId: manager.LifeCounterManagerId,
          PlayerId: player_virtualId,
          PlayerName: "Player " + (i + 1),
          CurrentLifePoints: manager.PlayersStartingLifePoints,
          IsDefeated: false,
        };

        players.push(newPlayer);
      }
    } else if (self.NewPlayersCount < self.OldPlayersCount) {
      manager.PlayersCount = self.NewPlayersCount;

      self.Current_LifeCounter_Players = players.slice(0, self.NewPlayersCount);

      self.Current_LifeCounter_Manager.LifeCounterPlayers =
        self.Current_LifeCounter_Players;

      const firstPlayerIndex = manager.FirstPlayerIndex;
      if (firstPlayerIndex > self.NewPlayersCount - 1) {
        manager.FirstPlayerIndex = Math.floor(
          Math.random() * self.NewPlayersCount
        );
      }
    } else {
      return;
    }
  };

  self.LoadEvents = () => {
    self.Buttons.Close.on("click", function (e) {
      e.preventDefault();

      self.RedirectToLifeCounterManager(self.LifeCounterManagerId);
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

      // Add class to selected
      $(this).addClass("clickedState");

      // Update the player count
      self.NewPlayersCount = parseInt($(this).text(), 10);

      if (self.NewPlayersCount === self.OldPlayersCount) {
        self.NewPlayersCount = null;
      }
    });

    self.Buttons.Delete.on("click", function (e) {
      e.preventDefault();

      self.DeleteLifeCounterManager();
    });

    self.Buttons.ClearForm.on("click", (e) => {
      e.preventDefault();

      self.ClearForm();
    });

    self.Form.on("submit", (e) => {
      e.preventDefault();

      self.EditLifeCounterManager();
    });

    closeOnAnyKey();
  };

  self.Build = () => {
    self.LoadReferences();
    self.GetLifeCounterManagerId();
    self.LoadEvents();
  };

  self.CheckAuthenticationStatus();
}

$(function () {
  new life_counter_manager_edit();
});
