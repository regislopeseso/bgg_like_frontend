function life_counter_manager() {
  let self = this;

  self.LifeCounterTemplateId = null;

  self.LifeCounterManagerId = null;
  self.LifeCounterManagerName = null;

  self.PlayersCount = null;
  self.PlayersStartingLifePoints = null;
  self.FixedMaxLifePointsMode = null;
  self.PlayersMaxLifePoints = null;
  self.AutoEndMode = false;

  self.LifeCounterPlayers = [];
  self.previousPlayerIndexes = [];
  self.increasingPointsCounter = 0;
  self.decreasingPointsCounter = 0;

  self.AtStart = () => {
    $("body").loadpage("charge");
    self.GetLifeCounterManager();

    self.BuildLifeCounter();
  };

  self.GetLifeCounterManager = () => {
    $.ajax({
      type: "GET",
      url: `https://localhost:7081/users/getlifecountermanagerdetails`,
      xhrFields: { withCredentials: true },
      success: function (response) {
        if (response.content == null) {
          sweetAlertError(response.message);
          self.StartDefaultLifeCounterManager();
        } else {
          const lifeCounterManagerDB = response.content;

          self.LifeCounterManagerId =
            lifeCounterManagerDB.lifeCounterTemplateId;
          self.LifeCounterManagerName =
            lifeCounterManagerDB.lifeCounterTemplateName;
          self.PlayersCount = lifeCounterManagerDB.playersCount;
          self.PlayersStartingLifePoints =
            lifeCounterManagerDB.playersStartingLifePoints;
          self.FixedMaxLifePointsMode =
            lifeCounterManagerDB.fixedMaxLifePointsMode;
          self.PlayersMaxLifePoints = lifeCounterManagerDB.PlayersMaxLifePoints;
          self.AutoEndMode = lifeCounterManagerDB.autoEndMode;
          self.LifeCounterPlayers = lifeCounterManagerDB.lifeCounterPlayers;

          self.BuildLifeCounter();
        }
      },
      error: function (xhr, status, error) {
        sweetAlertError(
          "Failed to fetch requested LIFE COUNTER MANAGER DETAILS."
        );
      },
    });
  };

  // Método abaixo está sendo implementado
  self.StartDefaultLifeCounterManager = () => {
    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/createlifecountertemplate",
      //data: formData, in this case we are sending an empty request so that the back end will create a default template that can be edited later
      processData: false,
      contentType: false,
      xhrFields: {
        withCredentials: true, // Only if you're using cookies; otherwise can be removed
      },
      success: (resp) => {
        if (resp.content === null) {
          sweetAlertError(resp.message);
        } else {
          self.LifeCounterTemplateId = resp.content.lifeCounterTemplateId;
          sweetAlertSuccess(resp.message);
        }
      },
      error: (err) => {
        sweetAlertError(err);
      },
      complete: () => {
        if (self.LifeCounterTemplateId) {
          self.BuildLifeCounter();
        }
      },
    });
  };
  // Método abaixo ainda não implementado
  self.ReStartLastLifeCounterManager = () => {
    $.ajax({
      type: "GET",
      url: `https://localhost:7081/users/getlastlifecountermanagerdetails`,
      xhrFields: { withCredentials: true },
      success: function (response) {
        self.LifeCounterManagerId = response.content.lifeCounterManagerId;

        self.BuildLifeCounter();

        self.OrganizeLifeCounters(self.PlayersCount);
      },
      error: function (xhr, status, error) {
        sweetAlertError("Could not load life counter");
      },
    });
  };
  // Método abaixo ainda não implementado
  self.LoadUnfinishedLifeCounterManager = () => {};

  self.GetLifeCounterDetails = () => {
    if (!self.LifeCounterTemplateId) {
      sweetAlertError("Failed to fetch id", "self.LifeCounterTemplateId");
    } else {
      // Fetch Life Counter Details based on provided LifeCounterId
      $.ajax({
        type: "GET",
        url: `https://localhost:7081/users/getlifecounterdetails?LifeCounterId=${self.LifeCounterTemplateId}`,
        xhrFields: { withCredentials: true },
        success: function (response) {
          self.LifeCounterManagerName = response.content.name;
          self.PlayersCount = response.content.defaultPlayersCount;
          self.PlayersStartingLifePoints =
            response.content.playersStartingLifePoints;
          self.PlayersMaxLifePoints = response.content.maxLifePoints;
          self.AutoEndMode = response.content.autoEndMode;

          self.BuildLifeCounter();

          self.OrganizeLifeCounters(self.PlayersCount);
        },
        error: function (xhr, status, error) {
          sweetAlertError("Could not load life counter");
        },
      });
    }
  };
  self.GetLifeCounterPlayersDetails = (callback) => {
    // Fetch Life Counter Details based on provided LifeCounterId
    $.ajax({
      url: `https://localhost:7081/users/getlifecounterplayersdetails?LifeCounterManagerId=${self.LifeCounterManagerId}`,
      type: "GET",
      xhrFields: { withCredentials: true },
      success: function (response) {
        self.LifeCounterPlayers = response.content.lifeCounterPlayers;
        if (typeof callback === "function") callback();
      },
      error: function (xhr, status, error) {
        alert("Could not load life counter");
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
    self.Locations[self.Locations.length] = self.Locations.SetUpLifeCounter =
      "/html/pages_users/lifecounter/lifecounter_manager_setup.html";
  };
  self.RedirectToUsersPage = () => {
    window.location.href = self.Locations.UsersPage;
  };
  self.RedirectLifeCounterManagerConfigs = () => {
    window.location.href = self.Locations.SetUpLifeCounter;
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
          console.log(playerLifepoints);

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

      self.RedirectLifeCounterManagerConfigs();
    });

    self.Buttons.CloseLifeCounterManager.on("click", function (e) {
      e.preventDefault();
      self.RedirectToUsersPage();
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
        player.isMaxLifePointsFixed &&
        currentLife >= player.playerMaxLifePoints;

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
        if (currentLife > 0) {
          self.DecreaseLifePoints(playerIndex, amount);
        }
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

  self.BuildLifeCounter_old = () => {
    const formData = new FormData();
    formData.append("LifeCounterTemplateId", self.LifeCounterTemplateId);

    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/startlifecountermanager",
      data: formData,
      processData: false,
      contentType: false,
      xhrFields: {
        withCredentials: true, // Only if you're using cookies; otherwise can be removed
      },
      success: (resp) => {
        if (resp.content === null) {
          sweetAlertSuccess(resp.message);
        } else {
          const lifeCounterManagerDB = resp.content;

          console.log("lifeCounterManagerDB: ", lifeCounterManagerDB);

          self.LifeCounterManagerId =
            lifeCounterManagerDB.lifeCounterTemplateId;
          self.LifeCounterManagerName =
            lifeCounterManagerDB.lifeCounterTemplateName;
          self.PlayersCount = lifeCounterManagerDB.playersCount;
          self.PlayersStartingLifePoints =
            lifeCounterManagerDB.playersStartingLifePoints;
          self.FixedMaxLifePointsMode =
            lifeCounterManagerDB.fixedMaxLifePointsMode;
          self.PlayersMaxLifePoints = lifeCounterManagerDB.PlayersMaxLifePoints;
          self.AutoEndMode = lifeCounterManagerDB.autoEndMode;
          self.LifeCounterPlayers = lifeCounterManagerDB.lifeCounterPlayers;
        }

        self.Fields.LifeCounterManagerName.html(
          `<span>${self.LifeCounterManagerName}</span>`
        );

        console.log("self.LifeCounterPlayers: ", self.LifeCounterPlayers);
        for (let i = 0; i < self.PlayersCount; i++) {
          self.LifeCounterInstances[i]
            .find(self.Fields.PlayerName)
            .html(self.LifeCounterPlayers[i].playerName);
        }

        self.Fields.PlayerCurrentLifePoints.html(
          `${self.PlayersStartingLifePoints}`
        );

        self.OrganizeLifeCounters(self.PlayersCount);
      },
      error: (err) => {
        sweetAlertError(err);
      },
      complete: () => {
        //self.GetLifeCounterPlayersDetails(false);
        $("body").loadpage("demolish");
      },
    });
  };
  self.BuildLifeCounter = () => {
    self.Fields.LifeCounterManagerName.html(
      `<span>${self.LifeCounterManagerName}</span>`
    );

    for (let i = 0; i < self.PlayersCount; i++) {
      self.LifeCounterInstances[i]
        .find(self.Fields.PlayerName)
        .html(self.LifeCounterPlayers[i].playerName);
    }

    self.Fields.PlayerCurrentLifePoints.html(
      `${self.PlayersStartingLifePoints}`
    );

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
        self.decreasingPointsCounter = 0;
      }, 3000);
    };

    const player = self.LifeCounterPlayers[playerIndex];

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
        } else {
          updatedLifePoints = resp.content.updatedLifePoints;

          self.PlayerBlocks[playerIndex]
            .find(self.Fields.PlayerCurrentLifePoints)
            .html(updatedLifePoints);

          showDecreasingAmount(amountToDecrease);
        }
      },
      error: (err) => {
        sweetAlertError(err);
      },
      complete: () => {
        self.CheckForPlayerDefeated(playerIndex, updatedLifePoints);
        //Re-enable all buttons
        self.Buttons.forEach((btn) => btn.prop("disabled", false));
      },
    });
  };
  self.CheckForPlayerDefeated = (playerIndex, currentLifePoints) => {
    const playerBlock = self.PlayerBlocks[playerIndex];
    // Optional: Get player name or current life from DOM if needed
    const playerNameElement = playerBlock.find(".player-title");
    const playerCurrentLifeElement = playerBlock.find(".player-lifepoints");

    const markAsDefeated = () => {
      playerNameElement.css({
        "color": "var(--reddish)",
        "font-weight": "100",
        "text-decoration": "line-through",
      });

      playerCurrentLifeElement.html(`(Defeated)`).css({
        "color": "var(--reddish)",
        "font-weight": "100",
      });

      playerBlock.find("button").prop("disabled", true);
    };

    if (currentLifePoints == 0) {
      markAsDefeated();
      if (self.AutoEndMode === true) {
        self.GetLifeCounterPlayersDetails(false);
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
        if (response.content.isEnded === true) {
          let getIndex = self.LifeCounterPlayers.findIndex(
            (player) => player.isDefeated == false
          );

          console.log("getIndex is: ", getIndex);

          winnerIndex = getIndex != -1 ? getIndex : 0;

          const playerName = self.PlayerBlocks[winnerIndex].find(
            self.Fields.PlayerName
          );
          const playerCurrentLife =
            self.PlayerBlocks[winnerIndex].find(".player-lifepoints");

          const markAsWinner = () => {
            playerName.css({
              "color": "var(--greenish)",
            });

            playerCurrentLife.html(`(WINNER)`).css({
              "color": "var(--greenish)",
            });
          };
          if (winnerIndex != null) {
            name = `You lost!`;

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
        if (resp.content === null) {
          sweetAlertError(resp.message);
        } else {
          self.GetLifeCounterPlayersDetails(callback);
        }
      },
      error: (err) => {
        sweetAlertError(err);
      },
      complete: () => {
        self.PlayerBlocks.forEach((player) => {
          console.log("player:", player);
          player.loadcontent("demolish-contentloader");
        });
      },
    });
  };

  self.Build = () => {
    self.GetLifeCounterManagerId();
    self.LoadReferences();

    self.LoadEvents();
    //self.GetLifeCounterDetails();
  };

  self.Build();
}

$(function () {
  new life_counter_manager();
});
