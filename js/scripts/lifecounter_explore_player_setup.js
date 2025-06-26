function life_explore_counter_player_setup() {
  let self = this;

  let lifeCounter = null;
  let players = null;

  self.FetchLifeCounterLocalStorageData = () => {
    lifeCounter = JSON.parse(localStorage.getItem("LifeCounter"));
    players = JSON.parse(localStorage.getItem("LifeCounterPlayers"));
  };

  // LIFE COUNTER
  self.LifeCounterId = 999;
  self.PlayersCount = null;
  self.FixedMaxLifeMode = null;
  self.MaxLifePoints = null;
  self.AutoDefeatMode = null;

  // LIFE COUNTER PLAYERS
  self.LifeCounterPlayerId = null;
  self.LifeCounterPlayerName = null;
  self.StartingLifePoints = null;
  self.CurrentLifePoints = null;

  self.GetLifeCounterDetails = () => {
    if (!lifeCounter) {
      sweetAlertError(
        "Failed to retrieve life counter data from local storage"
      );
      return;
    }

    self.PlayersCount = lifeCounter.PlayersCount;
    self.StartingLifePoints = lifeCounter.PlayerStartingLifePoints;
    self.FixedMaxLifeMode = lifeCounter.FixedMaxLifePointsMode;
    self.MaxLifePoints = lifeCounter.PlayersMaxLifePoints;
    self.AutoDefeatMode = lifeCounter.AutoDefeatMode;
  };

  self.GetLifeCounterPlayerId = () => {
    self.LifeCounterPlayerId = new URLSearchParams(window.location.search).get(
      "PlayerId"
    );
  };

  self.GetLifeCounterPlayerDetails = () => {
    if (!players) {
      sweetAlertError("Failed to retrieve players data from local storage");
      return;
    }

    let lifeCounterPlayer = players[self.LifeCounterPlayerId];

    self.LifeCounterPlayerName = lifeCounterPlayer.PlayerName;
    self.CurrentLifePoints = lifeCounterPlayer.CurrentLifePoints;
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
    self.Locations[self.Locations.length] = self.Locations.LifeCounter =
      "/html/lifecounter_explore.html";
  };

  self.RedirectToLifeCounter = (lifeCounterId) => {
    window.location.href = `${
      self.Locations.LifeCounter
    }?LifeCounterId=${encodeURIComponent(self.LifeCounterId)}`;
  };

  self.PreFillForm = () => {
    self.Inputs.LifeCounterPlayerName.val(self.LifeCounterPlayerName)
      .trigger("focus")
      .trigger("select");

    self.Fields.PlayerStartingLifePoints.html(self.StartingLifePoints);
    self.Fields.PlayerCurrentLifePoints.html(self.CurrentLifePoints);

    if (self.FixedMaxLifeMode == true) {
      self.Fields.FixedMaxLifePointsModeOff.addClass("d-none");
      self.Fields.FixedMaxLifePointsModeOn.removeClass("d-none");
    }

    if (self.FixedMaxLifeMode == true) {
      self.Fields.FixedMaxLifePointsModeOff.addClass("d-none");
      self.Fields.FixedMaxLifePointsModeOn.removeClass("d-none");

      self.Fields.MaxLifePointsInputWrapper.removeClass("d-none");
      self.Fields.PlayerMaxLifePoints.html(self.MaxLifePoints);
    } else {
      self.Fields.PlayerMaxLifePoints.html("-");
      self.Fields.MaxLifePointsInputWrapper.addClass("d-none");
      self.Fields.FixedMaxLifePointsModeOn.addClass("d-none");

      self.Fields.FixedMaxLifePointsModeOff.removeClass("d-none");
    }

    if (self.AutoDefeatMode == true) {
      self.Fields.AutoDefeatModeOff.addClass("d-none");
      self.Fields.AutoDefeatModeOn.removeClass("d-none");
    } else {
      self.Fields.AutoDefeatModeOn.addClass("d-none");
      self.Fields.AutoDefeatModeOff.removeClass("d-none");
    }

    if (self.PlayersCount <= 1) {
      self.Buttons.DeletePlayer.attr("disabled", true).css(
        "pointer-events",
        "none"
      );
    }

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

      self.RedirectToLifeCounter(self.LifeCounterId);
    });

    self.Buttons.ChangeName.on("click", function (e) {
      e.preventDefault();

      self.LifeCounterPlayerName =
        self.Inputs.LifeCounterPlayerName.val().trim();

      if (
        !self.LifeCounterPlayerName ||
        self.LifeCounterPlayerName ==
          players[self.LifeCounterPlayerId].PlayerName
      ) {
        self.RedirectToLifeCounter();
        return;
      }

      const newName = self.LifeCounterPlayerName.toLowerCase();

      const nameAlreadyExists = players.some(
        (player) => player.PlayerName.toLowerCase().trim() === newName
      );

      if (nameAlreadyExists) {
        sweetAlertError(
          "The chosen name is already in use, pick another please."
        );
        return;
      }

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

    players[self.LifeCounterPlayerId].PlayerName = self.LifeCounterPlayerName;

    localStorage.setItem("LifeCounterPlayers", JSON.stringify(players));

    self.RedirectToLifeCounter(self.LifeCounterId);

    confirmBtn.text("originalBtnText");
  };
  self.DeletePlayer = () => {
    players.splice(self.LifeCounterPlayerId, 1);

    localStorage.setItem("LifeCounterPlayers", JSON.stringify(players));

    lifeCounter.PlayersCount--;

    localStorage.setItem("LifeCounter", JSON.stringify(lifeCounter));

    self.RedirectToLifeCounter(self.LifeCounterId);
  };

  self.Build = () => {
    self.FetchLifeCounterLocalStorageData();

    self.LoadReferences();
    self.GetLifeCounterDetails();
    self.GetLifeCounterPlayerId();
    self.GetLifeCounterPlayerDetails();
    self.PreFillForm();
    self.LoadEvents();
  };

  self.Build();
}

$(function () {
  new life_explore_counter_player_setup();
});
