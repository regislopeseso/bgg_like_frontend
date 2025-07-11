function life_counter_player_edit() {
  let self = this;

  self.LifeCounterPlayerId = null;
  self.GetLifeCounterPlayerId = () => {
    self.LifeCounterPlayerId = new URLSearchParams(window.location.search).get(
      "PlayerId"
    );
  };

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

  self.GetLifeCounterTemplates = () => {
    return JSON.parse(localStorage.getItem("LifeCounterTemplates"));
  };
  self.SetLifeCounterTemplates = () => {
    localStorage.setItem(
      "LifeCounterTemplates",
      JSON.stringify(self.LifeCounterTemplates)
    );
  };

  self.LifeCounterTemplates = [];
  self.Current_LifeCounter_Template = [];
  self.Current_LifeCounter_Manager = [];
  self.Current_LifeCounter_Players = [];
  self.Current_LifeCounter_Player = null;

  self.GetLifeCounterDetails = () => {
    if (!self.LifeCounterPlayerId) {
      sweetAlertError(
        "Failed to retrieve life counter data from local storage"
      );
      return;
    }
    if (self.IsUserLoggedIn === true) {
      self.GetLifeCounterPlayerDetails();
      return;
    }

    self.LifeCounterTemplates = self.GetLifeCounterTemplates();

    self.Current_LifeCounter_Template = self.LifeCounterTemplates.find(
      (template) =>
        template.LifeCounterManagers.find((manager) =>
          manager.LifeCounterPlayers.find(
            (player) => player.PlayerId == self.LifeCounterPlayerId
          )
        )
    );

    self.Current_LifeCounter_Manager =
      self.Current_LifeCounter_Template.LifeCounterManagers.find((manager) =>
        manager.LifeCounterPlayers.find(
          (player) => player.PlayerId == self.LifeCounterPlayerId
        )
      );

    self.Current_LifeCounter_Players =
      self.Current_LifeCounter_Manager.LifeCounterPlayers;

    self.Current_LifeCounter_Player = self.Current_LifeCounter_Players.find(
      (player) => player.PlayerId == self.LifeCounterPlayerId
    );

    self.PreFillForm();
  };

  self.GetLifeCounterPlayerDetails = () => {
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

        self.Current_LifeCounter_Player = {
          LifeCounterManagerId: lifeCounterPlayerDB.lifeCounterManagerId,
          PlayerId: self.LifeCounterPlayerId,
          PlayerName: lifeCounterPlayerDB.lifeCounterPlayerName,
          CurrentLifePoints: lifeCounterPlayerDB.playerCurrentLifePoints,
          IsDefeated: lifeCounterPlayerDB.IsDefeated,
        };

        self.GetLifeCounterManagerDetails(
          lifeCounterPlayerDB.lifeCounterManagerId
        );
      },
      error: function (xhr, status, error) {
        sweetAlertError("Could not load life counter");
      },
    });
  };
  self.GetLifeCounterManagerDetails = (managerId) => {
    $.ajax({
      type: "GET",
      url: `https://localhost:7081/users/getlifecountermanagerdetails?LifeCounterManagerId=${managerId}`,
      xhrFields: { withCredentials: true },
      success: function (response) {
        if (!response.content) {
          sweetAlertError(response.message_text);
          return;
        }

        const template = response.content.lifeCounterTemplate;
        const manager = response.content;
        const players = response.content.lifeCounterPlayers;

        self.Current_LifeCounter_Players = [];
        players.forEach((player) => {
          const newPlayer = {
            LifeCounterManagerId: managerId,
            PlayerId: player.playerId,
            PlayerName: player.playerName,
            CurrentLifePoints: player.currentLifePoints,
            IsDefeated: player.isDefeated,
          };
          self.Current_LifeCounter_Players.push(newPlayer);
        });

        self.Current_LifeCounter_Manager = {
          LifeCounterTemplateId: template.lifeCounterTemplateId,
          LifeCounterManagerId: managerId,
          LifeCounterManagerName: manager.lifeCounterManagerName,
          PlayersStartingLifePoints: manager.playersStartingLifePoints,
          PlayersCount: manager.playersCount,
          LifeCounterPlayers: self.Current_LifeCounter_Players,
          FixedMaxLifePointsMode: manager.fixedMaxLifePointsMode,
          PlayersMaxLifePoints: manager.playersMaxLifePoints,
          AutoDefeatMode: manager.autoDefeatMode,
          AutoEndMode: manager.autoEndMode,
          StartingTime: manager.startingTime,
          EndingTime: manager.endingTime,
          Duration_minutes: manager.duration_minutes,
          IsFinished: manager.isFinished,
        };

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
    self.Buttons[self.Buttons.length] = self.Buttons.DeletePlayer =
      self.DOM.find("#button-deletePlayer-lifeCounter-player-setup");
    self.Buttons[self.Buttons.length] = self.Buttons.SetAsFirstPlayer =
      self.DOM.find("#button-setAsFirstPlayer-lifeCounter-player-setup");
    self.Buttons[self.Buttons.length] = self.Buttons.ChangeName = self.DOM.find(
      "#button-changePlayerName-lifeCounter-player-setup"
    );

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
    self.Fields[self.Fields.length] = self.Fields.FixedMaxLifePointsModeOn =
      self.DOM.find("#span-fixedMaxLifePointsMode-on-lifeCounter-player-setup");
    self.Fields[self.Fields.length] = self.Fields.FixedMaxLifePointsModeOff =
      self.DOM.find(
        "#span-fixedMaxLifePointsMode-off-lifeCounter-player-setup"
      );
    self.Fields[self.Fields.length] = self.Fields.MaxLifePointsInputWrapper =
      self.DOM.find("#div-playerMaxLifePoints-input-wrapper");
    self.Fields[self.Fields.length] = self.Fields.PlayerMaxLifePoints =
      self.DOM.find(
        "#div-playerMaxLifePointsMode-lifeCounter-player-setup span"
      );
    self.Fields[self.Inputs.length] = self.Fields.AutoDefeatMode =
      self.DOM.find("#div-autoDefeatMode-lifeCounter-player-setup");
    self.Fields[self.Fields.length] = self.Fields.AutoDefeatModeOn =
      self.DOM.find("#span-autoDefeatMode-on-lifeCounter-player-setup");
    self.Fields[self.Fields.length] = self.Fields.AutoDefeatModeOff =
      self.DOM.find("#span-autoDefeatMode-off-lifeCounter-player-setup");

    self.Locations = [];
    self.Locations[self.Locations.length] = self.Locations.LifeCounterManager =
      "/html/lifecounter/lifecounter_manager.html";
  };

  self.RedirectToLifeCounterManager = (lifeCounterManagerId) => {
    if (!lifeCounterManagerId) {
      sweetAlertError("Redirect failed", "Missing lifeCounterManagerId!");
    }
    window.location.href = `${
      self.Locations.LifeCounterManager
    }?LifeCounterManagerId=${encodeURIComponent(lifeCounterManagerId)}`;
  };

  self.PreFillForm = () => {
    const player = self.Current_LifeCounter_Player;
    const manager = self.Current_LifeCounter_Manager;

    self.Inputs.LifeCounterPlayerName.val(player.PlayerName)
      .trigger("focus")
      .trigger("select");

    self.Fields.PlayerCurrentLifePoints.html(player.CurrentLifePoints);
    self.Fields.PlayerStartingLifePoints.html(
      manager.PlayersStartingLifePoints
    );

    if (manager.FixedMaxLifePointsMode === true) {
      self.Fields.FixedMaxLifePointsModeOff.addClass("d-none");
      self.Fields.FixedMaxLifePointsModeOn.removeClass("d-none");

      self.Fields.MaxLifePointsInputWrapper.removeClass("d-none");
      self.Fields.PlayerMaxLifePoints.html(manager.PlayersMaxLifePoints);
    } else {
      self.Fields.PlayerMaxLifePoints.html("-");
      self.Fields.MaxLifePointsInputWrapper.addClass("d-none");
      self.Fields.FixedMaxLifePointsModeOn.addClass("d-none");

      self.Fields.FixedMaxLifePointsModeOff.removeClass("d-none");
    }

    if (manager.AutoDefeatMode === true) {
      self.Fields.AutoDefeatModeOff.addClass("d-none");
      self.Fields.AutoDefeatModeOn.removeClass("d-none");
    } else {
      self.Fields.AutoDefeatModeOn.addClass("d-none");
      self.Fields.AutoDefeatModeOff.removeClass("d-none");
    }

    if (manager.PlayersCount <= 1) {
      self.Buttons.DeletePlayer.attr("disabled", true).css(
        "pointer-events",
        "none"
      );
    }
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

      self.RedirectToLifeCounterManager(
        self.Current_LifeCounter_Manager.LifeCounterManagerId
      );
    });

    self.Buttons.SetAsFirstPlayer.on("click", function (e) {
      e.preventDefault();

      self.SetAsFirstPlayer();
    });

    self.Buttons.ChangeName.on("click", function (e) {
      e.preventDefault();

      self.ChangeName();
    });

    self.Buttons.DeletePlayer.on("click", (e) => {
      e.preventDefault();

      if (self.PlayersCount <= 1) return;

      self.DeletePlayer();
    });

    closeOnAnyKey();
  };

  self.ChangeName = () => {
    //Disable submit button to prevent double submissions
    const confirmBtn = self.Buttons.ChangeName;
    const originalBtnText = confirmBtn.text();
    confirmBtn.attr("disabled", true).text("Submitting...");

    const players = self.Current_LifeCounter_Players;
    const player = self.Current_LifeCounter_Player;

    const newName = self.Inputs.LifeCounterPlayerName.val().trim();

    if (!newName || newName == player.PlayerName) {
      self.RedirectToLifeCounterManager();
      return;
    }

    const newName_lowerCase = newName.toLowerCase();

    const nameAlreadyExists = players.some(
      (player) => player.PlayerName.toLowerCase().trim() === newName_lowerCase
    );

    if (nameAlreadyExists) {
      sweetAlertError(
        "The chosen name is already in use, pick another please."
      );
      return;
    }

    self.Current_LifeCounter_Player.PlayerName = newName;

    if (self.IsUserLoggedIn === true) {
      const formData = new FormData();

      formData.append("LifeCounterPlayerId", player.PlayerId);
      formData.append("PlayerNewName", newName);

      $.ajax({
        type: "POST",
        url: "https://localhost:7081/users/changeplayername",
        data: formData,
        processData: false,
        contentType: false,
        xhrFields: {
          withCredentials: true, // Only if you're using cookies; otherwise can be removed
        },
        success: (resp) => {
          if (resp.content === null) {
            sweetAlertError(resp.message);
            return;
          }
          self.RedirectToLifeCounterManager(
            self.Current_LifeCounter_Manager.LifeCounterManagerId
          );
        },
        error: (err) => {
          sweetAlertError(err);
        },
        complete: () => {
          confirmBtn.attr("disabled", false).text(originalBtnText);
        },
      });

      return;
    }

    self.SetLifeCounterTemplates();

    self.RedirectToLifeCounterManager(
      self.Current_LifeCounter_Manager.LifeCounterManagerId
    );

    confirmBtn.text("originalBtnText");
  };
  self.SetAsFirstPlayer = () => {
    const manager = self.Current_LifeCounter_Manager;
    const players = self.Current_LifeCounter_Players;
    const index = players.findIndex(
      (player) => player.PlayerId == self.Current_LifeCounter_Player.PlayerId
    );
    manager.FirstPlayerIndex = index;

    self.SetLifeCounterTemplates();

    self.RedirectToLifeCounterManager(manager.LifeCounterManagerId);
  };
  self.DeletePlayer = () => {
    const players = self.Current_LifeCounter_Players;
    players.splice(self.LifeCounterPlayerId, 1);

    const player = self.Current_LifeCounter_Player;

    const manager = self.Current_LifeCounter_Manager;
    manager.PlayersCount--;

    if (self.IsUserLoggedIn === true) {
      const formData = new FormData();
      formData.append("LifeCounterPlayerId", player.PlayerId);

      $.ajax({
        type: "DELETE",
        url: `https://localhost:7081/users/DeleteLifeCounterPlayer?LifeCounterPlayerId=${self.LifeCounterPlayerId}`,
        data: formData,
        processData: false,
        contentType: false,
        xhrFields: {
          withCredentials: true, // Only if you're using cookies; otherwise can be removed
        },
        success: (resp) => {
          if (resp.content === null) {
            sweetAlertError(resp.message);
            return;
          }
          self.RedirectToLifeCounterManager(manager.LifeCounterManagerId);
        },
        error: (err) => {
          sweetAlertError(err);
        },
      });

      return;
    }

    self.SetLifeCounterTemplates();

    self.RedirectToLifeCounterManager(manager.LifeCounterManagerId);
  };

  self.Build = () => {
    self.GetLifeCounterPlayerId();

    self.LoadReferences();

    self.GetLifeCounterDetails();

    self.LoadEvents();
  };

  self.CheckAuthenticationStatus();
}

$(function () {
  new life_counter_player_edit();
});
