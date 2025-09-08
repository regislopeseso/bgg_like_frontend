function mab_battle() {
  let self = this;

  self.IsBuilt = false;

  self.DuelsCount = null;
  self.IsPlayerTurn = null;
  self.AreTurnsFinished = null;
  self.IsDuelResolved = null;
  self.IsBattleFinished = null;

  self.NewDuelBegins = null; // remover

  self.BattleRound = null; // remover
  self.BattleRoundsCount = 0; // remover

  self.BattlePoints = 0;

  self.PlayerState = null;
  self.PlayerCards = [];
  self.PlayerDuellingCard_PlayerCardId = null;
  self.PlayerDuellingCard_CardName = null;
  self.PlayerDuellingCard_CardLevel = null;
  self.PlayerDuellingCard_CardType = null;
  self.PlayerDuellingCard_CardPower = null;
  self.PlayerDuellingCard_CardUpperHand = null;
  self.PlayerDuellingCard_CardFullPower = null;

  self.NpcDuellingCard_NpcCardId = null;
  self.NpcDuellingCard_CardName = null;
  self.NpcDuellingCard_CardLevel = null;
  self.NpcDuellingCard_CardType = null;
  self.NpcDuellingCard_CardPower = null;
  self.NpcDuellingCard_CardUpperHand = null;
  self.NpcDuellingCard_CardFullPower = null;

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
    self.Buttons[self.Buttons.length] =
      self.Buttons.ShowBattleContainer_NewBattle =
        self.Containers.ContinueCampaign.find(
          "#button-mab-battle-show-container-new"
        );
    self.Buttons[self.Buttons.length] =
      self.Buttons.ShowBattleContainer_ContinueBattle =
        self.Containers.ContinueCampaign.find(
          "#button-mab-battle-show-container-continue"
        );
    self.Buttons[self.Buttons.length] = self.Buttons.HideBattleContainer =
      self.Containers.Battle.find("#button-mab-battle-hide-container");
    self.Buttons[self.Buttons.length] = self.Buttons.HideArenaContainer =
      self.Containers.Arena.find("#button-mab-arena-hide-container");
    self.Buttons[self.Buttons.length] = self.Buttons.RetreatFromBattle =
      self.Containers.Arena.find("#button-mab-arena-retreat");
    self.Buttons[self.Buttons.length] = self.Buttons.TurnOnAutoMode =
      self.Containers.Arena.find("#button-mab-arena-auto-mode");
    self.Buttons[self.Buttons.length] = self.Buttons.ConfirmDuellingCardChoice =
      self.Containers.Arena.find("#button-mab-arena-confirm-card-choice");
    self.Buttons[self.Buttons.length] = self.Buttons.CancelDuellingCardChoice =
      self.Containers.Arena.find("#button-mab-arena-cancel-card-choice");

    self.Fields = [];
    self.Fields[self.Fields.length] = self.Fields.BattlePoints =
      self.Containers.Arena.find("#span-mab-arena-battle-points");
    self.Fields[self.Fields.length] = self.Fields.NpcName =
      self.Containers.Arena.find("#span-mab-arena-npc-name");
    self.Fields[self.Fields.length] = self.Fields.PlayerNickname =
      self.Containers.Arena.find("#span-mab-arena-player-nickname");
    self.Fields[self.Fields.length] = self.Fields.NpcDuellingCard =
      self.Containers.Arena.find("#div-mab-arena-npc-duelling-card");
    self.Fields[self.Fields.length] = self.Fields.DuelNumber =
      self.Containers.Arena.find("#span-mab-arena-round-counter");
    self.Fields[self.Fields.length] = self.Fields.ArenaMessages =
      self.Containers.Arena.find("#div-mab-arena-announcements");
    self.Fields[self.Fields.length] = self.Fields.PlayerDuellingCard =
      self.Containers.Arena.find("#div-mab-arena-player-duelling-card");

    self.Blocks = [];
    self.Blocks[self.Blocks.length] = self.Blocks.PlayerCards =
      self.Containers.Arena.find("#block-mab-arena-player-cards");
  };

  self.loadEvents = () => {
    self.Buttons.ShowBattleContainer_NewBattle.on("click", (e) => {
      e.preventDefault();

      self.Battle_Start();
    });

    self.Buttons.ShowBattleContainer_ContinueBattle.on("click", (e) => {
      e.preventDefault();

      self.Battle_Continue();
    });

    self.Buttons.HideBattleContainer.on("click", (e) => {
      e.preventDefault();

      self.battle_HideContainer();

      self.mainMenu_ShowContainer();
    });

    // Binding the event after inserting into DOM
    $(document).on(
      "click",
      ".button-mab-arena-assigned-player-cards",
      function () {
        let cardCopyId = $(this).data("card-copy-id");

        $(".mab-card-front").removeClass("active-card").addClass("frozen-card");

        $(this).removeClass("frozen-card").addClass("chosen-card");

        let card = self.PlayerCards.filter(
          (card) => card.mab_PlayerCardId === cardCopyId
        )[0];

        self.PlayerDuellingCard_PlayerCardId = card.mab_PlayerCardId;
        self.PlayerDuellingCard_CardName = card.mab_CardName;
        self.PlayerDuellingCard_CardLevel = card.mab_CardLevel;
        self.PlayerDuellingCard_CardType = card.mab_CardType;
        self.PlayerDuellingCard_CardPower = card.mab_CardPower;
        self.PlayerDuellingCard_CardUpperHand = card.mab_CardUpperHand;

        self.arena_PlayerDuellingCard_Add();
      }
    );

    self.Buttons.ConfirmDuellingCardChoice.on("click", (e) => {
      e.preventDefault();

      if (self.IsPlayerTurn === true) {
        self.Duel_PlayerAttacks();

        return;
      }

      self.Battle_NewDuel_NpcStarts();
    });

    self.Buttons.CancelDuellingCardChoice.on("click", (e) => {
      e.preventDefault();

      self.arena_Button_NextDuelToPass();

      self.arena_PlayerDuellingCard_Remove();

      self.clear_PlayerDuelCard();
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
      timer: 300,
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

  self.Battle_Start = () => {
    const formData = new FormData();
    formData.append("Mab_QuestId", 1);

    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/mabstartbattle",
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

        self.Fields.PlayerNickname.html(resp.content.mab_PlayerNickname);
        self.Fields.NpcName.html(resp.content.mab_NpcName);

        self.battle_HideContainer();
        self.arena_ShowContainer();

        self.Duel_Start();

        self.sweetAlertSuccess("Battle started!");
      },
      error: (err) => {
        self.sweetAlertError("Failed to start mab battle!");
      },
      complete: () => {},
    });
  };
  self.Battle_Continue = () => {
    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/mabcontinuebattle",
      xhrFields: {
        withCredentials: true, // Only if you're using cookies; otherwise can be removed
      },
      success: (resp) => {
        if (!resp.content) {
          self.sweetAlertError(resp.message);
          return;
        }

        let battle = resp.content;

        self.BattleRound = battle.mab_BattleRoundNumber;
        self.IsPlayerTurn = battle.mab_IsPlayerTurn;

        self.Fields.BattlePoints.html(battle.mabBattlePoints);
        self.Fields.PlayerNickname.html(battle.playerNickName);
        self.Fields.NpcName.html(battle.mabNpcName);
        self.Fields.DuelNumber.html(resp.content.mabBattleRoundNumber);

        if (self.IsPlayerTurn === false && battle.mabNpcCard) {
          self.IsPlayerTurn = true;

          let npcDuellingCard = battle.mabNpcCard;

          self.NpcDuellingCard_NpcCardId = npcDuellingCard.mabNpcCardId;
          self.NpcDuellingCard_CardName = npcDuellingCard.mabCardName;
          self.NpcDuellingCard_CardLevel = npcDuellingCard.mabCardLevel;
          self.NpcDuellingCard_CardType = npcDuellingCard.mabCardType;
          self.NpcDuellingCard_CardPower = npcDuellingCard.mabCardPower;
          self.NpcDuellingCard_CardUpperHand = npcDuellingCard.mabCardUpperHand;

          self.arena_NpcDuellingCard_Add();

          return;
        }

        self.sweetAlertSuccess("Continuing Battle...");
      },
      error: (err) => {
        self.sweetAlertError(err);
      },
      complete: () => {},
    });
  };
  self.Battle_Finish = () => {};

  self.Battle_ListUnusedCards = () => {
    self.Blocks.PlayerCards.empty();

    $.ajax({
      type: "GET",
      url: "https://localhost:7081/users/mablistunusedcards",
      xhrFields: { withCredentials: true },
      success: function (response) {
        if (!response.content) {
          sweetAlertError("Error", response.message);
          return;
        }

        self.PlayerCards = response.content;

        self.PlayerCards.forEach((card, index) => {
          let cardHtml = `
              <button
                class="btn d-flex flex-column mab-card-front button-mab-arena-assigned-player-cards frozen-card"
                type="button"
                data-card-copy-id="${card.mab_PlayerCardId}"
                >

                <div class="d-flex flex-row justify-content-between align-items-center w-100">
                  <span>${card.mab_CardName}</span>
                  <span>${card.mab_CardLevel}</span>
                </div>

                <div class="d-flex flex-row justify-content-center align-items-center">
                  <span>${card.mab_CardType}</span>

                </div>

                <div class="d-flex flex-row justify-content-between align-items-center w-100">
                  <div>
                    <span>${card.mab_CardPower}</span>

                    |

                    <span>${card.mab_CardUpperHand}</span>
                  </div>

                  <span id="span-mab-arena-player-${index}-card-total-power">?</span>
                </div>
              </button>
            `;

          self.Blocks.PlayerCards.append(cardHtml);
        });
      },
      error: function (xhr, status, error) {
        sweetAlertError(
          "Failed to fetch user available and assigned card copies. Try again later."
        );
      },
    });
  };

  self.Duel_Start = () => {
    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/mabstartduel",
      xhrFields: {
        withCredentials: true, // Only if you're using cookies; otherwise can be removed
      },
      success: (resp) => {
        if (!resp.content) {
          self.sweetAlertError(resp.message);
          return;
        }

        self.IsPlayerTurn = resp.content.mab_IsPlayerAttacking;

        self.PlayerState = resp.content.mab_PlayerState;

        self.Duel_CheckStatus();
      },
      error: (err) => {
        self.sweetAlertError("Failed to start mab battle!");
      },
      complete: () => {},
    });
  };
  self.Duel_CheckStatus = () => {
    $.ajax({
      type: "GET",
      url: "https://localhost:7081/users/mabcheckduelstatus",
      xhrFields: { withCredentials: true },
      success: function (resp) {
        if (!resp.content) {
          sweetAlertError("Error", response.message);
          return;
        }

        self.DuelsCount = resp.content.mab_DuelsCount;
        self.IsPlayerTurn = resp.content.mab_IsPlayerTurn;
        self.AreTurnsFinished = resp.content.mab_AreTurnsFinished;
        self.IsDuelResolved = resp.content.mab_IsDuelResolved;
        self.IsBattleFinished = resp.content.mab_IsBattleFinished;

        self.battle_RenderDuel();
      },
      error: function (xhr, status, error) {
        sweetAlertError(
          "Failed to fetch user available and assigned card copies. Try again later."
        );
      },
    });
  };
  self.Duel_Resolve = () => {};
  self.Duel_PlayerAttacks = () => {
    self.Buttons.forEach((button) => button.prop("disabled", true));

    const formData = new FormData();
    formData.append("Mab_PlayerCardId", self.PlayerDuellingCard_PlayerCardId);

    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/mabplayerattacks",
      data: formData,
      processData: false,
      contentType: false,
      xhrFields: {
        withCredentials: true, // Only if you're using cookies; otherwise can be removed
      },
      success: (resp) => {
        self.Buttons.forEach((button) => button.prop("disabled", true));

        if (!resp.content) {
          sweetAlertError(resp.message);

          return;
        }

        self.Duel_ManageTurn();
      },
      error: (err) => {
        sweetAlertError(err);
      },
    });
  };
  self.Duel_PlayerPasses = () => {};
  self.Duel_PlayerRetreats = () => {};
  self.Duel_NpcAttacks = () => {
    self.arena_NpcDuellingCard_Remove();
    self.arena_PlayerDuellingCard_Remove();

    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/mabnpcattacks",
      xhrFields: {
        withCredentials: true,
      },
      success: (resp) => {
        if (!resp.content) {
          sweetAlertError(resp.message);
        }

        self.NpcDuellingCard_CardName = resp.content.mab_CardName;
        self.NpcDuellingCard_CardLevel = resp.content.mab_CardLevel;
        self.NpcDuellingCard_CardPower = resp.content.mab_CardPower;
        self.NpcDuellingCard_CardUpperHand = resp.content.mab_CardUpperHand;
        self.NpcDuellingCard_CardType = resp.content.mab_CardType;

        setTimeout(() => {
          self.arena_NpcDuellingCard_Add();

          self.Duel_ManageTurn();
        }, 1500);
      },
      error: (err) => {
        sweetAlertError(err);
      },
    });
  };

  self.Duel_ManageTurn = () => {
    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/mabmanageturn",
      xhrFields: {
        withCredentials: true, // Only if you're using cookies; otherwise can be removed
      },
      success: (resp) => {
        if (!resp.content) {
          self.sweetAlertError(resp.message);
          return;
        }

        self.Duel_CheckStatus();
      },
      error: (err) => {
        self.sweetAlertError("MAB MANAGE TURN Failed!");
      },
      complete: () => {},
    });
  };

  self.arena_Button_ConfirmMode = () => {
    self.arena_Button_RetreatToCancel();

    self.Buttons.ConfirmDuellingCardChoice.css("opacity", "0");

    setTimeout(() => {
      self.Buttons.ConfirmDuellingCardChoice.css("opacity", "1")
        .text("Confirm")
        .prop("disabled", false);
    }, 300);

    self.Buttons.CancelDuellingCardChoice.prop("disabled", false);
  };
  self.arena_Button_NextDuelMode = () => {
    self.arena_Button_CancelToRetreat();

    self.Buttons.ConfirmDuellingCardChoice.css("opacity", "0");

    setTimeout(() => {
      self.Buttons.ConfirmDuellingCardChoice.css("opacity", "1")
        .text("Next Duel")
        .prop("disabled", false);
    }, 300);
  };
  self.arena_Button_PassTurnMode = () => {
    self.arena_Button_CancelToRetreat();

    self.Buttons.ConfirmDuellingCardChoice.css("opacity", "0");

    setTimeout(() => {
      self.Buttons.ConfirmDuellingCardChoice.css("opacity", "1")
        .text("Pass")
        .prop("disabled", false);
    }, 300);
  };

  self.arena_Button_RetreatToCancel = () => {
    self.Buttons.CancelDuellingCardChoice.css("opacity", "0");

    setTimeout(() => {
      self.Buttons.CancelDuellingCardChoice.css("opacity", "1")
        .text("Cancel")
        .prop("disabled", false);
    }, 300);
  };
  self.arena_Button_CancelToRetreat = () => {
    self.Buttons.CancelDuellingCardChoice.css("opacity", "0");

    setTimeout(() => {
      self.Buttons.CancelDuellingCardChoice.css("opacity", "1")
        .text("Retreat")
        .prop("disabled", false);
    }, 300);
  };

  self.arena_buttons_SetUpForChosenCard_Off = () => {
    self.Buttons.ConfirmDuellingCardChoice.css("opacity", "0");

    setTimeout(() => {
      self.Buttons.ConfirmDuellingCardChoice.css("opacity", "1")
        .text("Pass")
        .prop("disabled", false);
    }, 300);

    self.Buttons.CancelDuellingCardChoice.prop("disabled", true);
  };
  self.battle_RenderDuel = () => {
    self.Fields.ArenaMessages.empty();

    // if (self.IsDuelResolved === true) {
    //   self.Fields.ArenaMessages.html(
    //     `Duel resolved, to continue press next duel`
    //   );

    //   let playerCardsClass = $(".button-mab-arena-assigned-player-cards");

    //   $(".button-mab-arena-assigned-player-cards")
    //     .removeClass("active-card")
    //     .addClass("frozen-card");

    //   self.Buttons.ConfirmDuellingCardChoice.text("Next Duel")
    //     .prop("disabled", false)
    //     .addClass("next-duel-mode");

    //   self.Buttons.CancelDuellingCardChoice.text("Retreat").prop(
    //     "disabled",
    //     false
    //   );

    //   return;
    // }

    // if (self.NewDuelBegins === true) {
    // }

    if (self.IsPlayerTurn === true) {
      self.Battle_ListUnusedCards();

      self.Fields.ArenaMessages.html(`Player's Turn: please choose a card...`);

      let playerCardsClass = $(".button-mab-arena-assigned-player-cards");

      $(".button-mab-arena-assigned-player-cards")
        .removeClass("frozen-card")
        .addClass("active-card");

      self.Buttons.ConfirmDuellingCardChoice.prop("disabled", false);

      self.arena_Button_PassTurnMode();

      return;
    }

    self.Fields.BattlePoints.html("...");
    self.Fields.ArenaMessages.html(`NPC's Turn: a card is being chosen...`);
    self.Duel_NpcAttacks();
  };

  self.arena_PlayerDuellingCard_Add = (cardFullPower) => {
    self.Fields.PlayerDuellingCard.empty();

    let fullPowerValue = cardFullPower ? cardFullPower : "?";

    let playerChosenCardCopyHtml = `
        <div class="d-flex flex-column justify-content-center align-items-center w-100 mab-card-front" >
          <div class="d-flex flex-row justify-content-between align-items-center w-100">
            <span>${self.PlayerDuellingCard_CardName}</span>
            <span>${self.PlayerDuellingCard_CardLevel}</span>
          </div>
          <div class="d-flex flex-row justify-content-center align-items-center">
            <span>${self.PlayerDuellingCard_CardType}</span>
          </div>
          <div class="d-flex flex-row justify-content-between align-items-center w-100">
            <div>
              <span>${self.PlayerDuellingCard_CardPower}</span>
              |
              <span >${self.PlayerDuellingCard_CardUpperHand}</span>
            </div>
            <span id="span-player-card-full-power">${fullPowerValue}</span>
          </div>
        </div>
      `;

    setTimeout(() => {
      self.Fields.PlayerDuellingCard.addClass("duelling-card");

      setTimeout(() => {
        if (!cardFullPower && cardFullPower != 0) {
          self.arena_Button_ConfirmMode();
        }
        self.Fields.PlayerDuellingCard.html(playerChosenCardCopyHtml);
      }, 100);
    }, 50);
  };
  self.arena_PlayerDuellingCard_Remove = () => {
    self.Fields.PlayerDuellingCard.empty().removeClass("duelling-card");

    $(".button-mab-arena-assigned-player-cards")
      .removeClass("chosen-card frozen-card")
      .addClass("active-card");
  };

  self.arena_NpcDuellingCard_Add = (cardFullPower) => {
    self.Fields.NpcDuellingCard.empty();

    let fullPowerValue =
      cardFullPower || cardFullPower === 0 ? cardFullPower : "?";

    let npcDuellingCardHtml = `
        <div class="d-flex flex-column justify-content-center align-items-center w-100 mab-card-front" >
          <div class="d-flex flex-row justify-content-between align-items-center w-100">
            <span>${self.NpcDuellingCard_CardName}</span>
            <span>${self.NpcDuellingCard_CardLevel}</span>
          </div>
          <div class="d-flex flex-row justify-content-center align-items-center">
            <span>${self.NpcDuellingCard_CardType}</span>
          </div>
          <div class="d-flex flex-row justify-content-between align-items-center w-100">
            <div>
              <span>${self.NpcDuellingCard_CardPower}</span>
              |
              <span >${self.NpcDuellingCard_CardUpperHand}</span>
            </div>
            <span id="span-npc-card-full-power">${fullPowerValue}</span>
          </div>
        </div>
      `;

    setTimeout(() => {
      self.Fields.NpcDuellingCard.addClass("duelling-card");

      setTimeout(() => {
        self.Fields.NpcDuellingCard.html(npcDuellingCardHtml);
      }, 100);
    }, 50);
  };
  self.arena_NpcDuellingCard_Remove = () => {
    self.Fields.NpcDuellingCard.empty().removeClass("duelling-card");
  };

  self.clear_PlayerDuelCard = () => {
    self.PlayerDuellingCard_PlayerCardId = null;
    self.PlayerDuellingCard_CardName = null;
    self.PlayerDuellingCard_CardLevel = null;
    self.PlayerDuellingCard_CardType = null;
    self.PlayerDuellingCard_CardPower = null;
    self.PlayerDuellingCard_CardUpperHand = null;
    self.PlayerDuellingCard_CardFullPower = null;
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
