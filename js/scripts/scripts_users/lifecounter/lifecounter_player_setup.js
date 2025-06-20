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

        self.GetPlayersCount();
      },
      error: function (xhr, status, error) {
        sweetAlertError("Could not load life counter");
      },
    });
  };

  self.GetPlayersCount = () => {
    // Fetch Players based on provided LifeCounterManagerId
    $.ajax({
      type: "GET",
      url: `https://localhost:7081/users/getplayerscount?LifeCounterManagerId=${self.LifeCounterManagerId}`,
      xhrFields: { withCredentials: true },
      success: function (response) {
        if (!response.content) {
          sweetAlertError(response.message_text);
          return;
        }

        self.PlayersCount = response.content.playersCount;

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
      "/html/pages_users/lifecounter/lifecounter_manager.html";
  };

  self.RedirectToLifeCounterManager = (lifeCounterManagerId) => {
    window.location.href = `${
      self.Locations.LifeCounterManager
    }?LifeCounterManagerId=${encodeURIComponent(lifeCounterManagerId)}`;
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

      self.RedirectToLifeCounterManager(self.LifeCounterManagerId);
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

    const formData = new FormData();
    formData.append("LifeCounterPlayerId", self.LifeCounterPlayerId);
    formData.append("PlayerNewName", self.Inputs.LifeCounterPlayerName.val());

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
        self.RedirectToLifeCounterManager(self.LifeCounterManagerId);
      },
      error: (err) => {
        sweetAlertError(err);
      },
      complete: () => {
        confirmBtn.attr("disabled", false).text(originalBtnText);
      },
    });
  };
  self.DeletePlayer = () => {
    const formData = new FormData();
    formData.append("LifeCounterPlayerId", self.LifeCounterPlayerId);

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
        self.RedirectToLifeCounterManager(self.LifeCounterManagerId);
      },
      error: (err) => {
        sweetAlertError(err);
      },
      complete: () => {},
    });
  };

  self.Build = () => {
    self.LoadReferences();
    self.GetLifeCounterPlayerId();
    self.GetLifeCounterPlayerDetails();
    self.LoadEvents();
  };

  self.Build();
}

$(function () {
  new life_counter_player_setup();
});
