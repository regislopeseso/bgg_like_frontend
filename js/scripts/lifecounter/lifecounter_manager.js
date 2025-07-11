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

  self.Current_LifeCounter_Template = [];
  self.Current_LifeCounter_Manager = [];
  self.Current_LifeCounter_Players = [];
  self.FirstPlayerIndex = null;

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

  self.SearchLocalStorageForLifeCounter = () => {
    if (localStorage.getItem("LifeCounterTemplates") != null) {
      self.LifeCounterTemplates = self.GetLifeCounterTemplates();
      self.Search_URL_Params_LifeCounterManagerId();
      return;
    }

    self.BuildDefaultLifeCounterTemplate();
  };
  self.Search_URL_Params_LifeCounterManagerId = () => {
    const managerId = new URLSearchParams(window.location.search).get(
      "LifeCounterManagerId"
    );

    if (managerId) {
      if (self.IsUserLoggedIn === true) {
        self.User_Get_LifeCounterManagerDetails(managerId);
        return;
      }
      // Sets the self.Current_LifeCounter_Template based on the managerId
      self.Current_LifeCounter_Template = self.LifeCounterTemplates.find(
        (template) =>
          template.LifeCounterManagers.find(
            (manager) => manager.LifeCounterManagerId == managerId
          )
      );

      // Sets the self.Current_LifeCounter_Manager based on the managerId
      self.Current_LifeCounter_Manager =
        self.Current_LifeCounter_Template.LifeCounterManagers.find(
          (manager) => manager.LifeCounterManagerId == managerId
        );

      // Sets the self.Current_LifeCounter_Players based on the managerId
      self.Current_LifeCounter_Players =
        self.Current_LifeCounter_Manager.LifeCounterPlayers;

      self.BuildLifeCounterManager();

      return;
    }

    const mostRecentManager = self.LifeCounterTemplates.flatMap(
      (template) => template.LifeCounterManagers
    ).reduce(
      (latest, current) =>
        current.StartingTime > (latest?.StartingTime ?? -Infinity)
          ? current
          : latest,
      null
    );

    if (!mostRecentManager) {
      if (self.IsUserLoggedIn === true) {
        self.User_QuickStart_LifeCounterManager();
        return;
      }
      self.Current_LifeCounter_Template =
        self.LifeCounterTemplates[self.LifeCounterTemplates.length - 1];

      self.BuildDefaultLifeCounterManager();

      return;
    }

    self.Current_LifeCounter_Template = self.LifeCounterTemplates.find(
      (template) =>
        template.LifeCounterTemplateId ==
        mostRecentManager.LifeCounterTemplateId
    );

    self.Current_LifeCounter_Manager = mostRecentManager;

    self.Current_LifeCounter_Players = mostRecentManager.LifeCounterPlayers;

    self.BuildLifeCounterManager();
  };

  self.BuildDefaultLifeCounterTemplate = () => {
    // Setting the commom parameters
    const playersStartingLifePoints = 10;
    const playersCount = 3;
    const fixedMaxLifePointsMode = true;
    const playersMaxLifePoints = 15;
    const autoDefeatMode = true;
    const autoEndMode = true;

    // Building a Default Life Counter TEMPLATE
    self.Current_LifeCounter_Template = [];
    const template_virtualId = "lct" + (self.LifeCounterTemplates.length + 1);
    self.Current_LifeCounter_Template = {
      LifeCounterTemplateId: template_virtualId,
      LifeCounterTemplateName: "Life Counter Template 1.",
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
    self.LifeCounterTemplates.push(self.Current_LifeCounter_Template);

    self.SetLifeCounterTemplates();

    self.BuildDefaultLifeCounterManager();
  };
  self.BuildDefaultLifeCounterManager = () => {
    const template = self.Current_LifeCounter_Template;

    self.Current_LifeCounter_Manager = [];

    // Setting the commom parameters
    const templateId = template.LifeCounterTemplateId;
    const manager_virtualId = "lcm" + (template.LifeCounterManagersCount + 1);
    const lifeCounterManagerName = `${template.LifeCounterTemplateName}M${
      template.LifeCounterManagersCount + 1
    }`;
    const playersStartingLifePoints = template.PlayersStartingLifePoints;
    const playersCount = template.PlayersCount;
    const firstPlayerIndex = Math.floor(Math.random() * template.PlayersCount);
    const fixedMaxLifePointsMode = template.FixedMaxLifePointsMode;
    const playersMaxLifePoints = template.PlayersMaxLifePoints;
    const autoDefeatMode = template.AutoDefeatMode;
    const autoEndMode = template.AutoEndMode;

    self.Current_LifeCounter_Manager = {
      LifeCounterTemplateId: templateId,
      LifeCounterManagerId: manager_virtualId,
      LifeCounterManagerName: lifeCounterManagerName,
      PlayersStartingLifePoints: playersStartingLifePoints,
      PlayersCount: playersCount,
      LifeCounterPlayers: [],
      FirstPlayerIndex: firstPlayerIndex,
      FixedMaxLifePointsMode: fixedMaxLifePointsMode,
      PlayersMaxLifePoints: playersMaxLifePoints,
      AutoDefeatMode: autoDefeatMode,
      AutoEndMode: autoEndMode,
      StartingTime: Date.now(),
      EndingTime: null,
      Duration_minutes: null,
      IsFinished: false,
    };
    // Updates Life Counter TEMPLATE -> Managers
    template.LifeCounterManagers.push(self.Current_LifeCounter_Manager);

    // Updates Life Counter TEMPLATE
    template.LifeCounterManagersCount++;

    self.SetLifeCounterTemplates();

    self.BuildDefaultLifeCounterPlayers();
  };
  self.BuildDefaultLifeCounterPlayers = () => {
    self.Current_LifeCounter_Players = [];

    const manager = self.Current_LifeCounter_Manager;

    // Setting the commom parameters
    const lifeCounterManagerId = manager.LifeCounterManagerId;
    const playersCount = 3;
    const playersStartingLifePoints = manager.PlayersStartingLifePoints;

    for (let i = 0; i < playersCount; i++) {
      const player_virtualId = "lcp" + (i + 1);
      let newPlayer = {
        LifeCounterManagerId: lifeCounterManagerId,
        PlayerId: player_virtualId,
        PlayerName: "Player " + (i + 1),
        CurrentLifePoints: playersStartingLifePoints,
        IsDefeated: false,
      };
      // Updates the global variable Life Counter CURRENT Players
      self.Current_LifeCounter_Players.push(newPlayer);
    }
    // Updates Life Counter TEMPLATE -> MANAGERS -> Players
    manager.LifeCounterPlayers = self.Current_LifeCounter_Players;

    // Updates Local Storage: Life Counter TEMPLATES >LIST<
    self.SetLifeCounterTemplates();

    self.BuildLifeCounterManager();
  };

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

    self.LifeCounterManagersDropDown = self.DOM.find(
      "#ul-change-lifeCounterManager"
    );
    self.lifeCounterManagerDropDownItems_class = ".lf-manager";
    self.LifeCounterManagerDropDownItems = self.DOM.find(
      self.lifeCounterManagerDropDownItems_class
    );

    //*
    //*
    //* PLAYER BLOCKS
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

    //*
    //*
    //* BUTTONS
    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.ChangeLifeCounterTemplate =
      self.DOM.find("#button-change-lifeCounterTemplate");
    self.Buttons[self.Buttons.length] = self.Buttons.NewLifeCounterTemplate =
      self.DOM.find("#button-new-lifeCounterTemplate");
    self.Buttons[self.Buttons.length] = self.Buttons.EditLifeCounterTemplate =
      self.DOM.find("#button-edit-LifeCounterTemplate");
    //
    self.Buttons[self.Buttons.length] = self.Buttons.SyncLifeCounterData_DB =
      self.DOM.find("#button-sync-DB-lifeCounter");
    self.Buttons[self.Buttons.length] = self.Buttons.ShowLifeCountersInfo =
      self.DOM.find("#button-showInfo-lifeCounter");
    //
    self.Buttons[self.Buttons.length] = self.Buttons.RefreshLifeCounter =
      self.DOM.find("#button-refresh-lifeCounterManager");
    self.Buttons[self.Buttons.length] = self.Buttons.ChangeLifeCounterManager =
      self.DOM.find("#button-change-lifeCounterManager");
    self.Buttons[self.Buttons.length] = self.Buttons.NewLifeCounterManager =
      self.DOM.find("#button-new-lifeCounterManager");
    self.Buttons[self.Buttons.length] = self.Buttons.EditLifeCounterManager =
      self.DOM.find("#button-setUp-lifeCounter");
    //
    self.Buttons[self.Buttons.length] = self.Buttons.AccessDiceThrower =
      self.DOM.find("#button-diceThrower-lifeCounter");
    self.DiceOptions = self.DOM.find("#dice-options");
    self.Buttons[self.Buttons.length] = self.Buttons.FourFacedDice =
      self.DOM.find("#btn-four-faced-dice");
    self.ImgFourFacedDice = self.DOM.find("#img-four-faced-dice");
    self.Buttons[self.Buttons.length] = self.Buttons.SixFacedDice =
      self.DOM.find("#btn-six-faced-dice");
    self.ImgSixFacedDice = self.DOM.find("#img-six-faced-dice");
    self.Buttons[self.Buttons.length] = self.Buttons.EightFacedDice =
      self.DOM.find("#btn-eight-faced-dice");
    self.ImgEightFacedDice = self.DOM.find("#img-eight-faced-dice");
    self.Buttons[self.Buttons.length] = self.Buttons.TenFacedDice =
      self.DOM.find("#btn-ten-faced-dice");
    self.ImgTenFacedDice = self.DOM.find("#img-ten-faced-dice");
    self.Buttons[self.Buttons.length] = self.Buttons.TwelveFacedDice =
      self.DOM.find("#btn-twelve-faced-dice");
    self.ImgTwelveFacedDice = self.DOM.find("#img-twelve-faced-dice");
    self.Buttons[self.Buttons.length] = self.Buttons.TwentyFacedDice =
      self.DOM.find("#btn-twenty-faced-dice");
    self.ImgTwentyFacedDice = self.DOM.find("#img-twenty-faced-dice");
    self.Buttons[self.Buttons.length] = self.Buttons.RedCounter =
      self.DOM.find("#red-counter");
    self.Buttons[self.Buttons.length] = self.Buttons.YellowCounter =
      self.DOM.find("#yellow-counter");
    self.Buttons[self.Buttons.length] = self.Buttons.GreenCounter =
      self.DOM.find("#green-counter");
    //
    self.Buttons[self.Buttons.length] = self.Buttons.CloseLifeCounter =
      self.DOM.find("#button-close-lifeCounter");
    //
    self.Buttons[self.Buttons.length] = self.Buttons.PlayerSetUp =
      self.DOM.find(".player-setup");
    self.Buttons[self.Buttons.length] = self.Buttons.IncreaseLifePoints =
      self.DOM.find(".increase-life-points");
    self.Buttons[self.Buttons.length] = self.Buttons.DecreaseLifePoints =
      self.DOM.find(".decrease-life-points");
    self.Buttons[self.Buttons.length] = self.Buttons.RestorePlayer =
      self.DOM.find(".restore-player");

    //*
    //*
    //* FIELDS
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
    self.Fields[self.Fields.length] = self.Fields.MaxLifePointsIndicator =
      self.DOM.find(".max-lifePoints-indicator");
    self.Fields[self.Fields.length] = self.Fields.DiceThrowResult =
      self.DOM.find("#dice-throw-result");

    //*
    //*
    //* LIFE COUNTER INSTANCES
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

    //*
    //*
    //* LOCATIONS
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
      self.Locations.LifeCounterManagerSetUp =
        "/html/lifecounter/lifecounter_manager_edit.html";
    self.Locations[self.Locations.length] =
      self.Locations.LifeCounterPlayerSetUp =
        "/html/lifecounter/lifecounter_player_edit.html";
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
  self.RedirectToLifeCounter_EditManager = (managerId) => {
    window.location.href = `${
      self.Locations.LifeCounterManagerSetUp
    }?LifeCounterManagerId=${encodeURIComponent(managerId)}`;
  };
  self.RedirectToLifeCounter_EditPlayer = (playerId) => {
    window.location.href = `${
      self.Locations.LifeCounterPlayerSetUp
    }?PlayerId=${encodeURIComponent(playerId)}`;
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
  function sweetAlertRollDice(diceImgHtml, result) {
    Swal.fire({
      position: "top",
      cancelButtonText: "close",
      theme: "bulma",
      background: "var(--bg-color)",

      text: result || "",
      showConfirmButton: true,
      html: `
      <div style="display: flex; flex-direction: column; align-items: center;">
        ${diceImgHtml}
        <h2 style="color: white; margin-top: 1rem;">Result: ${result}</h2>
      </div>
    `,
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

  function rollDice(diceType) {
    self.Fields.DiceThrowResult.html("").addClass("d-none");

    let faceType = "";
    switch (diceType) {
      case 4:
        faceType = "four";
        break;
      case 6:
        faceType = "six";
        break;
      case 8:
        faceType = "eight";
        break;
      case 10:
        faceType = "ten";
        break;
      case 12:
        faceType = "twelve";
        break;
      case 20:
        faceType = "twenty";
        break;
    }

    let img = `<img
                id="img-four-faced-dice"
                src="/images/icons/${faceType}_faced_dice.svg"
                style="width: 80px; height: 80px;"             
              />`;

    const roll = Math.floor(Math.random() * diceType) + 1;

    self.Fields.DiceThrowResult.removeClass("d-none").html(
      `D${diceType}: ${roll}`
    );

    sweetAlertRollDice(img, roll);
  }

  self.LoadEvents = () => {
    // Click to load Life Counter TEMPLATES in the drop down list
    self.Buttons.ChangeLifeCounterTemplate.on("click", (e) => {
      self.LoadLifeCounterTemplates();
    });

    // Selects a Life Counter TEMPLATE from the drop down list
    self.DOM.on(
      "click",
      self.lifeCounterTemplateDropDownItems_class,
      function (e) {
        e.preventDefault();

        let selectedTemplateName = $(this).text();
        let selectedTemplateId = $(this).data("template-id");

        self.Buttons.ChangeLifeCounterTemplate.text(selectedTemplateName);

        self.NewLifeCounterManager(selectedTemplateId);
      }
    );

    // Starts a New Life Counter TEMPLATE
    self.DOM.on("click", "#button-new-lifeCounterTemplate", function (e) {
      e.preventDefault();
      sweetAlertSuccess("Hey1");
    });

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

    $(function () {
      self.Buttons.ShowLifeCountersInfo.toggleClass(
        "d-none",
        !self.IsUserLoggedIn
      );
    });

    self.Buttons.RefreshLifeCounter.on("click", function () {
      self.RefreshLifeCounter();
    });

    // Click to load Life Counter MANAGERS in the drop down list
    self.Buttons.ChangeLifeCounterManager.on("click", (e) => {
      self.LoadLifeCounterManagers();
    });

    // Selects a Life Counter MANAGER from the drop down list
    self.DOM.on(
      "click",
      self.lifeCounterManagerDropDownItems_class,
      function (e) {
        e.preventDefault();

        let selectedManagerName = $(this)
          .find(".lifeCounter-ManagerName")
          .text();
        let selectedManagerId = $(this).data("manager-id");

        self.Buttons.ChangeLifeCounterManager.text(selectedManagerName);

        self.ReopenLifeCounterManager(selectedManagerId);
      }
    );

    // Starts a New Life Counter Manager
    self.DOM.on("click", "#button-new-lifeCounterManager", function (e) {
      e.preventDefault();

      self.NewLifeCounterManager(
        self.Current_LifeCounter_Template.LifeCounterTemplateId
      );
    });

    self.Buttons.EditLifeCounterManager.on("click", function (e) {
      e.preventDefault();

      const manager = self.Current_LifeCounter_Manager;

      self.RedirectToLifeCounter_EditManager(manager.LifeCounterManagerId);
    });

    self.Buttons.SyncLifeCounterData_DB.on("click", () => {});

    self.Buttons.AccessDiceThrower.on("click", function (e) {
      e.preventDefault();

      const $btn = self.Buttons.AccessDiceThrower;

      // Remove class if it was previously added (reset)
      $btn.removeClass("rotate-on-click");
      self.Fields.DiceThrowResult.html("").addClass("d-none");

      // Trigger reflow to restart animation
      void $btn[0].offsetWidth;

      // Add class to trigger rotation
      $btn.addClass("rotate-on-click");

      // Toggle dice options
      self.DiceOptions.toggleClass("d-none");
    });

    self.Buttons.FourFacedDice.hover(
      function () {
        self.ImgFourFacedDice.attr(
          "src",
          "/images/icons/four_faced_dice_hovered.svg"
        );
      },
      function () {
        self.ImgFourFacedDice.attr("src", "/images/icons/four_faced_dice.svg");
      }
    );
    self.Buttons.FourFacedDice.on("click", function (e) {
      e.preventDefault;

      rollDice(4);
    });
    self.Buttons.SixFacedDice.hover(
      function () {
        self.ImgSixFacedDice.attr(
          "src",
          "/images/icons/six_faced_dice_hovered.svg"
        );
      },
      function () {
        self.ImgSixFacedDice.attr("src", "/images/icons/six_faced_dice.svg");
      }
    );
    self.Buttons.SixFacedDice.on("click", function (e) {
      e.preventDefault;

      rollDice(6);
    });
    self.Buttons.EightFacedDice.hover(
      function () {
        self.ImgEightFacedDice.attr(
          "src",
          "/images/icons/eight_faced_dice_hovered.svg"
        );
      },
      function () {
        self.ImgEightFacedDice.attr(
          "src",
          "/images/icons/eight_faced_dice.svg"
        );
      }
    );
    self.Buttons.EightFacedDice.on("click", function (e) {
      e.preventDefault;

      rollDice(8);
    });
    self.Buttons.TenFacedDice.hover(
      function () {
        self.ImgTenFacedDice.attr(
          "src",
          "/images/icons/ten_faced_dice_hovered.svg"
        );
      },
      function () {
        self.ImgTenFacedDice.attr("src", "/images/icons/ten_faced_dice.svg");
      }
    );
    self.Buttons.TenFacedDice.on("click", function (e) {
      e.preventDefault;

      rollDice(10);
    });
    self.Buttons.TwelveFacedDice.hover(
      function () {
        self.ImgTwelveFacedDice.attr(
          "src",
          "/images/icons/twelve_faced_dice_hovered.svg"
        );
      },
      function () {
        self.ImgTwelveFacedDice.attr(
          "src",
          "/images/icons/twelve_faced_dice.svg"
        );
      }
    );
    self.Buttons.TwelveFacedDice.on("click", function (e) {
      e.preventDefault;

      rollDice(12);
    });
    self.Buttons.TwentyFacedDice.hover(
      function () {
        self.ImgTwentyFacedDice.attr(
          "src",
          "/images/icons/twenty_faced_dice_hovered.svg"
        );
      },
      function () {
        self.ImgTwentyFacedDice.attr(
          "src",
          "/images/icons/twenty_faced_dice.svg"
        );
      }
    );
    self.Buttons.TwentyFacedDice.on("click", function (e) {
      e.preventDefault;

      rollDice(20);
    });

    self.Buttons.RedCounter.on("mousedown touchstart", () => {
      let currentValue = parseInt(self.Buttons.RedCounter.text(), 10);
      let holdTimer;
      let intervalId;
      let isHeld = false;

      // Start a timer: if held > 500ms, start continuous +10
      holdTimer = setTimeout(() => {
        isHeld = true;
        currentValue--;
        self.Buttons.RedCounter.text(currentValue);

        intervalId = setInterval(() => {
          currentValue--;
          self.Buttons.RedCounter.text(currentValue);
        }, 1000);
      }, 500);

      const stopIncreasing = () => {
        clearTimeout(holdTimer);
        clearInterval(intervalId);

        if (!isHeld) {
          // Short press, so just +1
          currentValue++;
          self.Buttons.RedCounter.text(currentValue);
        }

        isHeld = false;
        $(document).off("mouseup touchend", stopIncreasing);
      };

      $(document).on("mouseup touchend", stopIncreasing);
    });

    self.Buttons.YellowCounter.on("mousedown touchstart", () => {
      let currentValue = parseInt(self.Buttons.YellowCounter.text(), 10);
      let holdTimer;
      let intervalId;
      let isHeld = false;

      // Start a timer: if held > 500ms, start continuous +10
      holdTimer = setTimeout(() => {
        isHeld = true;
        currentValue--;
        self.Buttons.YellowCounter.text(currentValue);

        intervalId = setInterval(() => {
          currentValue--;
          self.Buttons.YellowCounter.text(currentValue);
        }, 1000);
      }, 500);

      const stopIncreasing = () => {
        clearTimeout(holdTimer);
        clearInterval(intervalId);

        if (!isHeld) {
          // Short press, so just +1
          currentValue++;
          self.Buttons.YellowCounter.text(currentValue);
        }

        isHeld = false;
        $(document).off("mouseup touchend", stopIncreasing);
      };

      $(document).on("mouseup touchend", stopIncreasing);
    });

    self.Buttons.GreenCounter.on("mousedown touchstart", () => {
      let currentValue = parseInt(self.Buttons.GreenCounter.text(), 10);
      let holdTimer;
      let intervalId;
      let isHeld = false;

      // Start a timer: if held > 500ms, start continuous +10
      holdTimer = setTimeout(() => {
        isHeld = true;
        currentValue--;
        self.Buttons.GreenCounter.text(currentValue);

        intervalId = setInterval(() => {
          currentValue--;
          self.Buttons.GreenCounter.text(currentValue);
        }, 1000);
      }, 500);

      const stopIncreasing = () => {
        clearTimeout(holdTimer);
        clearInterval(intervalId);

        if (!isHeld) {
          // Short press, so just +1
          currentValue++;
          self.Buttons.GreenCounter.text(currentValue);
        }

        isHeld = false;
        $(document).off("mouseup touchend", stopIncreasing);
      };

      $(document).on("mouseup touchend", stopIncreasing);
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

      const player = self.Current_LifeCounter_Players[playerIndex];

      const playerId = player.PlayerId;

      self.RedirectToLifeCounter_EditPlayer(playerId);
    });

    self.Buttons.IncreaseLifePoints.on("mousedown touchstart", function (e) {
      e.preventDefault();

      const playerBlock = $(this).closest(".player-block");
      const playerIndex = $(".player-block:visible").index(playerBlock);
      const playerCurrentLifeElement = playerBlock.find(".player-lifepoints");
      const manager = self.Current_LifeCounter_Manager;

      let holdTimer;
      let intervalId;
      let isHeld = false;

      const fetchCurrentLife = () => {
        return parseInt(playerCurrentLifeElement.text().trim(), 10);
      };

      const showOrHideMaxIndicator = (currentLife) => {
        const reached =
          manager.FixedMaxLifePointsMode &&
          currentLife >= manager.PlayersMaxLifePoints;

        self.PlayerBlocks[playerIndex]
          .find(self.Fields.MaxLifePointsIndicator)
          .toggleClass("d-none", !reached);
      };

      const increaseLifePoints = (amount) => {
        let currentLife = fetchCurrentLife();

        if (
          manager.FixedMaxLifePointsMode &&
          currentLife >= manager.PlayersMaxLifePoints
        ) {
          return; // Don't increase past max
        }

        self.IncreaseLifePoints(playerIndex, amount);

        // Re-fetch life after increase to update UI
        currentLife = fetchCurrentLife();
        showOrHideMaxIndicator(currentLife);
      };

      // Check once on initial press
      showOrHideMaxIndicator(fetchCurrentLife());

      // Start long-press logic
      const evaluateIncreaseAmount = (desiredValue) => {
        currentLife = fetchCurrentLife();
        const fixedMaxLifePointsMode = manager.FixedMaxLifePointsMode;
        const playersMaxLifePoints = manager.PlayersMaxLifePoints;

        if (
          fixedMaxLifePointsMode &&
          currentLife + desiredValue >= playersMaxLifePoints
        ) {
          return playersMaxLifePoints - currentLife;
        } else {
          return desiredValue;
        }
      };
      holdTimer = setTimeout(() => {
        isHeld = true;
        let desiredValue = 10;

        let increasingAmount = evaluateIncreaseAmount(desiredValue);

        currentLife = fetchCurrentLife();

        increaseLifePoints(increasingAmount); // first +10

        intervalId = setInterval(() => {
          currentLife = fetchCurrentLife();

          increasingAmount = evaluateIncreaseAmount(desiredValue);

          increaseLifePoints(increasingAmount);
        }, 1000);
      }, 500);

      const stopIncreasing = () => {
        clearTimeout(holdTimer);
        clearInterval(intervalId);

        if (!isHeld) {
          increaseLifePoints(1); // short press
        }

        isHeld = false;
        $(document).off("mouseup touchend", stopIncreasing);
      };

      $(document).on("mouseup touchend", stopIncreasing);
    });

    self.Buttons.DecreaseLifePoints.on("mousedown touchstart", function (e) {
      e.preventDefault();

      const playerBlock = $(this).closest(".player-block");
      const playerIndex = $(".player-block:visible").index(playerBlock);
      const playerCurrentLifeElement = playerBlock.find(".player-lifepoints");

      const manager = self.Current_LifeCounter_Manager;
      const autoDefeatMode = manager.AutoDefeatMode;
      const fixedMaxLifePointsMode = manager.FixedMaxLifePointsMode;
      const playersMaxLifePoints = manager.PlayersMaxLifePoints;

      let holdTimer;
      let intervalId;
      let isHeld = false;

      const fetchCurrentLife = () => {
        return parseInt(playerCurrentLifeElement.text().trim(), 10);
      };

      const evaluateMaxLifePointsIndicator = (lifePoints) => {
        const isLifePointsMaxed =
          fixedMaxLifePointsMode && lifePoints >= playersMaxLifePoints;

        if (isLifePointsMaxed === false) {
          self.PlayerBlocks[playerIndex]
            .find(self.Fields.MaxLifePointsIndicator)
            .addClass("d-none");
        }
      };

      const evaluateDecreasingAmount = (desiredValue) => {
        currentLife = fetchCurrentLife();

        if (autoDefeatMode === true && currentLife - desiredValue <= 0) {
          // ex.:
          // current life = 9
          // desired value = 10
          // => return 9
          // =>=> new current life == 0
          return currentLife;
        } else {
          // ex.:
          // current life = 11
          // desired value = 10
          // => return 10
          // =>=> new current life == 1
          return desiredValue;
        }
      };

      const decreaseLifePoints = (amount) => {
        let currentLife = fetchCurrentLife();

        if (manager.AutoDefeatMode == true && currentLife <= 0) {
          return;
        }

        self.DecreaseLifePoints(playerIndex, amount);

        currentLife = fetchCurrentLife();
        evaluateMaxLifePointsIndicator(currentLife);
      };

      // Start a timer: if held > 500ms, start continuous -10
      holdTimer = setTimeout(() => {
        isHeld = true;
        let desiredValue = 10;

        let decreasingAmount = evaluateDecreasingAmount(desiredValue);

        currentLife = fetchCurrentLife();

        decreaseLifePoints(decreasingAmount); // first -10

        intervalId = setInterval(() => {
          currentLife = fetchCurrentLife();

          decreasingAmount = evaluateDecreasingAmount(desiredValue);

          decreaseLifePoints(decreasingAmount);
        }, 1000); // then every 1s
      }, 500);

      const stopDecreasing = () => {
        clearTimeout(holdTimer);
        clearInterval(intervalId);

        if (!isHeld) {
          let desiredValue = 1;
          // Short press, so just +1
          decreasingAmount = evaluateDecreasingAmount(desiredValue);
          decreaseLifePoints(decreasingAmount);
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
            <button id="button-new-lifeCounterTemplate" class="dropdown-item">NEW TEMPLATE</button>
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
        sweetAlertError("Failed to fetch life counter templates.");
      },
    });
  };
  self.LoadLifeCounterManagers = () => {
    self.LifeCounterManagersDropDown.html("");

    const buildDropDown = (lifeCounterManagers) => {
      function formatTimestampToDateString(msSinceEpoch) {
        const date = new Date(msSinceEpoch);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // month is 0-based
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      }

      lifeCounterManagers.forEach((lifeCounterManager) => {
        let date = lifeCounterManager.StartingDate;

        if (!date) {
          date = formatTimestampToDateString(lifeCounterManager.StartingTime);
        }

        let li = `
            <li class="li-change-lifeCounterManager"> 
               
              <a class="lf-manager dropdown-item d-flex flex-row align-items-center gap-1" 
              data-manager-id="${lifeCounterManager.LifeCounterManagerId}">
                ${date}
                <img src="/images/icons/io_arrow_right.svg" class="bi bi-arrow white-icon" />
                <div class="lifeCounter-ManagerName">${lifeCounterManager.LifeCounterManagerName}</div>
              </a>
            </li>
            `;
        self.LifeCounterManagersDropDown.append(li);
      });

      let createManagerBtn = `
        <li class="li-change-lifeCounterManager">  
            <hr />
        </li>

        <li class="li-change-lifeCounterManager">  
            <button id="button-new-lifeCounterManager" class="btn btn-outline-info dropdown-item">NEW MANAGER</button>
        </li>
        `;
      self.LifeCounterManagersDropDown.append(createManagerBtn);
    };

    if (self.IsUserLoggedIn === false) {
      const managers = self.Current_LifeCounter_Template.LifeCounterManagers;

      const unfinishedManagers = managers.filter(
        (manager) => manager.IsFinished == false
      );

      buildDropDown(unfinishedManagers);

      return;
    }

    $.ajax({
      type: "GET",
      url: `https://localhost:7081/users/listunfinishedlifecountermanagers`,
      xhrFields: { withCredentials: true },
      success: function (response) {
        if (response.content == null) {
          sweetAlertError(response.message);
          return;
        }

        const lifeCounterManagers = [];

        response.content.forEach((lifeCounterManager) => {
          lifeCounterManagers.push({
            LifeCounterManagerId: lifeCounterManager.lifeCounterManagerId,
            LifeCounterManagerName: lifeCounterManager.lifeCounterManagerName,
            StartingDate: lifeCounterManager.startingDate,
          });
        });

        buildDropDown(lifeCounterManagers);
      },
      error: function (xhr, status, error) {
        sweetAlertError("Failed to fetch life counter managers.");
      },
    });
  };
  self.ReopenLifeCounterManager = (lifeCounterManagerId) => {
    self.Current_LifeCounter_Manager = [];
    self.Current_LifeCounter_Players = [];

    const template = self.Current_LifeCounter_Template;

    self.Current_LifeCounter_Manager = template.LifeCounterManagers.find(
      (manager) => manager.LifeCounterManagerId == lifeCounterManagerId
    );

    if (self.IsUserLoggedIn === true) {
      self.User_Get_LifeCounterManagerDetails(lifeCounterManagerId);

      return;
    }

    self.Current_LifeCounter_Players = [];
    self.Current_LifeCounter_Players =
      self.Current_LifeCounter_Manager.LifeCounterPlayers;

    self.SetLifeCounterTemplates();

    self.BuildLifeCounterManager();
  };

  //! METHODS FOR USERS...
  self.User_GetLifeCounterTemplate = (templateId) => {
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
        self.Current_LifeCounter_Template = [];
        self.Current_LifeCounter_Template = {
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
        self.LifeCounterTemplates.push(self.Current_LifeCounter_Template);

        self.SetLifeCounterTemplates();

        self.User_StartLifeCounterManager(templateId);
      },
      error: function (xhr, status, error) {
        console.error("Error fetching board game details:", error);
      },
    });
  };
  self.User_StartLifeCounterManager = (templateId) => {
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
        self.Current_LifeCounter_Manager = [];
        self.Current_LifeCounter_Manager = {
          LifeCounterManagerId: manager.lifeCounterManagerId,
          LifeCounterTemplateId: manager.lifeCounterTemplateId,
          LifeCounterManagerName: manager.lifeCounterManagerName,
          PlayersStartingLifePoints: manager.playersStartingLifePoints,
          PlayersCount: manager.playersCount,
          FirstPlayerIndex: manager.firstPlayerIndex,
          FirstPlayerIndex: manager.firstPlayerIndex,
          FixedMaxLifePointsMode: manager.fixedMaxLifePointsMode,
          PlayersMaxLifePoints: manager.playersMaxLifePoints,
          AutoDefeatMode: manager.autoDefeatMode,
          AutoEndMode: manager.autoEndMode,
          StartingTime: Date.now(),
          EndingTime: null,
          Duration_minutes: null,
          IsFinished: false,
        };
        self.Current_LifeCounter_Template.LifeCounterManagers.push(
          self.Current_LifeCounter_Manager
        );

        self.FirstPlayerIndex =
          self.Current_LifeCounter_Manager.FirstPlayerIndex;

        let players = manager.lifeCounterPlayers;
        self.Current_LifeCounter_Players = [];
        players.forEach((player) => {
          let newPlayer = {
            LifeCounterManagerId: manager.lifeCounterManagerId,
            PlayerId: player.lifeCounterPlayerId,
            PlayerName: player.playerName,
            CurrentLifePoints: player.playerStartingLifePoints,
            IsDefeated: false,
          };

          self.Current_LifeCounter_Players.push(newPlayer);
        });

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

  self.User_QuickStart_LifeCounterManager = () => {
    $.ajax({
      type: "POST",
      url: `https://localhost:7081/users/quickstartlifecounter`,
      xhrFields: { withCredentials: true },
      success: function (response) {
        if (!response.content) {
          sweetAlertError(response.message);
          return;
        }

        const lifeCounterTemplateId = response.content.lifeCounterTemplateId;
        const lifeCounterManagerId = response.content.lifeCounterManagerId;
        self.User_Get_LifeCounterTemplateDetails(
          lifeCounterTemplateId,
          lifeCounterManagerId
        );
      },
      error: function (xhr, status, error) {
        sweetAlertError(
          "Failed to fetch requested LIFE COUNTER MANAGER DETAILS."
        );
      },
    });
  };
  self.User_Get_LifeCounterTemplateDetails = (
    lifeCounterTemplateId,
    lifeCounterManagerId
  ) => {
    // Fetch Life Counter Details based on provided LifeCounterId
    const id = lifeCounterTemplateId;

    $.ajax({
      type: "GET",
      url: `https://localhost:7081/users/getlifecountertemplatedetails?LifeCounterTemplateId=${id}`,
      xhrFields: { withCredentials: true },
      success: function (response) {
        if (!response.content) {
          sweetAlertError(response.message_text);
          return;
        }

        // Fetching LIFE COUNTER TEMPLATE
        const template = response.content;
        self.Current_LifeCounter_Template = {
          LifeCounterTemplateId: id,
          LifeCounterTemplateName: template.lifeCounterTemplateName,
          PlayersStartingLifePoints: template.playersStartingLifePoints,
          PlayersCount: template.playersCount,
          FixedMaxLifePointsMode: template.fixedMaxLifePointsMode,
          PlayersMaxLifePoints: template.playersMaxLifePoints,
          AutoDefeatMode: template.autoDefeatMode,
          AutoEndMode: template.autoEndMode,
          LifeCounterManagersCount: template.lifeCounterManagersCount,
          LifeCounterManagers: [],
        };

        self.LifeCounterTemplates.push(self.Current_LifeCounter_Template);

        if (lifeCounterManagerId) {
          self.User_Get_LifeCounterManagerDetails(lifeCounterManagerId);
        }
      },
      error: function (xhr, status, error) {
        sweetAlertError("Could not load life counter");
      },
    });
  };
  self.User_Get_LifeCounterManagerDetails = (lifeCounterManagerId) => {
    // Fetch Life Counter Details based on provided LifeCounterId
    const id = lifeCounterManagerId;

    $.ajax({
      type: "GET",
      url: `https://localhost:7081/users/getlifecountermanagerdetails?LifeCounterManagerId=${id}`,
      xhrFields: { withCredentials: true },
      success: function (response) {
        if (!response.content) {
          sweetAlertError(response.message_text);
          return;
        }

        let template = self.Current_LifeCounter_Template;

        console.log("template: ", template);

        if (!template || template.length == 0) {
          // Fetching LIFE COUNTER TEMPLATE
          template = response.content.lifeCounterTemplate;
          self.Current_LifeCounter_Template = {
            LifeCounterTemplateId: template.lifeCounterTemplateId,
            LifeCounterTemplateName: template.lifeCounterTemplateName,
            PlayersStartingLifePoints: template.playersStartingLifePoints,
            PlayersCount: template.playersCount,
            FixedMaxLifePointsMode: template.fixedMaxLifePointsMode,
            PlayersMaxLifePoints: template.playersMaxLifePoints,
            AutoDefeatMode: template.autoDefeatMode,
            AutoEndMode: template.autoEndMode,
            LifeCounterManagersCount: template.lifeCounterManagersCount,
            LifeCounterManagers: [],
          };
        }

        // Fetching LIFE COUNTER MANAGER
        const manager = response.content;
        self.Current_LifeCounter_Manager = {
          LifeCounterTemplateId: template.lifeCounterTemplateId,
          LifeCounterManagerId: id,
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

        self.Current_LifeCounter_Template.LifeCounterManagers.push(
          self.Current_LifeCounter_Manager
        );
        self.FirstPlayerIndex = manager.firstPlayerIndex;

        // Fetching LIFE COUNTER PLAYERS
        const players = manager.lifeCounterPlayers;
        self.Current_LifeCounter_Players = [];
        players.forEach((player) => {
          const newPlayer = {
            LifeCounterManagerId: id,
            PlayerId: player.playerId,
            PlayerName: player.playerName,
            CurrentLifePoints: player.currentLifePoints,
            IsDefeated: player.isDefeated,
          };
          self.Current_LifeCounter_Players.push(newPlayer);
        });

        self.Current_LifeCounter_Manager.LifeCounterPlayers =
          self.Current_LifeCounter_Players;

        self.BuildLifeCounterManager();
      },
      error: function (xhr, status, error) {
        sweetAlertError("Could not load life counter");
      },
    });
  };

  self.NewLifeCounterManager = (lifeCounterTemplateId) => {
    self.Current_LifeCounter_Manager = [];
    self.Current_LifeCounter_Players = [];

    const default_startLifeCounterManager = () => {
      if (!lifeCounterTemplateId) {
        self.LifeCounterTemplates = self.GetLifeCounterTemplates();
        const mostCurrentTemplate = self.LifeCounterTemplates.length - 1;
        self.Current_LifeCounter_Template =
          self.LifeCounterTemplates[mostCurrentTemplate];
      }

      self.BuildDefaultLifeCounterManager();

      return;
    };

    const user_startLifeCounterManager = () => {
      if (!lifeCounterTemplateId) {
        self.GetUserLastLifeCounterManager();
        return;
      }

      const templateId =
        self.Current_LifeCounter_Template.LifeCounterTemplateId;
      //self.User_GetLifeCounterTemplate(lifeCounterTemplateId);
      self.User_StartLifeCounterManager(templateId);
      return;
    };

    if (self.IsUserLoggedIn === false) {
      default_startLifeCounterManager();
      return;
    }

    user_startLifeCounterManager();
  };

  //? GENERIC METHODS...
  self.BuildLifeCounterManager = () => {
    const template = self.Current_LifeCounter_Template;
    const manager = self.Current_LifeCounter_Manager;
    const players = self.Current_LifeCounter_Players;

    self.Buttons.ChangeLifeCounterManager.text(manager.LifeCounterManagerName);

    self.Fields.ShowDuration.html("");

    self.Fields.ShowDurationWrapper.addClass("d-none");

    self.Buttons.EditLifeCounterManager.removeClass("d-none");

    for (let i = 0; i < manager.PlayersCount; i++) {
      self.LifeCounterInstances[i]
        .find(self.Fields.PlayerName)
        .html(`${players[i].PlayerName}`);

      self.LifeCounterInstances[i]
        .find(self.Fields.PlayerCurrentLifePoints)
        .html(`${players[i].CurrentLifePoints}`);
    }

    self.OrganizeSits(manager.PlayersCount);

    self.CheckForDefeatedPlayers();

    self.Buttons.ChangeLifeCounterTemplate.text(
      template.LifeCounterTemplateName
    );
    self.Buttons.ChangeLifeCounterTemplate.attr(
      "data-template-id",
      template.LifeCounterTemplateId
    );

    $("body").loadpage("demolish");
  };

  self.OrganizeSits = (lifeCountersCount) => {
    function resetPlayerBlock(block) {
      block.attr("style", ""); // Clear inline styles

      block.find("button .bi-dash-lg").removeClass("rotate-i");
      block
        .find(".playerstats")
        .removeClass("rotate-text-clockWise rotate-text-antiClockWise");

      block
        .find(self.Buttons.IncreaseLifePoints)
        .removeClass("increasePointsFlexRow increasePointsFlexColumn");
      block
        .find(self.Buttons.DecreaseLifePoints)
        .removeClass("decreasePointsFlexRow decreasePointsFlexColumn");
    }

    [
      self.PlayerBlocks.First,
      self.PlayerBlocks.Second,
      self.PlayerBlocks.Third,
      self.PlayerBlocks.Fourth,
      self.PlayerBlocks.Fifth,
      self.PlayerBlocks.Sixth,
    ].forEach(resetPlayerBlock);

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
        self.SetFirstPlayer();
        return ShowOneLifeCounter();
      case 2:
        self.SetFirstPlayer();
        return ShowTwoLifeCounters();
      case 3:
        self.SetFirstPlayer();
        return ShowThreeLifeCounters();
      case 4:
        self.SetFirstPlayer();
        return ShowFourLifeCounters();
      case 5:
        self.SetFirstPlayer();
        return ShowFiveLifeCounters();
      case 6:
        self.SetFirstPlayer();
        return ShowSixLifeCounters();
      default:
        self.SetFirstPlayer();
        return ShowOneLifeCounter();
    }
  };

  self.SetFirstPlayer = () => {
    const firstPlayerImg = (playerName) => `
    <div class="d-flex flex-row align-items-center gap-2">
      <img class="first-player-img" src="/images/first_player.png" />
      <div>${playerName}</div>
    </div>
  `;

    const manager = self.Current_LifeCounter_Manager;

    if (self.FirstPlayerIndex === undefined || self.FirstPlayerIndex === null) {
      self.FirstPlayerIndex = manager.FirstPlayerIndex;
    }

    const playerName = self.LifeCounterInstances[self.FirstPlayerIndex]
      .find(self.Fields.PlayerName)
      .text();

    // Inject image+name first
    self.LifeCounterInstances[self.FirstPlayerIndex]
      .find(self.Fields.PlayerName)
      .html(firstPlayerImg(playerName));

    // Apply rotation AFTER image is in DOM
    const $img =
      self.LifeCounterInstances[self.FirstPlayerIndex].find(
        ".first-player-img"
      );

    const rotate = (deg) => $img.css({ transform: `rotate(${deg}deg)` });

    switch (manager.PlayersCount) {
      case 1:
        self.FirstPlayerIndex = 0;
        break;
      case 2:
        if (self.FirstPlayerIndex == 1) rotate(0);
        break;
      case 3:
        if (self.FirstPlayerIndex == 1) rotate(90);
        else if (self.FirstPlayerIndex == 2) rotate(-90);
        break;
      case 4:
        if (self.FirstPlayerIndex == 0 || self.FirstPlayerIndex == 1)
          rotate(90);
        else rotate(-90);
        break;
      case 5:
        if (self.FirstPlayerIndex == 1 || self.FirstPlayerIndex == 2)
          rotate(90);
        else if (self.FirstPlayerIndex == 3 || self.FirstPlayerIndex == 4)
          rotate(-90);
        break;
      case 6:
        if (
          self.FirstPlayerIndex == 0 ||
          self.FirstPlayerIndex == 1 ||
          self.FirstPlayerIndex == 2
        )
          rotate(90);
        else rotate(-90);
        break;
      default:
        break;
    }
  };

  self.IncreaseLifePoints = (playerIndex, amountToIncrease) => {
    const manager = self.Current_LifeCounter_Manager;
    const players = self.Current_LifeCounter_Players;

    self.previousPlayerIndexes.push(playerIndex);

    const arrayLength = self.previousPlayerIndexes.length;

    if (self.previousPlayerIndexes[arrayLength - 2] != playerIndex) {
      self.increasingPointsCounter = 0;
    }

    const instantLifePoints = () => {
      player.CurrentLifePoints = updatedLifePoints;

      self.PlayerBlocks[playerIndex]
        .find(self.Fields.PlayerCurrentLifePoints)
        .text(updatedLifePoints);

      showIncreasingAmount(amountToIncrease);
    };

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

    const player = players[playerIndex];

    let updatedLifePoints = player.CurrentLifePoints + amountToIncrease;

    player.CurrentLifePoints = updatedLifePoints;

    if (self.IsUserLoggedIn === true) {
      const formData = new FormData();
      formData.append("LifeCounterPlayerId", player.PlayerId);
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
          }

          updatedLifePoints = resp.content.updatedLifePoints;
          player.CurrentLifePoints = updatedLifePoints;
        },
        error: (err) => {
          sweetAlertError(err);
        },
        complete: () => {
          //Re-enable all buttons
          self.Buttons.forEach((btn) => btn.prop("disabled", false));
        },
      });
    } else {
      self.SetLifeCounterTemplates();
    }

    instantLifePoints();
  };
  self.DecreaseLifePoints = (playerIndex, amountToDecrease) => {
    const manager = self.Current_LifeCounter_Manager;
    const players = self.Current_LifeCounter_Players;

    self.previousPlayerIndexes.push(playerIndex);

    const arrayLength = self.previousPlayerIndexes.length;

    if (self.previousPlayerIndexes[arrayLength - 2] != playerIndex) {
      self.decreasingPointsCounter = 0;
    }

    const instantLifePoints = () => {
      self.PlayerBlocks[playerIndex]
        .find(self.Fields.PlayerCurrentLifePoints)
        .text(updatedLifePoints);

      showDecreasingAmount(amountToDecrease);
    };

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

    const player = players[playerIndex];

    let updatedLifePoints = player.CurrentLifePoints - amountToDecrease;

    player.CurrentLifePoints = updatedLifePoints;

    if (manager.AutoDefeatMode === true && player.CurrentLifePoints <= 0) {
      self.CheckForPlayerDefeated(playerIndex);
    }

    if (self.IsUserLoggedIn === true) {
      const formData = new FormData();
      formData.append("LifeCounterPlayerId", player.PlayerId);
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
        },
        error: (err) => {
          sweetAlertError(err);
        },
        complete: () => {
          if (self.AutoDefeatMode == true) {
            self.CheckForPlayerDefeated(playerIndex, updatedLifePoints);
          }
        },
      });
    } else {
      self.SetLifeCounterTemplates();
    }

    if (manager.AutoDefeatMode === true && player.CurrentLifePoints <= 0) {
      self.CheckForPlayerDefeated(playerIndex);
    }

    instantLifePoints();
  };

  self.CheckForDefeatedPlayers = () => {
    const players = self.Current_LifeCounter_Players;

    let playerIndex = 0;
    players.forEach((player) => {
      self.CheckForPlayerDefeated(playerIndex);
      playerIndex++;
    });
  };
  self.CheckForPlayerDefeated = (playerId) => {
    const manager = self.Current_LifeCounter_Manager;
    const players = self.Current_LifeCounter_Players;

    const player = players[playerId];

    const playerName = player.PlayerName;

    // Get player name or current life from DOM if needed
    const playerBlock = self.PlayerBlocks[playerId];
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

      if (manager.AutoEndMode === true) {
        self.CheckForLifeCounterEnd();
      }
    }
  };
  self.CheckForLifeCounterEnd = () => {
    const manager = self.Current_LifeCounter_Manager;
    const players = self.Current_LifeCounter_Players;

    let playersCount = manager.PlayersCount;
    let defeatedPlayersCount = players.filter(
      (player) => player.IsDefeated === true
    ).length;

    if (defeatedPlayersCount == 0 || playersCount - defeatedPlayersCount > 1) {
      return;
    }

    manager.IsFinished = true;
    manager.EndingTime = Date.now();
    manager.Duration_minutes =
      (manager.EndingTime - manager.StartingTime) / 60_000;

    let rawDuration = null;
    let lifeCounterLength = "";

    const buildLifeCounterLength = (rawDuration) => {
      if (rawDuration == null || rawDuration < 0) {
        sweetAlertError("Invalid duration");
      } else {
        const totalSeconds = Math.floor(rawDuration * 60);
        const seconds = totalSeconds % 60;
        const totalMinutes = Math.floor(totalSeconds / 60);
        const minutes = totalMinutes % 60;
        const totalHours = Math.floor(totalMinutes / 60);
        const hours = totalHours % 24;
        const totalDays = Math.floor(totalHours / 24);
        const days = totalDays % 7;
        const totalWeeks = Math.floor(totalDays / 7);
        const weeks = totalWeeks % 4;
        const totalMonths = Math.floor(totalWeeks / 4);
        const months = totalMonths;

        // Handle the correct display based on specified ranges
        if (totalSeconds < 60) {
          // < 1 minute
          lifeCounterLength = `${totalSeconds} second${
            totalSeconds !== 1 ? "s" : ""
          }.`;
        } else if (totalMinutes < 61) {
          // 1 to 60 minutes
          lifeCounterLength = `${totalMinutes} minute${
            totalMinutes !== 1 ? "s" : ""
          } and ${seconds} second${seconds !== 1 ? "s" : ""}.`;
        } else if (totalHours < 25) {
          // > 60 minutes and < 25 hours
          lifeCounterLength = `${totalHours} hour${
            totalHours !== 1 ? "s" : ""
          } and ${minutes} minute${minutes !== 1 ? "s" : ""}.`;
        } else if (totalDays < 8) {
          // > 24 hours and < 8 days
          lifeCounterLength = `${totalDays} day${
            totalDays !== 1 ? "s" : ""
          } and ${hours} hour${hours !== 1 ? "s" : ""}.`;
        } else if (totalWeeks < 5) {
          // > 7 days and < 5 weeks
          lifeCounterLength = `${totalWeeks} week${
            totalWeeks !== 1 ? "s" : ""
          }, ${days} day${days !== 1 ? "s" : ""} and ${hours} hour${
            hours !== 1 ? "s" : ""
          }.`;
        } else if (months < 13) {
          // > 4 weeks and < 13 months
          lifeCounterLength = `${months} month${
            months !== 1 ? "s" : ""
          }, ${weeks} week${weeks !== 1 ? "s" : ""}, ${days} day${
            days !== 1 ? "s" : ""
          } and ${hours} hour${hours !== 1 ? "s" : ""}.`;
        } else {
          sweetAlertError("Error calculating duration");
          return;
        }

        const winnerIndex = players.findIndex(
          (player) => player.IsDefeated === false
        );

        const winnerName = players[winnerIndex].PlayerName;

        const winnerBlock = self.PlayerBlocks[winnerIndex];

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

        self.Fields.ShowDurationWrapper.removeClass("d-none");
        self.Fields.ShowDuration.html(lifeCounterLength);
      }
    };

    if (self.IsUserLoggedIn === true) {
      $.ajax({
        type: "GET",
        url: `https://localhost:7081/users/checkforlifecountermanagerend?LifeCounterManagerId=${manager.LifeCounterManagerId}`,
        xhrFields: { withCredentials: true },
        success: function (response) {
          if (response.content.isFinished === false) {
            return;
          }

          rawDuration = response.content.duration_minutes;
          buildLifeCounterLength(rawDuration);
        },
        error: function (xhr, status, error) {
          sweetAlertError("Could not load life counter");
        },
      });
    } else {
      rawDuration = manager.Duration_minutes;

      buildLifeCounterLength(rawDuration);
    }

    self.Buttons.EditLifeCounterManager.addClass("d-none");

    self.Buttons.RestorePlayer.attr("disabled", true).addClass("d-none");
  };

  self.RestorePlayer = (playerIndex) => {
    const player = self.Current_LifeCounter_Players[playerIndex];

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

    const playerName = player.PlayerName;
    const playerBlock = self.PlayerBlocks[playerIndex];
    const playerNameField = playerBlock.find(self.Fields.PlayerName);
    const playerAlternativeNameField = playerBlock.find(
      self.Fields.AlternativeName
    );
    const currentLifePointsField = playerBlock.find(
      self.Fields.PlayerCurrentLifePoints
    );

    player.CurrentLifePoints = 1;
    player.IsDefeated = false;

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

    if (self.IsUserLoggedIn === true) {
      const formData = new FormData();

      formData.append("LifeCounterPlayerId", player.PlayerId);

      $.ajax({
        type: "POST",
        url: "https://localhost:7081/users/restorelifecounterplayer",
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

          player.CurrentLifePoints = resp.content.updatedLifePoints;
        },
        error: (err) => {
          sweetAlertError(err);
        },
        complete: () => {
          //Re-enable all buttons
          self.Buttons.forEach((btn) => btn.prop("disabled", false));
        },
      });
    } else {
      self.SetLifeCounterTemplates();
    }

    showIncreasingAmount();
  };
  self.RefreshLifeCounter = () => {
    self.Buttons.EditLifeCounterManager.removeClass("d-none");
    self.Fields.ShowDurationWrapper.addClass("d-none");
    self.Fields.ShowDuration.html("");

    self.Buttons.RedCounter.text(0);
    self.Buttons.YellowCounter.text(0);
    self.Buttons.GreenCounter.text(0);

    self.PlayerBlocks.forEach((player) => {
      player.loadcontent("charge-contentloader");
    });

    self.previousPlayerIndexes = [];
    self.increasingPointsCounter = 0;
    self.decreasingPointsCounter = 0;

    const manager = self.Current_LifeCounter_Manager;
    const players = self.Current_LifeCounter_Players;

    const newFirstPlayer = Math.floor(Math.random() * manager.PlayersCount);
    self.FirstPlayerIndex = newFirstPlayer;

    manager.FirstPlayerIndex = newFirstPlayer;
    manager.StartingTime = Date.now();
    manager.EndingTime = null;
    manager.Duration_minutes = null;
    manager.IsFinished = false;

    for (let i = 0; i < manager.PlayersCount; i++) {
      players[i].CurrentLifePoints = manager.PlayersStartingLifePoints;

      players[i].IsDefeated = false;

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
        .val(manager.PlayersStartingLifePoints)
        .removeClass("markAsWinner markAsLooser");

      self.PlayerBlocks[i].find(self.Fields.LifePointsDynamicBehavior).html("");
    }

    if (self.IsUserLoggedIn === true) {
      const formData = new FormData();

      formData.append("LifeCounterManagerId", manager.LifeCounterManagerId);

      $.ajax({
        type: "POST",
        url: "https://localhost:7081/users/refreshlifecountermanager",
        data: formData,
        processData: false,
        contentType: false,
        xhrFields: {
          withCredentials: true,
        },
        success: (resp) => {
          if (resp.content === null) {
            sweetAlertError(resp.message);

            return;
          }

          self.BuildLifeCounterManager();
        },
        error: (err) => {
          sweetAlertError(err);
        },
        complete: () => {
          self.DOM.find("button").attr("disabled", false);

          self.Buttons.RestorePlayer.attr("disabled", true).addClass("d-none");

          self.PlayerBlocks.forEach((player) => {
            player.loadcontent("demolish-contentloader");
          });
        },
      });

      return;
    }

    self.SetLifeCounterTemplates();

    self.BuildLifeCounterManager();

    self.DOM.find("button").attr("disabled", false);
    self.Buttons.RestorePlayer.attr("disabled", true).addClass("d-none");

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

    if (self.IsUserLoggedIn === false) {
      self.SearchLocalStorageForLifeCounter();
      return;
    }

    self.Search_URL_Params_LifeCounterManagerId();
  };

  self.CheckAuthenticationStatus();
}

$(function () {
  new lifecounter_manager();
});
