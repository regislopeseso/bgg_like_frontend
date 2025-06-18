function life_counter_manager() {
  let self = this;

  self.LifeCounterTemplateId = null;

  self.LifeCounterManagerId = null;
  self.LifeCounterManagerName = null;

  self.PlayersCount = null;

  self.LifeCounterPlayers = [];

  self.PlayersStartingLifePoints = null;
  self.FixedMaxLifePointsMode = null;
  self.PlayersMaxLifePoints = null;
  self.AutoDefeatMode = null;
  self.AutoEndMode = null;
  self.IsFinished = null;

  self.previousPlayerIndexes = [];
  self.increasingPointsCounter = 0;
  self.decreasingPointsCounter = 0;

  self.GetLifeCounterManagerId = () => {
    self.LifeCounterManagerId = new URLSearchParams(window.location.search).get(
      "id"
    );
  };

  self.QuickStartLifeCounter = () => {
    $.ajax({
      type: "POST",
      url: `https://localhost:7081/users/quickstartlifecounter`,
      xhrFields: { withCredentials: true },
      success: function (response) {
        if (response.content != null) {
          self.LifeCounterManagerId = response.content.lifeCounterManagerId;

          sweetAlertSuccess(
            response.message,
            "Life Counter Manager Id: " + self.LifeCounterManagerId
          );

          if (self.LifeCounterManagerId != null) {
            self.GetLifeCounterManagerDetails();
          }
        } else {
          sweetAlertError(response.message);
        }
      },
      error: function (xhr, status, error) {
        sweetAlertError(
          "Failed to fetch requested LIFE COUNTER MANAGER DETAILS."
        );
      },
    });
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

        self.IsFinished = lifeCounterManagerDB.isFinished;

        self.BuildLifeCounter();
      },
      error: function (xhr, status, error) {
        sweetAlertError("Could not load life counter");
      },
    });
  };

  self.LoadReferences = () => {
    self.DOM = $("#main-lifeCounter-manager");

    self.LifeCountersField = self.DOM.find("#section-lifeCounter-manager");

    self.LifeCountersOrganizer = self.DOM.find(
      "#organizer-lifeCounter-manager"
    );

    self.PlayerBlocks = [];
    self.PlayerBlocks[self.PlayerBlocks.length] = self.PlayerBlocks.First =
      self.DOM.find(".player-block").eq(0);
    self.PlayerBlocks[self.PlayerBlocks.length] = self.PlayerBlocks.Second =
      self.DOM.find(".player-block").eq(1);
    self.PlayerBlocks[self.PlayerBlocks.length] = self.PlayerBlocks.Third =
      self.DOM.find(".player-block").eq(2);
    self.PlayerBlocks[self.PlayerBlocks.length] = self.PlayerBlocks.Fourth =
      self.DOM.find(".player-block").eq(3);
    self.PlayerBlocks[self.PlayerBlocks.length] = self.PlayerBlocks.Fifth =
      self.DOM.find(".player-block").eq(4);
    self.PlayerBlocks[self.PlayerBlocks.length] = self.PlayerBlocks.Sixth =
      self.DOM.find(".player-block").eq(5);

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.RefreshLifeCounterManager =
      self.DOM.find("#button-refresh-lifeCounter-manager");
    self.Buttons[self.Buttons.length] = self.Buttons.SetUpLifeCounterManager =
      self.DOM.find("#button-setUp-lifeCounter-manager");
    self.Buttons[self.Buttons.length] = self.Buttons.CloseLifeCounterManager =
      self.DOM.find("#button-close-lifeCounter-manager");
    self.Buttons[self.Buttons.length] = self.Buttons.PlayerSetUp =
      self.DOM.find(".player-setup");
    self.Buttons[self.Buttons.length] = self.Buttons.IncreaseLifePoints =
      self.DOM.find(".increase-life-points");
    self.Buttons[self.Buttons.length] = self.Buttons.DecreaseLifePoints =
      self.DOM.find(".decrease-life-points");

    self.Fields = [];
    self.Fields[self.Fields.length] = self.Fields.LifeCounterManagerName =
      self.DOM.find("#name-lifeCounter-manager");
    self.Fields[self.Fields.length] = self.Fields.PlayerName =
      self.DOM.find(".player-title");
    self.Fields[self.Fields.length] = self.Fields.PlayerCurrentLifePoints =
      self.DOM.find(".player-lifepoints");
    self.Fields[self.Fields.length] = self.Fields.LifePointsDynamicBehavior =
      self.DOM.find(".dynamic-behavior");

    self.LifeCounterInstances = [];
    self.LifeCounterInstances[self.LifeCounterInstances.length] =
      self.LifeCounterInstances.Player1 = self.DOM.find("#lifecounter1");
    self.LifeCounterInstances[self.LifeCounterInstances.length] =
      self.LifeCounterInstances.Player2 = self.DOM.find("#lifecounter2");
    self.LifeCounterInstances[self.LifeCounterInstances.length] =
      self.LifeCounterInstances.Player3 = self.DOM.find("#lifecounter3");
    self.LifeCounterInstances[self.LifeCounterInstances.length] =
      self.LifeCounterInstances.Player4 = self.DOM.find("#lifecounter4");
    self.LifeCounterInstances[self.LifeCounterInstances.length] =
      self.LifeCounterInstances.Player5 = self.DOM.find("#lifecounter5");
    self.LifeCounterInstances[self.LifeCounterInstances.length] =
      self.LifeCounterInstances.Player6 = self.DOM.find("#lifecounter6");

    self.Locations = [];
    self.Locations[self.Locations.length] = self.Locations.UsersPage =
      "/html/pages_users/users_page.html";
    self.Locations[self.Locations.length] =
      self.Locations.SetUpLifeCounterManager =
        "/html/pages_users/lifecounter/lifecounter_manager_setup.html";
    self.Locations[self.Locations.length] =
      self.Locations.SetUpLifeCounterPlayer =
        "/html/pages_users/lifecounter/lifecounter_player_setup.html";
  };
  self.RedirectToUsersPage = () => {
    window.location.href = self.Locations.UsersPage;
  };
  self.RedirectToLifeCounterManagerSetUp = (lifeCounterId) => {
    window.location.href = `${
      self.Locations.SetUpLifeCounterManager
    }?id=${encodeURIComponent(lifeCounterId)}`;
  };
  self.RedirectToLifeCounterPlayerSetUp = (lifeCounterId) => {
    window.location.href = `${
      self.Locations.SetUpLifeCounterPlayer
    }?PlayerId=${encodeURIComponent(lifeCounterId)}`;
  };

  function sweetAlertSuccess(title_text, message_text) {
    Swal.fire({
      position: "center",
      cancelButtonText: "close",
      icon: "success",
      theme: "bulma",
      title: title_text,
      text: message_text || "",
      showConfirmButton: true,
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
    self.Buttons.RefreshLifeCounterManager.on("click", function (e) {
      e.preventDefault();

      self.RefreshLifeCounterManager(() => {
        for (let i = 0; i < self.LifeCounterPlayers.length; i++) {
          let playerLifepoints =
            self.LifeCounterPlayers[i].playerCurrentLifePoints;

          // Make sure the player block exists before trying to update it
          if (self.PlayerBlocks[i]) {
            self.PlayerBlocks[i]
              .find(".player-lifepoints")
              .text(playerLifepoints);
          }
        }
      });
    });

    self.Buttons.SetUpLifeCounterManager.on("click", function (e) {
      e.preventDefault();

      self.RedirectToLifeCounterManagerSetUp(self.LifeCounterManagerId);
    });

    self.Buttons.CloseLifeCounterManager.on("click", function (e) {
      e.preventDefault();
      self.RedirectToUsersPage();
    });

    self.Buttons.PlayerSetUp.on("click", function (e) {
      e.preventDefault();
      // Get the parent .player-block div
      const playerBlock = $(this).closest(".player-block");
      // Optional: Get the block's index among visible players (e.g., 0 to 5)
      const playerIndex = $(".player-block:visible").index(playerBlock);

      const player = self.LifeCounterPlayers[playerIndex];

      // Optional: Get player current life from DOM if needed
      const playerId = player.playerId;

      console.log("playerId: ", playerId);

      self.RedirectToLifeCounterPlayerSetUp(playerId);
    });

    self.Buttons.IncreaseLifePoints.on("mousedown touchstart", function (e) {
      e.preventDefault();

      // Get the parent .player-block div
      const playerBlock = $(this).closest(".player-block");
      // Optional: Get the block's index among visible players (e.g., 0 to 5)
      const playerIndex = $(".player-block:visible").index(playerBlock);

      const player = self.LifeCounterPlayers[playerIndex];

      // Optional: Get player current life from DOM if needed
      const playerNameElement = playerBlock.find(".player-title");
      const playerName = playerNameElement.text().trim();

      const playerCurrentLifeElement = playerBlock.find(".player-lifepoints");
      const currentLife = parseInt(playerCurrentLifeElement.text().trim(), 10);

      const dynamicLifePoints = playerBlock.find(".dynamic-behavior");

      let holdTimer;
      let intervalId;
      let isHeld = false;

      let isMaxLifePointsReached =
        self.FixedMaxLifePointsMode && currentLife >= self.PlayersMaxLifePoints;

      const increaseLife = (amount) => {
        if (isMaxLifePointsReached == false) {
          self.IncreaseLifePoints(playerIndex, amount);
        }
      };

      // Start a timer: if held > 500ms, start continuous +10
      holdTimer = setTimeout(() => {
        isHeld = true;
        increaseLife(10); // first +10

        intervalId = setInterval(() => {
          increaseLife(10);
        }, 1000); // then every 1s
      }, 500);

      const stopIncreasing = () => {
        clearTimeout(holdTimer);
        clearInterval(intervalId);

        if (!isHeld) {
          // Short press, so just +1
          increaseLife(1);
        }

        isHeld = false;
        $(document).off("mouseup touchend", stopIncreasing);
      };

      $(document).on("mouseup touchend", stopIncreasing);
    });

    self.Buttons.DecreaseLifePoints.on("mousedown touchstart", function (e) {
      e.preventDefault();

      // Get the parent .player-block div
      const playerBlock = $(this).closest(".player-block");
      // Optional: Get the block's index among visible players (e.g., 0 to 5)
      const playerIndex = $(".player-block:visible").index(playerBlock);

      const player = self.LifeCounterPlayers[playerIndex];
      // Optional: Get player name or current life from DOM if needed
      const playerNameElement = playerBlock.find(".player-title");
      const playerName = playerNameElement.text().trim();
      const playerCurrentLifeElement = playerBlock.find(".player-lifepoints");
      const currentLife = parseInt(playerCurrentLifeElement.text().trim(), 10);

      let holdTimer;
      let intervalId;
      let isHeld = false;

      const decreaseLife = (amount) => {
        self.DecreaseLifePoints(playerIndex, amount);
      };

      // Start a timer: if held > 500ms, start continuous -10
      holdTimer = setTimeout(() => {
        isHeld = true;
        decreaseLife(10); // first -10
        intervalId = setInterval(() => decreaseLife(10), 1000); // then every 1s
      }, 500);

      const stopDecreasing = () => {
        clearTimeout(holdTimer);
        clearInterval(intervalId);

        if (!isHeld) {
          // Short press, so just +1
          decreaseLife(1);
        }

        isHeld = false;
        $(document).off("mouseup touchend", stopDecreasing);
      };

      $(document).on("mouseup touchend", stopDecreasing);
    });

    closeOnAnyKey();
  };

  self.OrganizeLifeCounters = (lifeCountersCount) => {
    function ShowOneLifeCounter() {
      if (self.LifeCounterInstances[0].hasClass("d-none")) {
        self.LifeCounterInstances[0].removeClass("d-none");
      }
      for (let i = 1; i < self.LifeCounterInstances.length; i++) {
        self.LifeCounterInstances[i].addClass("d-none");
      }

      self.LifeCountersOrganizer.css({
        "grid-template-columns": "repeat(1, 1fr)",
        "grid-template-rows": "repeat(1, 1fr)",
      });

      self.PlayerBlocks.First.css({
        "grid-column-start": "1",
        "grid-column-end": "2",

        "grid-row-start": "1",
        "grid-row-end": "2",
      });

      self.PlayerBlocks.First.find(self.Buttons.IncreaseLifePoints).addClass(
        "increasePointsFlexRow"
      );
      self.PlayerBlocks.First.find(self.Buttons.DecreaseLifePoints).addClass(
        "decreasePointsFlexRow"
      );
    }

    function ShowTwoLifeCounters() {
      for (let i = 0; i < 2; i++) {
        if (self.LifeCounterInstances[i].hasClass("d-none")) {
          self.LifeCounterInstances[i].removeClass("d-none");
        }
      }
      for (let i = 2; i < self.LifeCounterInstances.length; i++) {
        self.LifeCounterInstances[i].addClass("d-none");
      }

      self.LifeCountersOrganizer.css({
        "grid-template-columns": "repeat(1, 1fr)",
        "grid-template-rows": "repeat(2, 1fr)",
      });

      self.PlayerBlocks.First.css({
        "grid-column-start": "1",
        "grid-column-end": "2",

        "grid-row-start": "2",
        "grid-row-end": "3",
      });
      self.PlayerBlocks.First.find(self.Buttons.IncreaseLifePoints).addClass(
        "increasePointsFlexRow"
      );
      self.PlayerBlocks.First.find(self.Buttons.DecreaseLifePoints).addClass(
        "decreasePointsFlexRow"
      );

      self.PlayerBlocks.Second.css({
        "transform": "rotate(180deg)",

        "grid-column-start": "1",
        "grid-column-end": "2",

        "grid-row-start": "1",
        "grid-row-end": "2",
      });
      self.PlayerBlocks.Second.find(self.Buttons.IncreaseLifePoints).addClass(
        "increasePointsFlexRow"
      );
      self.PlayerBlocks.Second.find(self.Buttons.DecreaseLifePoints).addClass(
        "decreasePointsFlexRow"
      );
    }

    function ShowThreeLifeCounters() {
      for (let i = 0; i < 3; i++) {
        if (self.LifeCounterInstances[i].hasClass("d-none")) {
          self.LifeCounterInstances[i].removeClass("d-none");
        }
      }
      for (let i = 3; i < self.LifeCounterInstances.length; i++) {
        self.LifeCounterInstances[i].addClass("d-none");
      }

      self.LifeCountersOrganizer.css({
        "grid-template-columns": "repeat(2, 1fr)",
        "grid-template-rows": "repeat(2, 1fr)",
      });

      self.PlayerBlocks.First.css({
        "grid-column-start": "1",
        "grid-column-end": "3",

        "grid-row-start": "2",
        "grid-row-end": "3",
      });
      self.PlayerBlocks.First.find(self.Buttons.IncreaseLifePoints).addClass(
        "increasePointsFlexRow"
      );
      self.PlayerBlocks.First.find(self.Buttons.DecreaseLifePoints).addClass(
        "decreasePointsFlexRow"
      );

      self.PlayerBlocks.Second.css({
        "display": "flex",
        "flex-direction": "column",

        "grid-column-start": "1",
        "grid-column-end": "2",

        "grid-row-start": "1",
        "grid-row-end": "2",
      });
      self.PlayerBlocks.Second.find(self.Buttons.IncreaseLifePoints).addClass(
        "increasePointsFlexColumn"
      );
      self.PlayerBlocks.Second.find(self.Buttons.DecreaseLifePoints).addClass(
        "decreasePointsFlexColumn"
      );
      self.PlayerBlocks.Second.find("button .bi-dash-lg").addClass("rotate-i");

      self.PlayerBlocks.Second.find(".playerstats").addClass(
        "rotate-text-clockWise"
      );

      self.PlayerBlocks.Third.css({
        "display": "flex",
        "flex-direction": "column",

        "grid-column-start": "2",
        "grid-column-end": "3",

        "grid-row-start": "1",
        "grid-row-end": "2",
      });
      self.PlayerBlocks.Third.find(self.Buttons.IncreaseLifePoints).addClass(
        "increasePointsFlexColumn"
      );
      self.PlayerBlocks.Third.find(self.Buttons.DecreaseLifePoints).addClass(
        "decreasePointsFlexColumn"
      );
      self.PlayerBlocks.Third.find("button .bi-dash-lg").addClass("rotate-i");

      self.PlayerBlocks.Third.find(".playerstats").addClass(
        "rotate-text-antiClockWise"
      );
    }

    function ShowFourLifeCounters() {
      for (let i = 0; i < 4; i++) {
        if (self.LifeCounterInstances[i].hasClass("d-none")) {
          self.LifeCounterInstances[i].removeClass("d-none");
        }
      }
      for (let i = 4; i < self.LifeCounterInstances.length; i++) {
        self.LifeCounterInstances[i].addClass("d-none");
      }

      self.LifeCountersOrganizer.css({
        "grid-template-columns": "repeat(2, 1fr)",
        "grid-template-rows": "repeat(2, 1fr)",
      });

      self.PlayerBlocks.First.css({
        "display": "flex",
        "flex-direction": "column",

        "grid-column-start": "1",
        "grid-column-end": "2",

        "grid-row-start": "2",
        "grid-row-end": "3",
      });
      self.PlayerBlocks.First.find(self.Buttons.IncreaseLifePoints).addClass(
        "increasePointsFlexColumn"
      );
      self.PlayerBlocks.First.find(self.Buttons.DecreaseLifePoints).addClass(
        "decreasePointsFlexColumn"
      );
      self.PlayerBlocks.First.find("button .bi-dash-lg").addClass("rotate-i");

      self.PlayerBlocks.First.find(".playerstats").addClass(
        "rotate-text-clockWise"
      );

      self.PlayerBlocks.Second.css({
        "display": "flex",
        "flex-direction": "column",

        "grid-column-start": "1",
        "grid-column-end": "2",

        "grid-row-start": "1",
        "grid-row-end": "2",
      });
      self.PlayerBlocks.Second.find(self.Buttons.IncreaseLifePoints).addClass(
        "increasePointsFlexColumn"
      );
      self.PlayerBlocks.Second.find(self.Buttons.DecreaseLifePoints).addClass(
        "decreasePointsFlexColumn"
      );
      self.PlayerBlocks.Second.find("button .bi-dash-lg").addClass("rotate-i");

      self.PlayerBlocks.Second.find(".playerstats").addClass(
        "rotate-text-clockWise"
      );

      self.PlayerBlocks.Third.css({
        "display": "flex",
        "flex-direction": "column",

        "grid-column-start": "2",
        "grid-column-end": "3",

        "grid-row-start": "1",
        "grid-row-end": "2",
      });
      self.PlayerBlocks.Third.find(self.Buttons.IncreaseLifePoints).addClass(
        "increasePointsFlexColumn"
      );
      self.PlayerBlocks.Third.find(self.Buttons.DecreaseLifePoints).addClass(
        "decreasePointsFlexColumn"
      );
      self.PlayerBlocks.Third.find("button .bi-dash-lg").addClass("rotate-i");

      self.PlayerBlocks.Third.find(".playerstats").addClass(
        "rotate-text-antiClockWise"
      );

      self.PlayerBlocks.Fourth.css({
        "display": "flex",
        "flex-direction": "column",

        "grid-column-start": "2",
        "grid-column-end": "3",

        "grid-row-start": "2",
        "grid-row-end": "3",
      });
      self.PlayerBlocks.Fourth.find(self.Buttons.IncreaseLifePoints).addClass(
        "increasePointsFlexColumn"
      );
      self.PlayerBlocks.Fourth.find(self.Buttons.DecreaseLifePoints).addClass(
        "decreasePointsFlexColumn"
      );
      self.PlayerBlocks.Fourth.find("button .bi-dash-lg").addClass("rotate-i");

      self.PlayerBlocks.Fourth.find(".playerstats").addClass(
        "rotate-text-antiClockWise"
      );
    }

    function ShowFiveLifeCounters() {
      for (let i = 0; i < 5; i++) {
        if (self.LifeCounterInstances[i].hasClass("d-none")) {
          self.LifeCounterInstances[i].removeClass("d-none");
        }
      }
      for (let i = 5; i < self.LifeCounterInstances.length; i++) {
        self.LifeCounterInstances[i].addClass("d-none");
      }

      self.LifeCountersOrganizer.css({
        "grid-template-columns": "repeat(2, 1fr)",
        "grid-template-rows": "repeat(3, 1fr)",
      });

      self.PlayerBlocks.First.css({
        "grid-column-start": "1",
        "grid-column-end": "3",

        "grid-row-start": "3",
        "grid-row-end": "4",
      });
      self.PlayerBlocks.First.find(self.Buttons.IncreaseLifePoints).addClass(
        "increasePointsFlexRow"
      );
      self.PlayerBlocks.First.find(self.Buttons.DecreaseLifePoints).addClass(
        "decreasePointsFlexRow"
      );

      self.PlayerBlocks.Second.css({
        "display": "flex",
        "flex-direction": "column",

        "grid-column-start": "1",
        "grid-column-end": "2",

        "grid-row-start": "2",
        "grid-row-end": "3",
      });
      self.PlayerBlocks.Second.find(self.Buttons.IncreaseLifePoints).addClass(
        "increasePointsFlexColumn"
      );
      self.PlayerBlocks.Second.find(self.Buttons.DecreaseLifePoints).addClass(
        "decreasePointsFlexColumn"
      );
      self.PlayerBlocks.Second.find("button .bi-dash-lg").addClass("rotate-i");

      self.PlayerBlocks.Second.find(".playerstats").addClass(
        "rotate-text-clockWise"
      );

      self.PlayerBlocks.Third.css({
        "display": "flex",
        "flex-direction": "column",

        "grid-column-start": "1",
        "grid-column-end": "2",

        "grid-row-start": "1",
        "grid-row-end": "2",
      });
      self.PlayerBlocks.Third.find(self.Buttons.IncreaseLifePoints).addClass(
        "increasePointsFlexColumn"
      );
      self.PlayerBlocks.Third.find(self.Buttons.DecreaseLifePoints).addClass(
        "decreasePointsFlexColumn"
      );
      self.PlayerBlocks.Third.find("button .bi-dash-lg").addClass("rotate-i");

      self.PlayerBlocks.Third.find(".playerstats").addClass(
        "rotate-text-clockWise"
      );

      self.PlayerBlocks.Fourth.css({
        "display": "flex",
        "flex-direction": "column",

        "grid-column-start": "2",
        "grid-column-end": "3",

        "grid-row-start": "1",
        "grid-row-end": "2",
      });
      self.PlayerBlocks.Fourth.find(self.Buttons.IncreaseLifePoints).addClass(
        "increasePointsFlexColumn"
      );
      self.PlayerBlocks.Fourth.find(self.Buttons.DecreaseLifePoints).addClass(
        "decreasePointsFlexColumn"
      );
      self.PlayerBlocks.Fourth.find("button .bi-dash-lg").addClass("rotate-i");

      self.PlayerBlocks.Fourth.find(".playerstats").addClass(
        "rotate-text-antiClockWise"
      );

      self.PlayerBlocks.Fifth.css({
        "display": "flex",
        "flex-direction": "column",

        "grid-column-start": "2",
        "grid-column-end": "3",

        "grid-row-start": "2",
        "grid-row-end": "3",
      });
      self.PlayerBlocks.Fifth.find(self.Buttons.IncreaseLifePoints).addClass(
        "increasePointsFlexColumn"
      );
      self.PlayerBlocks.Fifth.find(self.Buttons.DecreaseLifePoints).addClass(
        "decreasePointsFlexColumn"
      );
      self.PlayerBlocks.Fifth.find("button .bi-dash-lg").addClass("rotate-i");

      self.PlayerBlocks.Fifth.find(".playerstats").addClass(
        "rotate-text-antiClockWise"
      );
    }

    function ShowSixLifeCounters() {
      for (let i = 0; i < self.LifeCounterInstances.length; i++) {
        if (self.LifeCounterInstances[i].hasClass("d-none")) {
          self.LifeCounterInstances[i].removeClass("d-none");
        }
      }

      self.LifeCountersOrganizer.css({
        "grid-template-columns": "repeat(2, 1fr)",
        "grid-template-rows": "repeat(3, 1fr)",
      });

      self.PlayerBlocks.First.css({
        "display": "flex",
        "flex-direction": "column",

        "grid-column-start": "1",
        "grid-column-end": "2",

        "grid-row-start": "3",
        "grid-row-end": "4",
      });
      self.PlayerBlocks.First.find(self.Buttons.IncreaseLifePoints).addClass(
        "increasePointsFlexColumn"
      );
      self.PlayerBlocks.First.find(self.Buttons.DecreaseLifePoints).addClass(
        "decreasePointsFlexColumn"
      );
      self.PlayerBlocks.First.find("button .bi-dash-lg").addClass("rotate-i");
      self.PlayerBlocks.First.find(".playerstats").addClass(
        "rotate-text-clockWise"
      );

      self.PlayerBlocks.Second.css({
        "display": "flex",
        "flex-direction": "column",

        "grid-column-start": "1",
        "grid-column-end": "2",

        "grid-row-start": "2",
        "grid-row-end": "3",
      });
      self.PlayerBlocks.Second.find(self.Buttons.IncreaseLifePoints).addClass(
        "increasePointsFlexColumn"
      );
      self.PlayerBlocks.Second.find(self.Buttons.DecreaseLifePoints).addClass(
        "decreasePointsFlexColumn"
      );
      self.PlayerBlocks.Second.find("button .bi-dash-lg").addClass("rotate-i");
      self.PlayerBlocks.Second.find(".playerstats").addClass(
        "rotate-text-clockWise"
      );

      self.PlayerBlocks.Third.css({
        "display": "flex",
        "flex-direction": "column",

        "grid-column-start": "1",
        "grid-column-end": "2",

        "grid-row-start": "1",
        "grid-row-end": "2",
      });
      self.PlayerBlocks.Third.find(self.Buttons.IncreaseLifePoints).addClass(
        "increasePointsFlexColumn"
      );
      self.PlayerBlocks.Third.find(self.Buttons.DecreaseLifePoints).addClass(
        "decreasePointsFlexColumn"
      );
      self.PlayerBlocks.Third.find("button .bi-dash-lg").addClass("rotate-i");

      self.PlayerBlocks.Third.find(".playerstats").addClass(
        "rotate-text-clockWise"
      );

      self.PlayerBlocks.Fourth.css({
        "display": "flex",
        "flex-direction": "column",

        "grid-column-start": "2",
        "grid-column-end": "3",

        "grid-row-start": "1",
        "grid-row-end": "2",
      });
      self.PlayerBlocks.Fourth.find(self.Buttons.IncreaseLifePoints).addClass(
        "increasePointsFlexColumn"
      );
      self.PlayerBlocks.Fourth.find(self.Buttons.DecreaseLifePoints).addClass(
        "decreasePointsFlexColumn"
      );
      self.PlayerBlocks.Fourth.find("button .bi-dash-lg").addClass("rotate-i");

      self.PlayerBlocks.Fourth.find(".playerstats").addClass(
        "rotate-text-antiClockWise"
      );

      self.PlayerBlocks.Fifth.css({
        "display": "flex",
        "flex-direction": "column",

        "grid-column-start": "2",
        "grid-column-end": "3",

        "grid-row-start": "2",
        "grid-row-end": "3",
      });
      self.PlayerBlocks.Fifth.find(self.Buttons.IncreaseLifePoints).addClass(
        "increasePointsFlexColumn"
      );
      self.PlayerBlocks.Fifth.find(self.Buttons.DecreaseLifePoints).addClass(
        "decreasePointsFlexColumn"
      );
      self.PlayerBlocks.Fifth.find("button .bi-dash-lg").addClass("rotate-i");

      self.PlayerBlocks.Fifth.find(".playerstats").addClass(
        "rotate-text-antiClockWise"
      );

      self.PlayerBlocks.Sixth.css({
        "display": "flex",
        "flex-direction": "column",

        "grid-column-start": "2",
        "grid-column-end": "3",

        "grid-row-start": "3",
        "grid-row-end": "4",
      });
      self.PlayerBlocks.Sixth.find(self.Buttons.IncreaseLifePoints).addClass(
        "increasePointsFlexColumn"
      );
      self.PlayerBlocks.Sixth.find(self.Buttons.DecreaseLifePoints).addClass(
        "decreasePointsFlexColumn"
      );
      self.PlayerBlocks.Sixth.find("button .bi-dash-lg").addClass("rotate-i");

      self.PlayerBlocks.Sixth.find(".playerstats").addClass(
        "rotate-text-antiClockWise"
      );
    }

    switch (lifeCountersCount) {
      case 1:
        return ShowOneLifeCounter();
      case 2:
        return ShowTwoLifeCounters();
      case 3:
        return ShowThreeLifeCounters();
      case 4:
        return ShowFourLifeCounters();
      case 5:
        return ShowFiveLifeCounters();
      case 6:
        return ShowSixLifeCounters();
      default:
        return ShowOneLifeCounter();
    }
  };

  self.BuildLifeCounter = () => {
    self.Fields.LifeCounterManagerName.html(
      `<span>${self.LifeCounterManagerName}</span>`
    );

    for (let i = 0; i < self.PlayersCount; i++) {
      self.LifeCounterInstances[i]
        .find(self.Fields.PlayerName)
        .html(self.LifeCounterPlayers[i].playerName);

      self.LifeCounterInstances[i]
        .find(self.Fields.PlayerCurrentLifePoints)
        .html(`${self.LifeCounterPlayers[i].currentLifePoints}`);

      if (self.AutoDefeatMode == true) {
        self.CheckForPlayerDefeated(
          i,
          self.LifeCounterPlayers[i].currentLifePoints
        );
      }

      // if (self.AutoEndMode == false && self.IsFinished == true) {
      //   self.RefreshLifeCounterManager();
      // }
    }

    self.OrganizeLifeCounters(self.PlayersCount);

    $("body").loadpage("demolish");
  };

  self.IncreaseLifePoints = (playerIndex, amountToIncrease) => {
    // Disable all buttons
    self.Buttons.forEach((btn) => btn.prop("disabled", true));

    self.previousPlayerIndexes.push(playerIndex);
    let arrayLength = self.previousPlayerIndexes.length;
    if (self.previousPlayerIndexes[arrayLength - 2] != playerIndex) {
      self.increasingPointsCounter = 0;
    }

    const dynamicLifePoints = self.PlayerBlocks[playerIndex].find(
      self.Fields.LifePointsDynamicBehavior
    );

    const dynamicText = self.PlayerBlocks[playerIndex]
      .find(".dynamic-behavior")
      .text()
      .trim();

    if (dynamicText) {
      // Remove any non-numeric characters like parentheses
      const cleanText = dynamicText.replace(/[^\d-]/g, "");
      self.increasingPointsCounter = parseInt(cleanText, 10);
    }

    const showIncreasingAmount = (rate) => {
      self.increasingPointsCounter += rate;

      if (self.increasingPointsCounter < 0) {
        dynamicLifePoints.html(
          `&nbsp;&nbsp; <span style="color: var(--reddish);">(${self.increasingPointsCounter})</span>`
        );
      } else if (self.increasingPointsCounter === 0) {
        dynamicLifePoints.html(
          `&nbsp;&nbsp; (${self.increasingPointsCounter})`
        );
      } else {
        dynamicLifePoints.html(
          `&nbsp;&nbsp; <span>(+ ${self.increasingPointsCounter})</span>`
        );
      }

      clearTimeout(self.clearDeltaTimeout);
      self.clearDeltaTimeout = setTimeout(() => {
        self.Fields.LifePointsDynamicBehavior.text("");
        self.increasingPointsCounter = 0;
        self.decreasingPointsCounter = 0;
      }, 3000);
    };

    const player = self.LifeCounterPlayers[playerIndex];

    const formData = new FormData();
    formData.append("LifeCounterPlayerId", player.playerId);
    formData.append("LifePointsToIncrease", amountToIncrease);

    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/increaselifepoints",
      data: formData,
      processData: false,
      contentType: false,
      xhrFields: {
        withCredentials: true, // Only if you're using cookies; otherwise can be removed
      },
      success: (resp) => {
        if (resp.content === null) {
          sweetAlertError(resp.message);
        } else {
          self.PlayerBlocks[playerIndex]
            .find(self.Fields.PlayerCurrentLifePoints)
            .text(resp.content.updatedLifePoints);

          showIncreasingAmount(amountToIncrease);
        }
      },
      error: (err) => {
        sweetAlertError(err);
      },
      complete: () => {
        //Re-enable all buttons
        self.Buttons.forEach((btn) => btn.prop("disabled", false));
      },
    });
  };
  self.DecreaseLifePoints = (playerIndex, amountToDecrease) => {
    // Disable all buttons
    self.Buttons.forEach((btn) => btn.prop("disabled", true));

    self.previousPlayerIndexes.push(playerIndex);
    let arrayLength = self.previousPlayerIndexes.length;
    if (self.previousPlayerIndexes[arrayLength - 2] != playerIndex) {
      self.decreasingPointsCounter = 0;
    }

    const dynamicLifePoints = self.PlayerBlocks[playerIndex].find(
      self.Fields.LifePointsDynamicBehavior
    );

    const dynamicText = self.PlayerBlocks[playerIndex]
      .find(".dynamic-behavior")
      .text()
      .trim();

    if (dynamicText) {
      // Remove any non-numeric characters like parentheses
      const cleanText = dynamicText.replace(/[^\d-]/g, "");
      self.decreasingPointsCounter = parseInt(cleanText, 10);
    }

    const showDecreasingAmount = (rate) => {
      self.decreasingPointsCounter -= rate;

      if (self.decreasingPointsCounter > 0) {
        dynamicLifePoints.html(
          `&nbsp;&nbsp; <span>(+ ${self.decreasingPointsCounter})</span>`
        );
      } else if (self.decreasingPointsCounter == 0) {
        dynamicLifePoints.html(
          `&nbsp;&nbsp; (${self.decreasingPointsCounter})`
        );
      } else {
        dynamicLifePoints.html(
          `&nbsp;&nbsp; <span style="color: var(--reddish);">(${self.decreasingPointsCounter})</span>`
        );
      }

      clearTimeout(self.clearDeltaTimeout);
      self.clearDeltaTimeout = setTimeout(() => {
        self.Fields.LifePointsDynamicBehavior.text("");
        self.increasingPointsCounter = 0;
        self.decreasingPointsCounter = 0;
      }, 3000);
    };

    const player = self.LifeCounterPlayers[playerIndex];

    if (self.AutoDefeatMode == true && player.isDefeated == true) {
      return;
    }

    let updatedLifePoints = null;

    const formData = new FormData();
    formData.append("LifeCounterPlayerId", player.playerId);
    formData.append("LifePointsToDecrease", amountToDecrease);

    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/decreaselifepoints",
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
        updatedLifePoints = resp.content.updatedLifePoints;

        self.PlayerBlocks[playerIndex]
          .find(self.Fields.PlayerCurrentLifePoints)
          .html(updatedLifePoints);

        self.LifeCounterPlayers[playerIndex].currentLifePoints =
          updatedLifePoints;

        if (updatedLifePoints == 0) {
          self.LifeCounterPlayers[playerIndex].isDefeated = true;
        }
        showDecreasingAmount(amountToDecrease);
      },
      error: (err) => {
        sweetAlertError(err);
      },
      complete: () => {
        if (self.AutoDefeatMode == true) {
          self.CheckForPlayerDefeated(playerIndex, updatedLifePoints);
        }
        //Re-enable all buttons
        self.Buttons.forEach((btn) => btn.prop("disabled", false));
      },
    });
  };
  self.CheckForPlayerDefeated = (playerIndex, currentLifePoints) => {
    const playerBlock = self.PlayerBlocks[playerIndex];

    // Get player name or current life from DOM if needed
    const playerName = playerBlock.find(self.Fields.PlayerName);
    const playerCurrentLife = playerBlock.find(
      self.Fields.PlayerCurrentLifePoints
    );

    const markAsDefeated = () => {
      playerName.addClass("markAsLooser");

      playerCurrentLife.addClass("markAsLooser");

      playerCurrentLife.html(`(Defeated)`);

      playerBlock.find("button").prop("disabled", true);
    };

    if (currentLifePoints <= 0) {
      markAsDefeated();

      if (self.AutoEndMode === true) {
        self.CheckForLifeCounterManagerEnd();
      }
    }
  };
  self.CheckForLifeCounterManagerEnd = () => {
    let winnerIndex = "";
    let name = "";
    let duration = "";
    // Fetch Life Counter Details based on provided LifeCounterId
    $.ajax({
      url: `https://localhost:7081/users/checkforlifecountermanagerend?LifeCounterManagerId=${self.LifeCounterManagerId}`,
      type: "GET",
      xhrFields: { withCredentials: true },
      success: function (response) {
        if (response.content.isFinished === false) {
          return;
        }

        let getIndex = self.LifeCounterPlayers.findIndex(
          (player) => player.isDefeated == false
        );

        console.log("self.LifeCounterPlayers", self.LifeCounterPlayers);

        winnerIndex = getIndex != -1 ? getIndex : 0;

        const playerName = self.PlayerBlocks[winnerIndex].find(
          self.Fields.PlayerName
        );
        const playerCurrentLife = self.PlayerBlocks[winnerIndex].find(
          self.Fields.PlayerCurrentLifePoints
        );

        const markAsWinner = () => {
          playerName.addClass("markAsWinner");

          playerCurrentLife.addClass("markAsWinner");
        };
        if (winnerIndex != null) {
          if (self.PlayersCount == 1) {
            name = `You lost!`;
          }

          if (response.content.duration_minutes == 0) {
            duration = "";
          } else if (response.content.duration_minutes == 1) {
            duration = `, Game duration: ${response.content.duration_minutes} minute`;
          } else {
            duration = `, Game duration: ${response.content.duration_minutes} minutes`;
          }

          if (getIndex != -1) {
            name = `Game winner: ${playerName.text()}!`;
            markAsWinner();
          }

          // Disable all buttons
          self.Buttons.IncreaseLifePoints.prop("disabled", true);
          self.Buttons.DecreaseLifePoints.prop("disabled", true);
        }
      },
      error: function (xhr, status, error) {
        sweetAlertError("Could not load life counter");
      },
      complete: function () {
        if (name) {
          sweetAlertSuccess("Game Over!", `${name}  ${duration}`);
        }
      },
    });
  };
  self.RefreshLifeCounterManager = (callback) => {
    const formData = new FormData();

    formData.append("LifeCounterManagerId", self.LifeCounterManagerId);

    self.PlayerBlocks.forEach((player) => {
      player.loadcontent("charge-contentloader");
    });

    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/refreshlifecountermanager",
      data: formData,
      processData: false,
      contentType: false,
      xhrFields: {
        withCredentials: true, // Only if you're using cookies; otherwise can be removed
      },
      success: (resp) => {
        if (resp.content == null) {
          sweetAlertError(resp.message);

          return;
        }
        // Enable all buttons
        self.Buttons.IncreaseLifePoints.prop("disabled", false);
        self.Buttons.DecreaseLifePoints.prop("disabled", false);

        self.PlayerBlocks.forEach((playerBlock) => {
          playerBlock
            .find(self.Fields.PlayerName)
            .removeClass("markAsWinner markAsLooser");
          playerBlock
            .find(self.Fields.PlayerCurrentLifePoints)
            .removeClass("markAsWinner markAsLooser");
        });

        self.Build();
      },
      error: (err) => {
        sweetAlertError(err);
      },
      complete: () => {
        self.PlayerBlocks.forEach((player) => {
          player.loadcontent("demolish-contentloader");
        });
      },
    });
  };

  self.Build = () => {
    self.LoadReferences();

    self.LoadEvents();

    self.GetLifeCounterManagerId();

    if (!self.LifeCounterManagerId) {
      self.QuickStartLifeCounter();
      return;
    } else {
      self.GetLifeCounterManagerDetails();
    }
  };

  self.Build();
}

$(function () {
  new life_counter_manager();
});
