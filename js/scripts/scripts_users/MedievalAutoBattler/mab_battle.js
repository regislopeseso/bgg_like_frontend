function mab_battle() {
  let self = this;

  self.IsBuilt = false;

  self.loadReferences = () => {
    self.DOM = $("#dom-medieval-auto-battler");

    self.MabContainersContent = self.DOM.find("#mab-containers-content");

    self.Containers = [];
    self.Containers[self.Containers.length] = self.Containers.ContinueCampaign =
      self.MabContainersContent.find("#container-mab-continue-campaign");
    self.Containers[self.Containers.length] = self.Containers.Battle =
      self.MabContainersContent.find("#container-mab-battle");
    self.Containers[self.Containers.length] = self.Containers.Arena =
      self.MabContainersContent.find("#container-mab-arena");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.ShowBattleContainer =
      self.Containers.ContinueCampaign.find(
        "#button-mab-battle-show-container"
      );
    self.Buttons[self.Buttons.length] = self.Buttons.HideBattleContainer =
      self.Containers.Battle.find("#button-mab-battle-hide-container");
    self.Buttons[self.Buttons.length] = self.Buttons.HideArenaContainer =
      self.Containers.Battle.find("#button-mab-arena--hide-container");

    self.Fields = [];
    self.Fields[self.Fields.length] = self.Fields.NpcName =
      self.Containers.Arena.find("#span-mab-arena-npc-name");
    self.Fields[self.Fields.length] = self.Fields.NpcChosenCard_Name =
      self.Containers.Arena.find("#span-mab-arena-npc-chosen-card-name");
    self.Fields[self.Fields.length] = self.Fields.NpcChosenCard_Level =
      self.Containers.Arena.find("#span-mab-arena-npc-chosen-card-level");
    self.Fields[self.Fields.length] = self.Fields.NpcChosenCard_Type =
      self.Containers.Arena.find("#span-mab-arena-npc-chosen-card-type");
    self.Fields[self.Fields.length] = self.Fields.NpcChosenCard_Power =
      self.Containers.Arena.find("#span-mab-arena-npc-chosen-card-power");
    self.Fields[self.Fields.length] = self.Fields.NpcChosenCard_UpperHand =
      self.Containers.Arena.find("#span-mab-arena-npc-chosen-card-upper-hand");

    self.Fields[self.Fields.length] = self.Fields.PlayerName =
      self.Containers.Arena.find("#span-mab-arena-player-name");
    self.Fields[self.Fields.length] = self.Fields.PlayerChosenCard_Name =
      self.Containers.Arena.find("#span-mab-arena-player-chosen-card-name");
    self.Fields[self.Fields.length] = self.Fields.PlayerChosenCard_Level =
      self.Containers.Arena.find("#span-mab-arena-player-chosen-card-level");
    self.Fields[self.Fields.length] = self.Fields.PlayerChosenCard_Type =
      self.Containers.Arena.find("#span-mab-arena-player-chosen-card-type");
    self.Fields[self.Fields.length] = self.Fields.PlayerChosenCard_Power =
      self.Containers.Arena.find("#span-mab-arena-player-chosen-card-power");
    self.Fields[self.Fields.length] = self.Fields.PlayerChosenCard_UpperHand =
      self.Containers.Arena.find(
        "#span-mab-arena-player-chosen-card-upper-hand"
      );

    self.Fields[self.Fields.length] = self.Fields.PlayerFirstCard_Name =
      self.Containers.Arena.find("#span-mab-arena-player-first-card-name");
    self.Fields[self.Fields.length] = self.Fields.PlayerFirstCard_Level =
      self.Containers.Arena.find("#span-mab-arena-player-first-card-level");
    self.Fields[self.Fields.length] = self.Fields.PlayerFirstCard_Type =
      self.Containers.Arena.find("#span-mab-arena-player-first-card-type");
    self.Fields[self.Fields.length] = self.Fields.PlayerFirstCard_Power =
      self.Containers.Arena.find("#span-mab-arena-player-first-card-power");
    self.Fields[self.Fields.length] = self.Fields.PlayerFirstCard_UpperHand =
      self.Containers.Arena.find(
        "#span-mab-arena-player-first-card-upper-hand"
      );

    self.Fields[self.Fields.length] = self.Fields.PlayerSecondCard_Name =
      self.Containers.Arena.find("#span-mab-arena-player-second-card-name");
    self.Fields[self.Fields.length] = self.Fields.PlayerSecondCard_Level =
      self.Containers.Arena.find("#span-mab-arena-player-second-card-level");
    self.Fields[self.Fields.length] = self.Fields.PlayerSecondCard_Type =
      self.Containers.Arena.find("#span-mab-arena-player-second-card-type");
    self.Fields[self.Fields.length] = self.Fields.PlayerSecondCard_Power =
      self.Containers.Arena.find("#span-mab-arena-player-second-card-power");
    self.Fields[self.Fields.length] = self.Fields.PlayerSecondCard_UpperHand =
      self.Containers.Arena.find(
        "#span-mab-arena-player-second-card-upper-hand"
      );

    self.Fields[self.Fields.length] = self.Fields.PlayerThirdCard_Name =
      self.Containers.Arena.find("#span-mab-arena-player-third-card-name");
    self.Fields[self.Fields.length] = self.Fields.PlayerThirdCard_Level =
      self.Containers.Arena.find("#span-mab-arena-player-third-card-level");
    self.Fields[self.Fields.length] = self.Fields.PlayerThirdCard_Type =
      self.Containers.Arena.find("#span-mab-arena-player-third-card-type");
    self.Fields[self.Fields.length] = self.Fields.PlayerThirdCard_Power =
      self.Containers.Arena.find("#span-mab-arena-player-third-card-power");
    self.Fields[self.Fields.length] = self.Fields.PlayerThirdCard_UpperHand =
      self.Containers.Arena.find(
        "#span-mab-arena-player-third-card-upper-hand"
      );

    self.Fields[self.Fields.length] = self.Fields.PlayerFourthCard_Name =
      self.Containers.Arena.find("#span-mab-arena-player-fourth-card-name");
    self.Fields[self.Fields.length] = self.Fields.PlayerFourthCard_Level =
      self.Containers.Arena.find("#span-mab-arena-player-fourth-card-level");
    self.Fields[self.Fields.length] = self.Fields.PlayerFourthCard_Type =
      self.Containers.Arena.find("#span-mab-arena-player-fourth-card-type");
    self.Fields[self.Fields.length] = self.Fields.PlayerFourthCard_Power =
      self.Containers.Arena.find("#span-mab-arena-player-fourth-card-power");
    self.Fields[self.Fields.length] = self.Fields.PlayerFourthCard_UpperHand =
      self.Containers.Arena.find(
        "#span-mab-arena-player-fourth-card-upper-hand"
      );

    self.Fields[self.Fields.length] = self.Fields.PlayerFifthCard_Name =
      self.Containers.Arena.find("#span-mab-arena-player-fifth-card-name");
    self.Fields[self.Fields.length] = self.Fields.PlayerFifthCard_Level =
      self.Containers.Arena.find("#span-mab-arena-player-fifth-card-level");
    self.Fields[self.Fields.length] = self.Fields.PlayerFifthCard_Type =
      self.Containers.Arena.find("#span-mab-arena-player-fifth-card-type");
    self.Fields[self.Fields.length] = self.Fields.PlayerFifthCard_Power =
      self.Containers.Arena.find("#span-mab-arena-player-fifth-card-power");
    self.Fields[self.Fields.length] = self.Fields.PlayerFifthCard_UpperHand =
      self.Containers.Arena.find(
        "#span-mab-arena-player-fifth-card-upper-hand"
      );
  };

  self.loadEvents = () => {
    self.Buttons.ShowBattleContainer.on("click", (e) => {
      e.preventDefault();

      self.Battle_TriggerStart();
    });
    self.Buttons.HideBattleContainer.on("click", (e) => {
      e.preventDefault();

      self.battle_HideContainer();

      self.mainMenu_ShowContainer();
    });
  };

  self.sweetAlertSuccess = (title_text, message_text) => {
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
  };
  self.sweetAlertError = (title_text, message_text) => {
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
        document.addEventListener("keydown", self.closeOnAnyKey);
      },
      willClose: () => {
        // Clean up listener when modal closes
        document.removeEventListener("keydown", self.closeOnAnyKey);
      },
    });
  };
  self.closeOnAnyKey = () => {
    Swal.close();
  };

  self.toggleContainerVisibility = (div) => {
    self.Containers.forEach((container) => {
      container.addClass("hide-div");
    });

    div.hasClass("show-div")
      ? div.removeClass("show-div").addClass("hide-div")
      : div.removeClass("hide-div").addClass("show-div");
  };
  self.battle_ShowContainer = () => {
    self.toggleContainerVisibility(self.Containers.Battle);
  };
  self.battle_HideContainer = () => {
    self.toggleContainerVisibility(self.Containers.Battle);
  };
  self.continueCampaign_HideContainer = () => {
    self.toggleContainerVisibility(self.Containers.ContinueCampaign);
  };

  self.arena_ShowContainer = () => {
    self.toggleContainerVisibility(self.Containers.Arena);
  };
  self.arena_HideContainer = () => {
    self.toggleContainerVisibility(self.Containers.Arena);
  };

  self.Battle_TriggerStart = () => {
    const formData = new FormData();
    formData.append("MabQuestId", 1);

    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/startmabbattle",
      data: formData,
      processData: false,
      contentType: false,
      xhrFields: {
        withCredentials: true, // Only if you're using cookies; otherwise can be removed
      },
      success: (resp) => {
        if (!resp.content) {
          self.sweetAlertError(resp.message);
          return;
        }

        self.Fields.NpcName = resp.content.mabNpcName;

        self.continueCampaign_HideContainer();

        self.battle_ShowContainer();

        self.sweetAlertSuccess("Battle started!");

        self.Battle_ListPlayerAvailableAssignedCardCopies();
      },
      error: (err) => {
        self.sweetAlertError(err);
      },
      complete: () => {},
    });
  };
  self.Battle_ListPlayerAvailableAssignedCardCopies = () => {
    $.ajax({
      type: "GET",
      url: "https://localhost:7081/users/listmabavailableroundcardcopies",
      xhrFields: { withCredentials: true },
      success: function (response) {
        if (!response.content) {
          sweetAlertError("Error", response.message);
          return;
        }

        self.battle_HideContainer();
        self.arena_ShowContainer();

        let playerCards = response.content;

        console.log("playerCards[1]:", playerCards[1]);

        self.Fields.PlayerFirstCard_Name.html(playerCards[0].mabCardName);
        self.Fields.PlayerFirstCard_Level.html(playerCards[0].mabCardLevel);
        self.Fields.PlayerFirstCard_Type.html(playerCards[0].mabCardType);
        self.Fields.PlayerFirstCard_Power.html(playerCards[0].mabCardPower);
        self.Fields.PlayerFirstCard_UpperHand.html(
          playerCards[0].mabCardUpperHand
        );

        self.Fields.PlayerSecondCard_Name.html(playerCards[1].mabCardName);
        self.Fields.PlayerSecondCard_Level.html(playerCards[1].mabCardLevel);
        self.Fields.PlayerSecondCard_Type.html(playerCards[1].mabCardType);
        self.Fields.PlayerSecondCard_Power.html(playerCards[1].mabCardPower);
        self.Fields.PlayerSecondCard_UpperHand.html(
          playerCards[1].mabCardUpperHand
        );

        self.Fields.PlayerThirdCard_Name.html(playerCards[2].mabCardName);
        self.Fields.PlayerThirdCard_Level.html(playerCards[2].mabCardLevel);
        self.Fields.PlayerThirdCard_Type.html(playerCards[2].mabCardType);
        self.Fields.PlayerThirdCard_Power.html(playerCards[2].mabCardPower);
        self.Fields.PlayerThirdCard_UpperHand.html(
          playerCards[2].mabCardUpperHand
        );

        self.Fields.PlayerFourthCard_Name.html(playerCards[3].mabCardName);
        self.Fields.PlayerFourthCard_Level.html(playerCards[3].mabCardLevel);
        self.Fields.PlayerFourthCard_Type.html(playerCards[3].mabCardType);
        self.Fields.PlayerFourthCard_Power.html(playerCards[3].mabCardPower);
        self.Fields.PlayerFourthCard_UpperHand.html(
          playerCards[3].mabCardUpperHand
        );

        self.Fields.PlayerFifthCard_Name.html(playerCards[4].mabCardName);
        self.Fields.PlayerFifthCard_Level.html(playerCards[4].mabCardLevel);
        self.Fields.PlayerFifthCard_Type.html(playerCards[4].mabCardType);
        self.Fields.PlayerFifthCard_Power.html(playerCards[4].mabCardPower);
        self.Fields.PlayerFifthCard_UpperHand.html(
          playerCards[4].mabCardUpperHand
        );
      },
      error: function (xhr, status, error) {
        sweetAlertError(
          "Failed to fetch user available and assigned card copies. Try again later."
        );
      },
    });
  };

  self.build = () => {
    if (self.IsBuilt === false) {
      self.IsBuilt = true;
    }
    self.loadReferences();
    self.loadEvents();
  };

  self.build();
}

$(function () {
  new mab_battle();
});
