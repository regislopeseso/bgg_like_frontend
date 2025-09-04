function mab_battle() {
  let self = this;

  self.IsBuilt = false;

  self.IsPlayerTurn = true;

  self.BattleRound = null;
  self.BattleRoundsCount = 0;

  self.PlayerCards = [];
  self.PlayerDuellingCard_CardCopyId = null;
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

        self.PlayerDuellingCard_CardCopyId = card.mab_PlayerCardId;
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

      self.Battle_ExecutePlayerTurn();
    });

    self.Buttons.CancelDuellingCardChoice.on("click", (e) => {
      e.preventDefault();

      self.arena_buttons_SetUpForChosenCard_Off();

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
        self.Fields.DuelNumber.html(resp.content.mab_DuelNumber);

        self.IsPlayerTurn = resp.content.mab_IsPlayerTurn;

        self.battle_ShowContainer();

        self.sweetAlertSuccess("Battle started!");

        self.Battle_ListUnusedCards();
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

          self.Battle_ListUnusedCards();

          return;
        }

        self.battle_ShowContainer();

        self.Battle_ListUnusedCards();

        self.sweetAlertSuccess("Continuing Battle...");

        //self.Battle_Execute();
      },
      error: (err) => {
        self.sweetAlertError(err);
      },
      complete: () => {},
    });
  };
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

        self.battle_HideContainer();

        self.arena_ShowContainer();

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

        self.battle_RenderDuel(true);
      },
      error: function (xhr, status, error) {
        sweetAlertError(
          "Failed to fetch user available and assigned card copies. Try again later."
        );
      },
    });
  };

  self.Battle_ExecutePlayerTurn = () => {
    const formData = new FormData();
    if (!self.PlayerDuellingCard_CardCopyId) {
      self.PlayerDuellingCard_CardCopyId = null;
    }
    formData.append("Mab_PlayerCardId", self.PlayerDuellingCard_CardCopyId);

    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/mabexecutebattle",
      data: formData,
      processData: false,
      contentType: false,
      xhrFields: {
        withCredentials: true, // Only if you're using cookies; otherwise can be removed
      },
      success: (resp) => {
        if (!resp.content) {
          sweetAlertError(resp.message);
        }
        self.BattleRoundsCount++;

        let battleResult = resp.content.mab_BattleResult;
        let duelResult = resp.content.mab_DuelResult;
        self.PlayerDuellingCard_CardFullPower =
          resp.content.mab_PlayerCardFullPower;
        self.NpcDuellingCard_CardName = resp.content.mab_NpcCardName;
        self.NpcDuellingCard_CardLevel = resp.content.mab_NpcCardLevel;
        self.NpcDuellingCard_CardPower = resp.content.mab_NpcCardPower;
        self.NpcDuellingCard_CardUpperHand = resp.content.mab_NpcCardUpperHand;
        self.NpcDuellingCard_CardType = resp.content.mab_NpcCardType;
        self.NpcDuellingCard_CardFullPower = resp.content.mab_NpcCardFullPower;

        if (duelResult) {
          self.arena_NpcDuellingCard_Add();

          self.battle_RenderDuel(false, false);

          setTimeout(() => {
            self.arena_NpcDuellingCard_Remove();

            self.arena_PlayerDuellingCard_Remove();

            self.arena_NpcDuellingCard_Add(self.NpcDuellingCard_CardFullPower);

            self.arena_PlayerDuellingCard_Add(
              self.PlayerDuellingCard_CardFullPower
            );
            self.Fields.BattlePoints.html(duelResult);

            self.battle_RenderDuel(false, true);
          }, 2000);

          $(() => {
            self.DOM.find(".chosen-card").addClass("used-card");
          });

          return;
        }
      },
      error: (err) => {
        sweetAlertError(err);
      },
    });
  };
  self.Battle_ExecuteNpcTurn = () => {
    const formData = new FormData();
    formData.append("Mab_PlayerCardId", null);

    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/mabexecutebattle",
      data: formData,
      processData: false,
      contentType: false,
      xhrFields: {
        withCredentials: true, // Only if you're using cookies; otherwise can be removed
      },
      success: (resp) => {
        if (!resp.content) {
          sweetAlertError(resp.message);
        }

        let battleResult = resp.content.mab_BattleResult;
        let duelResult = resp.content.mab_DuelResult;
        let playerCard_FullPower = resp.content.mab_PlayerCardFullPower;
        let npcCard_Name = resp.content.mab_NpcCardName;
        let npcCard_Level = resp.content.mab_NpcCardLevel;
        let npcCard_Power = resp.content.mab_NpcCardPower;
        let npcCard_UpperHand = resp.content.mab_NpcCardUpperHand;
        let npcCard_Type = resp.content.mab_NpcCardType;
        let npcCard_FullPower = resp.content.mab_NpcCardFullPower;

        if (duelResult) {
          self.arena_NpcDuellingCard_Add(npcCard_FullPower);

          self.arena_PlayerDuellingCard_Remove();
          self.arena_PlayerDuellingCard_Add(playerCard_FullPower);

          self.Fields.BattlePoints.html(duelResult);
        }

        self.PlayerDuellingCard_CardFullPower = playerCard_FullPower;
        self.NpcDuellingCard_CardFullPower = npcCard_FullPower;
      },
      error: (err) => {
        sweetAlertError(err);
      },
    });
  };

  self.arena_buttons_SetUpForChosenCard_On = () => {
    self.Buttons.ConfirmDuellingCardChoice.css("opacity", "0");

    setTimeout(() => {
      self.Buttons.ConfirmDuellingCardChoice.css("opacity", "1")
        .text("Confirm")
        .prop("disabled", false);
    }, 300);

    self.Buttons.CancelDuellingCardChoice.prop("disabled", false);
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
  self.battle_RenderDuel = (isPlayerTurn, isDuelResolved) => {
    self.Fields.ArenaMessages.empty();

    if (isDuelResolved === true) {
      self.Fields.ArenaMessages.html(
        `Duel resolved, to continue press next duel`
      );

      let playerCardsClass = $(".button-mab-arena-assigned-player-cards");

      $(".button-mab-arena-assigned-player-cards")
        .removeClass("active-card")
        .addClass("frozen-card");

      self.Buttons.ConfirmDuellingCardChoice.text("Next Duel").prop(
        "disabled",
        false
      );

      self.Buttons.CancelDuellingCardChoice.text("Retreat").prop(
        "disabled",
        false
      );

      return;
    }

    if (isPlayerTurn === true) {
      self.Fields.ArenaMessages.html(`Player's Turn: please choose a card...`);

      let playerCardsClass = $(".button-mab-arena-assigned-player-cards");

      $(".button-mab-arena-assigned-player-cards")
        .removeClass("frozen-card")
        .addClass("active-card");

      self.Buttons.ConfirmDuellingCardChoice.prop("disabled", false);

      return;
    }

    self.Fields.BattlePoints.html("...");
    self.Fields.ArenaMessages.html(`NPC's Turn: a card is being chosen...`);
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
          self.arena_buttons_SetUpForChosenCard_On();
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

    console.log("cardFullPower: ", cardFullPower);
    let fullPowerValue =
      cardFullPower || cardFullPower === 0 ? cardFullPower : "?";
    console.log("fullPowerValue: ", fullPowerValue);

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
    self.PlayerDuellingCard_CardCopyId = null;
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
