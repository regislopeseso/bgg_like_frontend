function lifecounter_manager() {
  let self = this;

  self.IsBuilt = false;

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

  self.Current_LifeCounter_Manager = [];
  self.Current_LifeCounter_Players = [];

  self.DefaultLifeCounterPlayers = [
    {
      LifeCounterManagerId: null,
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

  self.previousPlayerIndexes = [];
  self.increasingPointsCounter = 0;
  self.decreasingPointsCounter = 0;

  self.BuildDefaultLifeCounter = () => {
    // Setting the commom parameters
    const lifeCounterName = "Life Counter Zer0";
    const playersStartingLifePoints = 10;
    const playersCount = 1;
    const fixedMaxLifePointsMode = false;
    const playersMaxLifePoints = null;
    const autoDefeatMode = false;
    const autoEndMode = false;

    // Building a Default Life Counter TEMPLATE
    const template_virtualId = "lct" + (self.LifeCounterTemplates.length + 1);
    self.LifeCounterTemplate = {
      LifeCounterTemplateId: template_virtualId,
      LifeCounterTemplateName: lifeCounterName,
      PlayersStartingLifePoints: playersStartingLifePoints,
      PlayersCount: playersCount,
      FixedMaxLifePointsMode: fixedMaxLifePointsMode,
      PlayersMaxLifePoints: playersMaxLifePoints,
      AutoDefeatMode: autoDefeatMode,
      AutoEndMode: autoEndMode,
      LifeCounterManagersCount: 0,
      LifeCounterManagers: [],
    };

    // Updates Life Counter TEMPLATES >LIST<
    self.LifeCounterTemplates.push(self.LifeCounterTemplate);

    // Building a Default Life Counter MANAGER
    // Creating a new LIFE COUNTER MANAGER
    const manager_virtualId =
      "lcm" + (self.LifeCounterTemplate.LifeCounterManagers.length + 1);
    self.Current_LifeCounter_Manager = {
      LifeCounterManagerId: manager_virtualId,
      LifeCounterTemplateId: template_virtualId,
      LifeCounterManagerName: lifeCounterName,
      PlayersStartingLifePoints: playersStartingLifePoints,
      PlayersCount: playersCount,
      LifeCounterPlayers: [],
      FixedMaxLifePointsMode: fixedMaxLifePointsMode,
      PlayersMaxLifePoints: playersMaxLifePoints,
      AutoDefeatMode: autoDefeatMode,
      AutoEndMode: autoEndMode,
      StartingTimeMark: Date.now(),
      EndingTimeMark: null,
      Duration_minutes: null,
      IsFinished: false,
    };
    // Updates Life Counter TEMPLATE -> Managers
    self.LifeCounterTemplate.LifeCounterManagers.push(
      self.Current_LifeCounter_Manager
    );

    // Updates Life Counter TEMPLATE
    self.LifeCounterTemplate.LifeCounterManagersCount++;

    // Creating the Life Counter Players
    for (let i = 0; i < playersCount; i++) {
      const player_virtualId = "lcp" + (i + 1);
      let newPlayer = {
        LifeCounterManagerId: manager_virtualId,
        PlayerId: player_virtualId,
        PlayerName: "Player " + (i + 1),
        CurrentLifePoints: playersStartingLifePoints,
        IsDefeated: false,
      };
      // Updates the global variable Life Counter CURRENT Players
      self.Current_LifeCounter_Players.push(newPlayer);
    }
    // Updates Life Counter TEMPLATE -> MANAGERS -> Players
    self.Current_LifeCounter_Manager.LifeCounterPlayers =
      self.Current_LifeCounter_Players;

    // Updates Local Storage: Life Counter TEMPLATES >LIST<
    self.SetLifeCounterTemplates();
  };
  if (localStorage.getItem("LifeCounterTemplate") != null) {
    self.LifeCounterTemplate = self.GetLifeCounterTemplate();
  } else {
    self.BuildDefaultLifeCounter();
  }

  self.LoadReferences = () => {
    self.DOM = $("#main-lifeCounter");

    self.LifeCountersField = self.DOM.find("#section-lifeCounter");

    self.LifeCountersOrganizer = self.DOM.find("#organizer-lifeCounter");

    self.LifeCounterTemplatesDropDown = self.DOM.find(
      "#ul-change-lifeCounterTemplate"
    );
    self.lifeCounterTemplateDropDownItems_class = ".lf-template";
    self.LifeCounterTemplateDropDownItems = self.DOM.find(
      self.lifeCounterTemplateDropDownItems_class
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
      self.DOM.find("#button-refresh-lifeCounterManager");
    self.Buttons[self.Buttons.length] = self.Buttons.ChangeLifeCounterTemplate =
      self.DOM.find("#button-change-lifeCounterTemplate");
    self.Buttons[self.Buttons.length] = self.Buttons.EditLifeCounterTemplate =
      self.DOM.find("#button-edit-LifeCounterTemplate");
    self.Buttons[self.Buttons.length] = self.Buttons.SyncLifeCounterData_DB =
      self.DOM.find("#button-sync-DB-lifeCounter");

    self.Buttons[self.Buttons.length] = self.Buttons.CreateLifeCounterTemplate =
      self.DOM.find("#create-lifeCounterTemplate");
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
    self.Fields[self.Fields.length] = self.Fields.LifeCounterManagerName =
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
    self.Locations[self.Locations.length] =
      self.Locations.LifeCounter_CreateTemplate =
        "/html/lifecounter/lifecounter_template_create.html";
    self.Locations[self.Locations.length] =
      self.Locations.LifeCounter_EditTemplate =
        "/html/lifecounter/lifecounter_template_edit.html";
    self.Locations[self.Locations.length] =
      self.Locations.LifeCounterManagerSetUp = "/html/lifecounter_setup.html";
    self.Locations[self.Locations.length] =
      self.Locations.SetUpLifeCounterPlayer =
        "/html/lifecounter_player_setup.html";
  };

  self.RedirectToHomePage = () => {
    window.location.href = `
      ${self.Locations.HomePage}`;
  };
  self.RedirectToLifeCounter_CreateTemplate = () => {
    window.location.href = `${self.Locations.LifeCounter_CreateTemplate}`;
  };
  self.RedirectToLifeCounter_EditTemplate = () => {
    window.location.href = `${self.Locations.LifeCounter_EditTemplate}`;
  };

  self.RedirectToLifeCounterManagerSetUp = () => {
    window.location.href = `${self.Locations.LifeCounterManagerSetUp}`;
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
    self.Buttons.RefreshLifeCounter.on("click", function () {
      self.RefreshLifeCounter();
    });

    self.Buttons.ChangeLifeCounterTemplate.on("click", (e) => {
      self.LoadLifeCounterTemplates();
    });

    //self.Buttons.AcessLifeCounterTemplateMenu
    self.DOM.on("click", "#create-lifeCounterTemplate", function (e) {
      e.preventDefault();
      self.RedirectToLifeCounter_CreateTemplate();
    });

    self.DOM.on(
      "click",
      self.lifeCounterTemplateDropDownItems_class,
      function (e) {
        e.preventDefault();

        let selectedTemplateName = $(this).text();
        let selectedTemplateId = $(this).data("template-id");

        self.Buttons.ChangeLifeCounterTemplate.text(selectedTemplateName);

        self.StartLifeCounterManager(selectedTemplateId);
      }
    );

    self.Buttons.EditLifeCounterTemplate.on("click", () => {
      // const templateId =
      //   self.Buttons.ChangeLifeCounterTemplate.attr("data-template-id");

      // let templateToBeEdited = self.LifeCounterTemplates.find(
      //   (template) => template.LifeCounterTemplateId == templateId
      // );

      // self.LifeCounterTemplate = templateToBeEdited;

      // self.SetLifeCounterTemplate();

      self.RedirectToLifeCounter_EditTemplate();
    });

    self.Buttons.SetUpLifeCounter.on("click", function (e) {
      e.preventDefault();

      self.RedirectToLifeCounterManagerSetUp(self.LifeCounterId);
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

      const playerCurrentLifeElement = playerBlock.find(".player-lifepoints");
      const currentLife = parseInt(playerCurrentLifeElement.text().trim(), 10);

      self.LifeCounterManager = self.GetLifeCounterManager();

      let isMaxLifePointsReached =
        self.LifeCounterManager.FixedMaxLifePointsMode === true &&
        currentLife >= self.LifeCounterManager.PlayersMaxLifePoints;

      if (isMaxLifePointsReached == true) {
        return;
      }

      let holdTimer;
      let intervalId;
      let isHeld = false;

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
    });

    self.Buttons.DecreaseLifePoints.on("mousedown touchstart", function (e) {
      e.preventDefault();

      // Get the parent .player-block div
      const playerBlock = $(this).closest(".player-block");
      // Optional: Get the block's index among visible players (e.g., 0 to 5)
      const playerIndex = $(".player-block:visible").index(playerBlock);

      const playerCurrentLifeElement = playerBlock.find(".player-lifepoints");
      const currentLife = parseInt(playerCurrentLifeElement.text().trim(), 10);

      self.LifeCounterManager = self.GetLifeCounterManager();

      let isMinLifePointsReached =
        self.LifeCounterManager.AutoDefeatMode == true && currentLife <= 0;

      if (isMinLifePointsReached === true) {
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
    self.LifeCounterTemplatesDropDown.html("");

    const buildDropDown = (lifeCounterTemplates) => {
      lifeCounterTemplates.forEach((lifeCounterTemplate) => {
        let li = `
          <li class="li-change-lifeCounterTemplate">  
            <a class="lf-template dropdown-item" 
            data-template-id="${lifeCounterTemplate.LifeCounterTemplateId}">${lifeCounterTemplate.LifeCounterTemplateName}</a>
          </li>
          `;
        self.LifeCounterTemplatesDropDown.append(li);
      });
      let createTemplateBtn = `
        <li class="li-change-lifeCounterTemplate">  
            <hr />
        </li>

        <li class="li-change-lifeCounterTemplate">  
            <btn id="create-lifeCounterTemplate" class="button dropdown-item">CREATE TEMPLATE</btn>
        </li>
        `;
      self.LifeCounterTemplatesDropDown.append(createTemplateBtn);
    };

    if (self.IsUserLoggedIn === false) {
      self.LifeCounterTemplates = self.GetLifeCounterTemplates();
      buildDropDown(self.LifeCounterTemplates);

      return;
    }

    $.ajax({
      url: `https://localhost:7081/users/listlifecountertemplates`,
      type: "GET",
      xhrFields: { withCredentials: true },
      success: function (response) {
        if (response.content == null) {
          sweetAlertError(response.message);
          return;
        }

        const lifeCounterTemplates = [];

        response.content.forEach((lifeCounterTemplate) => {
          lifeCounterTemplates.push({
            LifeCounterTemplateId: lifeCounterTemplate.lifeCounterTemplateId,
            LifeCounterTemplateName:
              lifeCounterTemplate.lifeCounterTemplateName,
          });
        });

        buildDropDown(lifeCounterTemplates);
      },
      error: function (xhr, status, error) {
        console.error("Error fetching life counter templates:", error);
        console.log("Status:", status);
        console.log("Response:", xhr.responseText);
        sweetAlertError("Failed to fetch life counter templates.");
      },
    });
  };

  self.GetUserLifeCounterTemplate = (templateId) => {
    $.ajax({
      url: `https://localhost:7081/users/getlifecountertemplatedetails?LifeCounterTemplateId=${templateId}`,
      method: "GET",
      xhrFields: {
        withCredentials: true,
      },
      success: function (response) {
        if (!response.content) {
          sweetAlertError(response.message);

          return;
        }

        const template = response.content;

        self.LifeCounterTemplate = {
          LifeCounterTemplateId: templateId,
          LifeCounterTemplateName: template.lifeCounterTemplateName,
          PlayersStartingLifePoints: template.playersStartingLifePoints,
          PlayersCount: template.playersCount,
          FixedMaxLifePointsMode: template.fixedMaxLifePointsMode,
          PlayersMaxLifePoints: template.playersMaxLifePoints,
          AutoDefeatMode: template.autoDefeatMode,
          AutoEndMode: template.autoEndMode,
          LifeCounterManagersCount: template.lifeCounterManagersCount,
        };
        self.SetLifeCounterTemplate();

        self.StartUserLifeCounterManager(templateId);
      },
      error: function (xhr, status, error) {
        console.error("Error fetching board game details:", error);
      },
    });
  };
  self.StartUserLifeCounterManager = (templateId) => {
    self.DOM.loadcontent("charge-contentloader");
    $.ajax({
      type: "POST",
      url: `https://localhost:7081/users/startlifecountermanager`,
      data: {
        LifeCounterTemplateId: templateId,
      },
      xhrFields: { withCredentials: true },
      success: function (response) {
        if (response.content == null) {
          sweetAlertError(response.message);
        }

        let manager = response.content;

        self.LifeCounterManager = {
          LifeCounterManagerId: manager.lifeCounterManagerId,
          LifeCounterTemplateId: manager.lifeCounterTemplateId,
          LifeCounterManagerName: manager.lifeCounterTemplateName,
          PlayersStartingLifePoints: manager.playersStartingLifePoints,
          PlayersCount: manager.playersCount,
          FixedMaxLifePointsMode: manager.fixedMaxLifePointsMode,
          PlayersMaxLifePoints: manager.playersMaxLifePoints,
          AutoDefeatMode: manager.autoDefeatMode,
          AutoEndMode: manager.autoEndMode,
          StartingTimeMark: Date.now(),
          EndingTimeMark: null,
          Duration_minutes: null,
          IsFinished: false,
        };
        self.SetLifeCounterManager();

        let players = manager.lifeCounterPlayers;

        self.LifeCounter_CurrentPlayers = [];
        self.LifeCounterPlayers = self.GetLifeCounterPlayers();

        if (!self.LifeCounterPlayers) {
          self.LifeCounterPlayers = [];
        }
        players.forEach((player) => {
          let newPlayer = {
            LifeCounterManagerId: manager.lifeCounterManagerId,
            PlayerId: player.lifeCounterPlayerId,
            PlayerName: player.playerName,
            CurrentLifePoints: player.playerStartingLifePoints,
            IsDefeated: false,
          };

          self.LifeCounter_CurrentPlayers.push(newPlayer);
          self.LifeCounterPlayers.push(newPlayer);
        });
        self.SetLifeCounter_CurrentPlayers();
        self.SetLifeCounterPlayers();

        self.BuildLifeCounterManager();
      },
      error: function (xhr, status, error) {
        sweetAlertError(
          "Failed to fetch requested LIFE COUNTER MANAGER DETAILS."
        );
      },
      complete: function () {
        self.DOM.loadcontent("demolish-contentloader");
      },
    });
  };

  self.GetUserLastLifeCounterManager = () => {
    $.ajax({
      url: `https://localhost:7081/users/getlastunfinishedlifecountermanager`,
      type: "GET",
      xhrFields: { withCredentials: true },
      success: function (response) {
        if (response.content == null) {
          sweetAlertError(response.message);
          self.LifeCounterTemplate = self.GetLifeCounterTemplate();
          self.BuildLifeCounterManager();
          return;
        }

        const fetchedData = response.content;

        // Fetch and Set the Life Counter TEMPLATE that has the last
        // Life Counter MANAGER not yet finished
        // (user may reload from where he left...)
        const template = fetchedData.lifeCounterTemplate;
        self.LifeCounterTemplate = {
          LifeCounterTemplateId: template.lifeCounterTemplateId,
          LifeCounterTemplateName: template.lifeCounterTemplateName,
          PlayersStartingLifePoints: template.playersStartingLifePoints,
          PlayersCount: template.playersCount,
          FixedMaxLifePointsMode: template.fixedMaxLifePointsMode,
          PlayersMaxLifePoints: template.playersMaxLifePointsMode,
          AutoDefeatMode: template.autoDefeatMode,
          AutoEndMode: template.autoEndMode,
          LifeCounterManagersCount: template.lifeCounterManagersCount,
        };
        self.LifeCounterTemplates.push(self.LifeCounterTemplate);
        self.SetLifeCounterTemplates();

        // Fetch and Set the Life Counter MANAGER to be RELOADED
        const currentManager = {
          LifeCounterManagerId: fetchedData.lifeCounterManagerId,
          LifeCounterTemplateId: template.lifeCounterTemplateId,
          LifeCounterManagerName: template.lifeCounterManagerName,
          PlayersStartingLifePoints: template.playersStartingLifePoints,
          PlayersCount: template.playersCount,
          FixedMaxLifePointsMode: template.fixedMaxLifePointsMode,
          PlayersMaxLifePoints: template.playersMaxLifePoints,
          AutoDefeatMode: template.autoDefeatMode,
          AutoEndMode: template.autoEndMode,
          StartingTimeMark: template.startingTime,
          EndingTimeMark: null,
          Duration_minutes: null,
          IsFinished: false,
        };
        self.LifeCounterManager = currentManager;
        self.SetLifeCounterManager();

        // Fetch and set the Life Counter PLAYERS taking part on the
        // RELOADED Life Counter MANAGER...
        const players = fetchedData.lifeCounterPlayers;
        self.LifeCounter_CurrentPlayers = [];
        players.forEach((player) => {
          let currentPlayer = {
            LifeCounterManagerId: currentManager.LifeCounterManagerId,
            PlayerId: player.lifeCounterPlayerId,
            PlayerName: player.playerName,
            CurrentLifePoints: player.currentLifePoints,
            IsDefeated: false,
          };
          self.LifeCounter_CurrentPlayers.push(currentPlayer);
        });
        self.SetLifeCounter_CurrentPlayers();

        if (self.LifeCounterPlayers.length > 0) {
          self.LifeCounter_CurrentPlayers.forEach((current_player) => {
            for (let i = 0; i < self.LifeCounterPlayers.length; i++) {
              if (
                current_player.PlayerId == self.LifeCounterPlayers[i].PlayerId
              ) {
                self.LifeCounterPlayers[i] = current_player;
                self.SetLifeCounterPlayers();
              }
            }
          });
        }

        self.BuildLifeCounterManager();
      },
      error: function (xhr, status, error) {
        console.error("Error fetching life counter templates:", error);
        console.log("Status:", status);
        console.log("Response:", xhr.responseText);
        sweetAlertError("Failed to fetch life counter templates.");
      },
    });
  };

  self.StartLifeCounterManager = (lifeCounterTemplateId) => {
    const startDefaultLifeCounterManager = () => {
      if (!lifeCounterTemplateId) {
        self.LifeCounterTemplates = self.GetLifeCounterTemplates();
        self.LifeCounterTemplate = self.LifeCounterTemplates[0];
      }

      self.BuildLifeCounterManager();

      return;
    };

    const startUserLifeCounterManager = () => {
      if (!lifeCounterTemplateId) {
        self.GetUserLastLifeCounterManager();
        return;
      }

      self.GetUserLifeCounterTemplate(lifeCounterTemplateId);
      return;
    };

    if (self.IsUserLoggedIn === false) {
      startDefaultLifeCounterManager();
      return;
    }
    startUserLifeCounterManager();
  };

  self.OrganizeSits = (lifeCountersCount) => {
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

  self.BuildLifeCounterManager = () => {
    const templates = self.GetLifeCounterTemplates();
    const current_template = templates[0];
    const managers = current_template.LifeCounterManagers;
    const current_manager = managers[0];
    const players = current_manager.LifeCounterPlayers;

    self.Fields.LifeCounterManagerName.html(
      `<span>${current_manager.LifeCounterManagerName}</span>`
    );

    self.Fields.ShowDuration.html("");

    self.Fields.ShowDurationWrapper.addClass("d-none");

    self.Buttons.SetUpLifeCounter.removeClass("d-none");

    for (let i = 0; i < current_manager.PlayersCount; i++) {
      self.LifeCounterInstances[i]
        .find(self.Fields.PlayerName)
        .html(`${players[i].PlayerName}`);

      self.LifeCounterInstances[i]
        .find(self.Fields.PlayerCurrentLifePoints)
        .html(`${players[i].CurrentLifePoints}`);
    }

    self.OrganizeSits(current_manager.PlayersCount);

    self.CheckForDefeatedPlayers();

    self.Buttons.ChangeLifeCounterTemplate.text(
      current_template.LifeCounterTemplateName
    );
    self.Buttons.ChangeLifeCounterTemplate.attr(
      "data-template-id",
      current_template.LifeCounterTemplateId
    );

    $("body").loadpage("demolish");
  };

  self.IncreaseLifePoints = (playerIndex, amountToIncrease) => {
    self.previousPlayerIndexes.push(playerIndex);

    const arrayLength = self.previousPlayerIndexes.length;

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

    self.LifeCounterPlayers = self.GetLifeCounterPlayers();
    const player = self.LifeCounterPlayers[playerIndex];

    let updatedLifePoints = player.CurrentLifePoints + amountToIncrease;

    if (updatedLifePoints == self.LifeCounterManager.PlayersMaxLifePoints) {
      return;
    }

    player.CurrentLifePoints = updatedLifePoints;
    self.SetLifeCounterPlayers();

    self.PlayerBlocks[playerIndex]
      .find(self.Fields.PlayerCurrentLifePoints)
      .text(updatedLifePoints);

    showIncreasingAmount(amountToIncrease);
  };
  self.DecreaseLifePoints = (playerIndex, amountToDecrease) => {
    self.previousPlayerIndexes.push(playerIndex);

    const arrayLength = self.previousPlayerIndexes.length;

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

    self.LifeCounterPlayers = self.GetLifeCounterPlayers();
    const player = self.LifeCounterPlayers[playerIndex];

    let updatedLifePoints = player.CurrentLifePoints - amountToDecrease;

    self.GetLifeCounterManager();
    if (
      updatedLifePoints <= 0 &&
      self.LifeCounterManager.AutoDefeatMode == true
    ) {
      self.Fields.LifePointsDynamicBehavior.text("");
      self.increasingPointsCounter = 0;
      self.decreasingPointsCounter = 0;

      self.CheckForPlayerDefeated(playerIndex, updatedLifePoints);
      return;
    }

    if (
      self.LifeCounterManager.AutoDefeatMode == true &&
      player.IsDefeated == true
    ) {
      return;
    }

    player.CurrentLifePoints = updatedLifePoints;
    self.SetLifeCounterPlayers();

    self.PlayerBlocks[playerIndex]
      .find(self.Fields.PlayerCurrentLifePoints)
      .text(updatedLifePoints);

    showDecreasingAmount(amountToDecrease);
  };

  self.CheckForPlayerDefeated = (playerId) => {
    const templates = self.GetLifeCounterTemplates();
    const current_template = templates[0];
    const managers = current_template.LifeCounterManagers;
    const current_manager = managers[0];
    const players = current_manager.LifeCounterPlayers;

    let playerIndex = players.findIndex(
      (player) => player.PlayerId == playerId
    );

    const player = players[playerIndex];

    const playerName = player.PlayerName;

    // Get player name or current life from DOM if needed
    const playerBlock = self.PlayerBlocks[playerIndex];
    const playerNameField = playerBlock.find(self.Fields.PlayerName);
    const playerAlternativeNameField = playerBlock.find(
      self.Fields.AlternativeName
    );

    const currentLifePointsField = playerBlock.find(
      self.Fields.PlayerCurrentLifePoints
    );

    const increaseLifePointsBtn = playerBlock.find(
      self.Buttons.IncreaseLifePoints
    );

    const decreaseLifePointsBtn = playerBlock.find(
      self.Buttons.DecreaseLifePoints
    );

    const restorePlayerBtn = playerBlock.find(self.Buttons.RestorePlayer);

    const markAsDefeated = () => {
      player.IsDefeated = true;

      // Se falhar, descomentar a linha abaixo...
      //self.LifeCounter_CurrentPlayers[playerIndex] = player;
      self.SetLifeCounter_CurrentPlayers();

      const index = self.LifeCounterPlayers.findIndex(
        (Player) => Player.PlayerId === player.PlayerId
      );
      self.LifeCounterPlayers[index] = player;
      self.SetLifeCounterPlayers();

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

    if (player.CurrentLifePoints <= 0) {
      markAsDefeated();

      if (self.LifeCounterManager.AutoEndMode === true) {
        self.CheckForLifeCounterEnd();
      }
    }
  };
  self.CheckForDefeatedPlayers = () => {
    // self.LifeCounter_CurrentPlayers = self.GetLifeCounter_CurrentPlayers();
    // const players = self.LifeCounter_CurrentPlayers;

    const templates = self.GetLifeCounterTemplates();
    const current_template = templates[0];
    const managers = current_template.LifeCounterManagers;
    const current_manager = managers[0];
    const players = current_manager.LifeCounterPlayers;

    players.forEach((player) => {
      self.CheckForPlayerDefeated(player.PlayerId);
    });
  };
  self.CheckForLifeCounterEnd = () => {
    self.LifeCounterManager = self.GetLifeCounterManager();
    self.LifeCounterPlayers = self.GetLifeCounterPlayers();

    let playersCount = self.LifeCounterManager.PlayersCount;
    let defeatedPlayersCount = self.LifeCounterPlayers.filter(
      (player) => player.IsDefeated == true
    ).length;

    let lifeCounterLength = "";

    if (defeatedPlayersCount == 0 || playersCount - defeatedPlayersCount > 1) {
      return;
    }

    self.LifeCounterManager.IsFinished = true;
    self.LifeCounterManager.EndingTimeMark = Date.now();
    self.LifeCounterManager.Duration_minutes =
      (self.LifeCounterManager.EndingTimeMark -
        self.LifeCounterManager.StartingTimeMark) /
      60000;

    lifeCounterLength =
      self.LifeCounterManager.Duration_minutes.toFixed(1).replace(".", ",") +
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

    self.SetLifeCounterManager();
    self.SetLifeCounterPlayers();

    self.Buttons.SetUpLifeCounter.addClass("d-none");
    self.Fields.ShowDurationWrapper.removeClass("d-none");
    self.Fields.ShowDuration.html(lifeCounterLength);

    self.Buttons.RestorePlayer.attr("disabled", true).addClass("d-none");
  };

  self.RestorePlayer = (playerIndex) => {
    self.LifeCounter_CurrentPlayers = self.GetLifeCounter_CurrentPlayers();

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

    self.LifeCounterManager = self.GetLifeCounterManager();
    self.LifeCounterManager.StartingTimeMark = Date.now();
    self.LifeCounterManager.EndingTimeMark = null;
    self.LifeCounterManager.Duration_minutes = null;
    self.LifeCounterManager.IsFinished = false;
    self.SetLifeCounterManager();

    self.LifeCounter_CurrentPlayers = self.GetLifeCounter_CurrentPlayers();
    for (let i = 0; i < self.LifeCounterManager.PlayersCount; i++) {
      self.LifeCounter_CurrentPlayers[i].CurrentLifePoints =
        self.LifeCounterManager.PlayersStartingLifePoints;

      self.LifeCounter_CurrentPlayers[i].IsDefeated = false;

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

      self.PlayerBlocks[i]
        .find(self.Fields.PlayerCurrentLifePoints)
        .val(self.LifeCounterManager.PlayersStartingLifePoints)
        .removeClass("markAsWinner markAsLooser");

      self.PlayerBlocks[i].find(self.Fields.LifePointsDynamicBehavior).html("");
    }
    self.SetLifeCounterManager();

    self.DOM.find("button").attr("disabled", false);

    self.Buttons.RestorePlayer.attr("disabled", true).addClass("d-none");

    self.BuildLifeCounterManager();

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

    self.LifeCounterTemplates = self.GetLifeCounterTemplates();

    if (!self.LifeCounterTemplates) {
      self.StartLifeCounterManager(null);
    } else {
      if (self.IsUserLoggedIn == true) {
        self.GetUserLastLifeCounterManager();
        return;
      }

      self.BuildLifeCounterManager();
    }
  };

  self.CheckAuthenticationStatus();
}

$(function () {
  new lifecounter_manager();
});
