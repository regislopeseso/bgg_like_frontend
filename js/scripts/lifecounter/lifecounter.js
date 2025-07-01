function life_counter() {
  let self = this;
  self.IsBuilt = false;
  self.IsUserLoggedIn = false;

  self.LifeCounterTemplates = [];

  self.LifeCounter = [];
  self.DefaultLifeCounterPlayers = [
    {
      PlayerId: 0,
      PlayerName: "Player 1",
      CurrentLifePoints: 10,
      IsDefeated: false,
    },
    {
      PlayerId: 1,
      PlayerName: "Player 2",
      CurrentLifePoints: 10,
      IsDefeated: false,
    },
    {
      PlayerId: 2,
      PlayerName: "Player 3",
      CurrentLifePoints: 10,
      IsDefeated: false,
    },
    {
      PlayerId: 3,
      PlayerName: "Player 4",
      CurrentLifePoints: 10,
      IsDefeated: false,
    },
    {
      PlayerId: 4,
      PlayerName: "Player 5",
      CurrentLifePoints: 10,
      IsDefeated: false,
    },
    {
      PlayerId: 5,
      PlayerName: "Player 6",
      CurrentLifePoints: 10,
      IsDefeated: false,
    },
  ];
  self.LifeCounterPlayers = [];

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

  self.previousPlayerIndexes = [];
  self.increasingPointsCounter = 0;
  self.decreasingPointsCounter = 0;

  if (localStorage.getItem("LifeCounter") != null) {
    self.GetLifeCounter();
  } else {
    self.LifeCounter = {
      LifeCounterName: "Life Counter",
      PlayersCount: 1,
      PlayersStartingLifePoints: 10,
      FixedMaxLifePointsMode: false,
      PlayersMaxLifePoints: 100,
      AutoDefeatMode: false,
      AutoEndMode: false,
      StartingTimeMark: Date.now(),
      EndingTimeMark: null,
      Duration_minutes: 0,
      IsFinished: 0,
    };

    localStorage.setItem("LifeCounter", JSON.stringify(self.LifeCounter));
  }

  if (localStorage.getItem("LifeCounterPlayers") != null) {
    self.GetLifeCounterPlayers();

    let currentPlayersCount = self.LifeCounterPlayers.length;

    if (self.LifeCounter.PlayersCount > currentPlayersCount) {
      let existingIds = [];
      self.LifeCounterPlayers.forEach((player) => {
        existingIds.push(player.PlayerId);
      });
      console.log("existingIds: ", existingIds);

      let defaultIds = [0, 1, 2, 3, 4, 5];

      let n = self.LifeCounter.PlayersCount - currentPlayersCount;
      let idsToBeAdded = defaultIds
        .filter((id) => !existingIds.includes(id))
        .slice(0, n);

      for (let i = idsToBeAdded.length; i > n; i--) {
        idsToBeAdded.pop();
      }
      console.log("idsToBeAdded: ", idsToBeAdded);

      for (let j = 0; j < n; j++) {
        let arrayPosition = idsToBeAdded[j];

        self.LifeCounterPlayers.splice(
          arrayPosition,
          0,
          self.DefaultLifeCounterPlayers[arrayPosition]
        );
      }

      localStorage.setItem(
        "LifeCounterPlayers",
        JSON.stringify(self.LifeCounterPlayers)
      );

      self.GetLifeCounterPlayers();
    }
  } else {
    for (let i = 0; i < self.LifeCounter.PlayersCount; i++) {
      self.LifeCounterPlayers.push(self.DefaultLifeCounterPlayers[i]);
    }

    localStorage.setItem(
      "LifeCounterPlayers",
      JSON.stringify(self.LifeCounterPlayers)
    );

    localStorage.setItem("LifeCounter", JSON.stringify(self.LifeCounter));
  }

  self.LoadReferences = () => {
    self.DOM = $("#main-lifeCounter");

    self.LifeCountersField = self.DOM.find("#section-lifeCounter");

    self.LifeCountersOrganizer = self.DOM.find("#organizer-lifeCounter");

    self.LifeCounterTemplatesDropDown = self.DOM.find(
      "#ul-change-lifeCounterTemplate"
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
    self.Buttons[self.Buttons.length] = self.Buttons.RefreshLifeCounter =
      self.DOM.find("#button-refresh-lifeCounter");
    self.Buttons[self.Buttons.length] = self.Buttons.ChangeLifeCounterTemplate =
      self.DOM.find("#button-change-lifeCounterTemplate");
    self.Buttons[self.Buttons.length] = self.Buttons.SetUpLifeCounter =
      self.DOM.find("#button-setUp-lifeCounter");
    self.Buttons[self.Buttons.length] = self.Buttons.CloseLifeCounter =
      self.DOM.find("#button-close-lifeCounter");
    self.Buttons[self.Buttons.length] = self.Buttons.PlayerSetUp =
      self.DOM.find(".player-setup");
    self.Buttons[self.Buttons.length] = self.Buttons.IncreaseLifePoints =
      self.DOM.find(".increase-life-points");
    self.Buttons[self.Buttons.length] = self.Buttons.DecreaseLifePoints =
      self.DOM.find(".decrease-life-points");
    self.Buttons[self.Buttons.length] = self.Buttons.RestorePlayer =
      self.DOM.find(".restore-player");

    self.Fields = [];
    self.Fields[self.Fields.length] = self.Fields.LifeCounterName =
      self.DOM.find("#name-lifeCounter");
    self.Fields[self.Fields.length] = self.Fields.ShowDurationWrapper =
      self.DOM.find("#div-show-duration-lifeCounter");
    self.Fields[self.Fields.length] = self.Fields.ShowDuration = self.DOM.find(
      "#span-show-duration-lifeCounter"
    );
    self.Fields[self.Fields.length] = self.Fields.PlayerName =
      self.DOM.find(".player-title");
    self.Fields[self.Fields.length] = self.Fields.AlternativeName =
      self.DOM.find(".alter-title");
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
    self.Locations[self.Locations.length] = self.Locations.HomePage =
      "/index.html";
    self.Locations[self.Locations.length] = self.Locations.SetUpLifeCounter =
      "/html/lifecounter_setup.html";
    self.Locations[self.Locations.length] =
      self.Locations.SetUpLifeCounterPlayer =
        "/html/lifecounter_player_setup.html";
  };

  self.RedirectToHomePage = () => {
    window.location.href = `
      ${self.Locations.HomePage}`;
  };
  self.RedirectToLifeCounterSetUp = (lifeCounterId) => {
    window.location.href = `${self.Locations.SetUpLifeCounter}`;
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

  self.CheckAuthenticationStatus = () => {
    $.ajax({
      type: "GET",
      url: "https://localhost:7081/users/validatestatus",
      xhrFields: { withCredentials: true },
      success: function (response) {
        if (response.content == null) {
          sweetAlertError("Error", "User details not found.");
          return;
        }

        const content = response.content;

        self.IsUserLoggedIn = content.isUserLoggedIn;
        console.log("aqui deu certo, Is User logged in: ", self.IsUserLoggedIn);
      },
      error: function (xhr, status, error) {
        alert("Failed to fetch user details. Try again later.");
      },
    });
  };

  self.LoadEvents = () => {
    self.Buttons.RefreshLifeCounter.on("click", function (e) {
      e.preventDefault();

      self.RefreshLifeCounter();
    });

    self.Buttons.ChangeLifeCounterTemplate.on("click", (e) => {
      e.preventDefault();

      self.LoadLifeCounterTemplates();
    });

    $(document).on("click", ".lf-template", function (e) {
      e.preventDefault();

      let selectedId = $(this).data("template-id");
      console.log("Selected template ID: ", selectedId);

      self.CheckAuthenticationStatus();
      console.log("Is User logged in: ", self.IsUserLoggedIn);
    });

    self.Buttons.SetUpLifeCounter.on("click", function (e) {
      e.preventDefault();

      self.RedirectToLifeCounterSetUp(self.LifeCounterId);
    });

    self.Buttons.CloseLifeCounter.on("click", function (e) {
      e.preventDefault();
      self.RedirectToHomePage();
    });

    self.Buttons.PlayerSetUp.on("click", function (e) {
      e.preventDefault();
      // Get the parent .player-block div
      const playerBlock = $(this).closest(".player-block");
      // Optional: Get the block's index among visible players (e.g., 0 to 5)
      const playerIndex = $(".player-block:visible").index(playerBlock);

      const player = self.LifeCounterPlayers[playerIndex];

      self.RedirectToLifeCounterPlayerSetUp(playerIndex);
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

      if (isMaxLifePointsReached == true) {
        return;
      } else {
        const increaseLife = (amount) => {
          self.IncreaseLifePoints(playerIndex, amount);
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
      }
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

      if (self.LifeCounter.AutoDefeatMode == true && currentLife <= 0) {
        return;
      }

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

    self.Buttons.RestorePlayer.on("click", function (e) {
      e.preventDefault();

      // Get the parent .player-block div
      const playerBlock = $(this).closest(".player-block");
      // Optional: Get the block's index among visible players (e.g., 0 to 5)
      const playerIndex = $(".player-block:visible").index(playerBlock);

      self.RestorePlayer(playerIndex);
    });

    closeOnAnyKey();
  };

  self.LoadLifeCounterTemplates = () => {
    let lifeCounterTemplates = [];

    $.ajax({
      url: `https://localhost:7081/users/listlifecountertemplates`,
      type: "GET",
      xhrFields: { withCredentials: true },
      success: function (response) {
        if (response.content == null) {
          sweetAlertError(response.message);
          return;
        }
        self.LifeCounterTemplatesDropDown.empty();

        lifeCounterTemplates = response.content;

        lifeCounterTemplates.forEach((lifeCounterTemplate) => {
          let li = `
          <li class="li-change-lifeCounterTemplate">  
            <a class="lf-template dropdown-item" 
            data-template-id="${lifeCounterTemplate.lifeCounterTemplateId}">${lifeCounterTemplate.lifeCounterTemplateName}</a>
          </li>
          `;
          self.LifeCounterTemplatesDropDown.append(li);
        });
        let createTemplateBtn = `
        <li class="li-change-lifeCounterTemplate">  
            <hr />
        </li>

        <li class="li-change-lifeCounterTemplate">  
            <btn class="lf-template button dropdown-item">CREATE TEMPLATE</btn>
        </li>
        `;
        self.LifeCounterTemplatesDropDown.append(createTemplateBtn);
      },
      error: function (xhr, status, error) {
        console.error("Error fetching life counter templates:", error);
        console.log("Status:", status);
        console.log("Response:", xhr.responseText);
        sweetAlertError("Failed to fetch life counter templates.");
      },
    });
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
        transform: "rotate(180deg)",

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
        display: "flex",
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
        display: "flex",
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
        display: "flex",
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
        display: "flex",
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
        display: "flex",
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
        display: "flex",
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
        display: "flex",
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
        display: "flex",
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
        display: "flex",
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
        display: "flex",
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
        display: "flex",
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
        display: "flex",
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
        display: "flex",
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
        display: "flex",
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
        display: "flex",
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
        display: "flex",
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
    self.Fields.LifeCounterName.html(
      `<span>${self.LifeCounter.LifeCounterName}</span>`
    );

    self.Fields.ShowDuration.html("");

    self.Fields.ShowDurationWrapper.addClass("d-none");

    self.Buttons.SetUpLifeCounter.removeClass("d-none");

    for (let i = 0; i < self.LifeCounter.PlayersCount; i++) {
      self.LifeCounterInstances[i]
        .find(self.Fields.PlayerName)
        .html(self.LifeCounterPlayers[i].PlayerName);

      self.LifeCounterInstances[i]
        .find(self.Fields.PlayerCurrentLifePoints)
        .html(`${self.LifeCounterPlayers[i].CurrentLifePoints}`);
    }

    self.OrganizeLifeCounters(self.LifeCounter.PlayersCount);

    $("body").loadpage("demolish");
  };

  self.IncreaseLifePoints = (playerIndex, amountToIncrease) => {
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

    let updatedLifePoints = null;

    const player = self.LifeCounterPlayers[playerIndex];

    self.LifeCounterPlayers = JSON.parse(
      localStorage.getItem("LifeCounterPlayers")
    );

    updatedLifePoints = player.CurrentLifePoints + amountToIncrease;

    self.LifeCounterPlayers[playerIndex].CurrentLifePoints = updatedLifePoints;

    localStorage.setItem(
      "LifeCounterPlayers",
      JSON.stringify(self.LifeCounterPlayers)
    );

    self.PlayerBlocks[playerIndex]
      .find(self.Fields.PlayerCurrentLifePoints)
      .text(updatedLifePoints);

    if (updatedLifePoints == self.LifeCounter.PlayersMaxLifePoints) return;

    showIncreasingAmount(amountToIncrease);
  };
  self.DecreaseLifePoints = (playerIndex, amountToDecrease) => {
    const arrayIndex = self.LifeCounterPlayers.findIndex(
      (player) => player.PlayerId == playerIndex
    );

    const playerblock = self.PlayerBlocks[playerIndex];

    const currentLifePointsField = playerblock.find(
      self.Fields.PlayerCurrentLifePoints
    );

    let playerCurrentLifePoints = parseInt(
      currentLifePointsField.text().trim()
    );

    let currentLifeField = self.PlayerBlocks[playerIndex].find(
      self.Fields.PlayerCurrentLifePoints
    );
    let updatedLifePoints = null;

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

    if (self.AutoDefeatMode == true && player.isDefeated == true) {
      return;
    }

    updatedLifePoints = playerCurrentLifePoints - amountToDecrease;

    currentLifeField.html(updatedLifePoints);

    showDecreasingAmount(amountToDecrease);

    self.LifeCounterPlayers[arrayIndex].CurrentLifePoints = updatedLifePoints;

    self.SetLifeCounterPlayers();

    if (updatedLifePoints <= 0 && self.LifeCounter.AutoDefeatMode == true) {
      self.Fields.LifePointsDynamicBehavior.text("");
      self.increasingPointsCounter = 0;
      self.decreasingPointsCounter = 0;

      self.CheckForPlayerDefeated(playerIndex, updatedLifePoints);
      return;
    }
  };

  self.CheckForPlayerDefeated = (playerIndex, currentLifePoints) => {
    self.GetLifeCounterPlayers();

    const arrayIndex = self.LifeCounterPlayers.findIndex(
      (player) => player.PlayerId == playerIndex
    );

    const playerName = self.LifeCounterPlayers[arrayIndex].PlayerName;

    const playerBlock = self.PlayerBlocks[playerIndex];

    // Get player name or current life from DOM if needed
    const playerNameField = playerBlock.find(self.Fields.PlayerName);
    const playerAlternativeNameField = playerBlock.find(
      self.Fields.AlternativeName
    );

    const currentLifePointsField = playerBlock.find(
      self.Fields.PlayerCurrentLifePoints
    );
    const playerCurrentLifePoints = parseInt(
      currentLifePointsField.text().trim()
    );

    const increaseLifePointsBtn = playerBlock.find(
      self.Buttons.IncreaseLifePoints
    );

    const decreaseLifePointsBtn = playerBlock.find(
      self.Buttons.DecreaseLifePoints
    );

    const restorePlayerBtn = playerBlock.find(self.Buttons.RestorePlayer);

    const markAsDefeated = () => {
      playerNameField.addClass("d-none");

      playerAlternativeNameField
        .removeClass("d-none")
        .html(playerName + " (Defeated)")
        .addClass("markAsLooser");

      currentLifePointsField.addClass("d-none");

      increaseLifePointsBtn.attr("disabled", true);
      decreaseLifePointsBtn.attr("disabled", true);

      restorePlayerBtn.attr("disabled", false).removeClass("d-none");
    };

    if (playerCurrentLifePoints <= 0) {
      markAsDefeated();

      self.LifeCounterPlayers[arrayIndex].CurrentLifePoints = 0;
      self.LifeCounterPlayers[arrayIndex].IsDefeated = true;
      self.SetLifeCounterPlayers();

      if (self.LifeCounter.AutoEndMode === true) {
        self.CheckForLifeCounterEnd();
      }
    }
  };
  self.CheckForDefeatedPlayers = (playerIndex, currentLifePoints) => {
    self.GetLifeCounterPlayers();

    self.LifeCounterPlayers.forEach((player) => {
      self.CheckForPlayerDefeated(player.PlayerId, player.CurrentLifePoints);
    });
  };
  self.CheckForLifeCounterEnd = () => {
    self.GetLifeCounter();
    self.GetLifeCounterPlayers();

    let playersCount = self.LifeCounter.PlayersCount;
    let defeatedPlayersCount = self.LifeCounterPlayers.filter(
      (player) => player.IsDefeated == true
    ).length;

    let lifeCounterLength = "";

    if (defeatedPlayersCount == 0 || playersCount - defeatedPlayersCount > 1) {
      return;
    }

    self.LifeCounter.IsFinished = true;
    self.LifeCounter.EndingTimeMark = Date.now();
    self.LifeCounter.Duration_minutes =
      (self.LifeCounter.EndingTimeMark - self.LifeCounter.StartingTimeMark) /
      60000;

    lifeCounterLength =
      self.LifeCounter.Duration_minutes.toFixed(1).replace(".", ",") +
      " minutes";

    if (playersCount == 1 && self.LifeCounterPlayers[0].IsDefeated == true) {
      sweetAlertError(
        "Game Over - You Lost!",
        "Duration: " + lifeCounterLength
      );
    }

    if (playersCount > 1) {
      if (defeatedPlayersCount == playersCount) {
        sweetAlertError(
          "Game Over - You All Lost",
          "Duration: " + lifeCounterLength
        );
      }

      const winnerArrayIndex = self.LifeCounterPlayers.findIndex(
        (player) => player.IsDefeated == false
      );

      const winnerId = self.LifeCounterPlayers[winnerArrayIndex].PlayerId;

      const winnerName = self.LifeCounterPlayers[winnerArrayIndex].PlayerName;

      const winnerBlock = self.PlayerBlocks[winnerId];

      const winnerNameField = winnerBlock.find(self.Fields.PlayerName);
      winnerNameField.addClass("d-none");

      const winnerAlterNameField = winnerBlock.find(
        self.Fields.AlternativeName
      );

      winnerAlterNameField
        .removeClass("d-none")
        .html("WINNER: " + winnerName)
        .addClass("markAsWinner");

      const winnerCurrentLifePointsField = winnerBlock.find(
        self.Fields.PlayerCurrentLifePoints
      );
      winnerCurrentLifePointsField.addClass("markAsWinner");

      self.PlayerBlocks.forEach((block) => {
        block.find("button").attr("disabled", true);
      });

      sweetAlertSuccess(
        "Winner is: " + winnerName,
        "Duration: " + lifeCounterLength
      );
    }

    self.SetLifeCounter();
    self.SetLifeCounterPlayers();

    self.Buttons.SetUpLifeCounter.addClass("d-none");
    self.Fields.ShowDurationWrapper.removeClass("d-none");
    self.Fields.ShowDuration.html(lifeCounterLength);

    self.Buttons.RestorePlayer.attr("disabled", true).addClass("d-none");
  };

  self.RestorePlayer = (playerIndex) => {
    self.GetLifeCounterPlayers();

    const dynamicLifePoints = self.PlayerBlocks[playerIndex].find(
      self.Fields.LifePointsDynamicBehavior
    );

    const dynamicText = self.PlayerBlocks[playerIndex]
      .find(".dynamic-behavior")
      .text()
      .trim();

    if (dynamicText) {
      // Remove any non-numeric characters like parentheses
      dynamicText.replace(/[^\d-]/g, "");
    }

    const showIncreasingAmount = () => {
      dynamicLifePoints.html(
        `&nbsp;&nbsp; <span style="color: var(--greenish);">(+ 1)</span>`
      );

      clearTimeout(self.clearDeltaTimeout);
      self.clearDeltaTimeout = setTimeout(() => {
        self.Fields.LifePointsDynamicBehavior.text("");
      }, 3000);
    };

    const playerName = self.LifeCounterPlayers[playerIndex].PlayerName;
    const playerBlock = self.PlayerBlocks[playerIndex];
    const playerNameField = playerBlock.find(self.Fields.PlayerName);
    const playerAlternativeNameField = playerBlock.find(
      self.Fields.AlternativeName
    );
    const currentLifePointsField = playerBlock.find(
      self.Fields.PlayerCurrentLifePoints
    );

    self.LifeCounterPlayers[playerIndex].IsDefeated = false;
    self.LifeCounterPlayers[playerIndex].CurrentLifePoints = 1;

    playerAlternativeNameField
      .html(playerName + "")
      .removeClass("markAsLooser")
      .addClass("d-none");

    playerNameField.removeClass("d-none");
    currentLifePointsField.removeClass("d-none");
    currentLifePointsField.html(1);

    const increaseLifePointsBtn = playerBlock.find(
      self.Buttons.IncreaseLifePoints
    );

    const decreaseLifePointsBtn = playerBlock.find(
      self.Buttons.DecreaseLifePoints
    );

    self.Buttons.RestorePlayer.attr("disabled", true).addClass("d-none");

    increaseLifePointsBtn.attr("disabled", false);
    decreaseLifePointsBtn.attr("disabled", false);

    self.SetLifeCounterPlayers();

    showIncreasingAmount();
  };
  self.RefreshLifeCounter = () => {
    self.PlayerBlocks.forEach((player) => {
      player.loadcontent("charge-contentloader");
    });

    self.previousPlayerIndexes = [];
    self.increasingPointsCounter = 0;
    self.decreasingPointsCounter = 0;

    for (let i = 0; i < self.LifeCounter.PlayersCount; i++) {
      self.PlayerBlocks[i]
        .find(self.Fields.PlayerName)
        .html(`Player ${i + 1}`)
        .removeClass("d-none");

      self.PlayerBlocks[i]
        .find(self.Fields.AlternativeName)
        .removeClass("markAsWinner markAsLooser")
        .html("")
        .addClass("d-none");

      self.PlayerBlocks[i]
        .find(self.Fields.PlayerCurrentLifePoints)
        .removeClass("d-none");

      self.LifeCounterPlayers[i].CurrentLifePoints =
        self.LifeCounter.PlayersStartingLifePoints;

      self.PlayerBlocks[i]
        .find(self.Fields.PlayerCurrentLifePoints)
        .val(self.LifeCounter.PlayersStartingLifePoints)
        .removeClass("markAsWinner markAsLooser");

      self.PlayerBlocks[i].find(self.Fields.LifePointsDynamicBehavior).html("");

      self.LifeCounterPlayers[i].IsDefeated = false;
    }
    self.LifeCounter.IsFinished = false;
    self.LifeCounter.StartingTimeMark = Date.now();
    self.LifeCounter.EndingTimeMark = null;
    self.Duration_minutes = 0;

    self.SetLifeCounterPlayers();
    self.SetLifeCounter();

    self.DOM.find("button").attr("disabled", false);

    self.Buttons.RestorePlayer.attr("disabled", true).addClass("d-none");

    self.BuildLifeCounter();

    self.PlayerBlocks.forEach((player) => {
      player.loadcontent("demolish-contentloader");
    });
  };

  self.Build = () => {
    if (self.IsBuilt == false) {
      self.LoadReferences();

      self.LoadEvents();

      self.IsBuilt = true;
    }

    self.BuildLifeCounter();
    self.CheckForDefeatedPlayers();
  };

  self.Build();
}

$(function () {
  new life_counter();
});
