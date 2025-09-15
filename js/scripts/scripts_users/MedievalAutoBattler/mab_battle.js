function mab_battle() {
  let self = this;

  self.IsBuilt = false;

  self.DuelsCount = null;
  self.IsPlayerTurn = null;
  self.IsPlayerDefending = null;
  self.AreTurnsFinished = null;
  self.IsDuelResolved = null;
  self.PlayerState = null;
  self.IsBattleFinished = false;
  self.DeckSize = null;

  self.NewDuelBegins = null;

  self.HasPlayerRetreated = false;

  self.Battle_Points = 0;
  self.Battle_EarnedXp = 0;
  self.Battle_BonusXp = 0;
  self.Battle_DoesPlayerGoFirst = null;

  self.Duel_EarnedPoints = null;
  self.Duel_EarnedXp = null;
  self.Duel_BonusXp = null;
  self.Duel_HasPlayerWon = null;

  self.Duel_AnimationsTime = 1600;

  self.PlayerCards = [];
  self.PlayerDuellingCard_PlayerCardId = null;
  self.PlayerDuellingCard_CardName = null;
  self.PlayerDuellingCard_CardLevel = null;
  self.PlayerDuellingCard_CardType = null;
  self.PlayerDuellingCard_CardPower = null;
  self.PlayerDuellingCard_CardUpperHand = null;
  self.PlayerDuellingCard_CardFullPower = null;

  self.NpcCards = [];
  self.NpcCardFullPowerSequence = [];
  self.NpcWinningStreak = [];
  self.NpcDuellingCard_NpcCardId = null;
  self.NpcDuellingCard_CardName = null;
  self.NpcDuellingCard_CardLevel = null;
  self.NpcDuellingCard_CardType = null;
  self.NpcDuellingCard_CardPower = null;
  self.NpcDuellingCard_CardUpperHand = null;
  self.NpcDuellingCard_CardFullPower = null;
  self.NpcPotentialFullCardPower = null;

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
    self.Buttons[self.Buttons.length] = self.Buttons.TurnOnAutoMode =
      self.Containers.ContinueCampaign.find("#button-mab-arena-auto-mode");

    self.Buttons[self.Buttons.length] = self.Buttons.HideBattleContainer =
      self.Containers.Battle.find("#button-mab-battle-hide-container");
    self.Buttons[self.Buttons.length] = self.Buttons.HideArenaContainer =
      self.Containers.Arena.find("#button-mab-arena-hide-container");
    self.Buttons[self.Buttons.length] = self.Buttons.RetreatFromBattle =
      self.Containers.Arena.find("#button-mab-arena-retreat");
    self.Buttons[self.Buttons.length] = self.Buttons.ConfirmDuellingCardChoice =
      self.Containers.Arena.find("#button-mab-arena-confirm-card-choice");

    self.Fields = [];
    self.Fields[self.Fields.length] = self.Fields.BattlePoints =
      self.Containers.Arena.find("#span-mab-battle-points");
    self.Fields[self.Fields.length] = self.Fields.BattleEarnedXp =
      self.Containers.Arena.find("#span-mab-battle-earned-xp");
    self.Fields[self.Fields.length] = self.Fields.BattleBonusXp =
      self.Containers.Arena.find("#span-mab-battle-bonus-xp");

    self.Fields[self.Fields.length] = self.Fields.NpcFirstToGoImg =
      self.Containers.Arena.find("#span-mab-arena-npc-first-to-go-img");
    self.Fields[self.Fields.length] = self.Fields.NpcName =
      self.Containers.Arena.find("#span-mab-arena-npc-name");
    self.Fields[self.Fields.length] = self.Fields.NpcLevel =
      self.Containers.Arena.find("#span-mab-arena-npc-level");

    self.Fields[self.Fields.length] = self.Fields.PlayerFirstToGoImg =
      self.Containers.Arena.find("#span-mab-arena-player-first-to-go-img");

    self.Fields[self.Fields.length] = self.Fields.PlayerNickName =
      self.Containers.Arena.find("#span-mab-arena-player-nickname");
    self.Fields[self.Fields.length] = self.Fields.PlayerLevel =
      self.Containers.Arena.find("#span-mab-arena-player-level");
    self.Fields[self.Fields.length] = self.Fields.PlayerState =
      self.Containers.Arena.find("#span-mab-arena-player-state");

    self.Fields[self.Fields.length] = self.Fields.DuelNumber =
      self.Containers.Arena.find("#span-mab-arena-round-counter");
    self.Fields[self.Fields.length] = self.Fields.ArenaMessages =
      self.Containers.Arena.find("#div-mab-arena-announcements");

    self.Blocks = [];
    self.Blocks[self.Blocks.length] = self.Blocks.PlayerCards =
      self.Containers.Arena.find("#block-mab-arena-player-cards");
    self.Blocks[self.Blocks.length] = self.Blocks.NpcCards =
      self.Containers.Arena.find("#block-mab-arena-npc-cards");
  };

  self.loadEvents = () => {
    self.Buttons.ShowBattleContainer_NewBattle.on("click", (e) => {
      e.preventDefault();

      self.battle_HideContainer();
      self.continueCampaign_HideContainer();

      self.Battle_Start();
    });

    self.Buttons.TurnOnAutoMode.on("click", (e) => {
      e.preventDefault();

      self.battle_HideContainer();
      self.continueCampaign_HideContainer();

      self.Battle_Auto();
    });

    self.Buttons.HideBattleContainer.on("click", (e) => {
      e.preventDefault();

      self.continueCampaign_HideContainer();

      self.battle_HideContainer();

      self.mainMenu_ShowContainer();
    });

    self.Buttons.HideArenaContainer.on("click", (e) => {
      e.preventDefault();

      self.arena_HideContainer();

      self.continueCampaign_ShowContainer();
    });

    // Binding the event after inserting into DOM
    $(document).on(
      "click",
      ".button-mab-arena-assigned-player-cards",
      function () {
        self.clear_PlayerDuellingCard();

        self.battle_ListNpcCards();

        let cardCopyId = $(this).data("card-copy-id");

        $(".mab-card-front").removeClass("chosen-card").addClass("frozen-card");

        $(this).addClass("chosen-card");

        let card = self.PlayerCards.filter(
          (card) => card.mab_PlayerCardId === cardCopyId
        )[0];

        self.PlayerDuellingCard_PlayerCardId = card.mab_PlayerCardId;
        self.PlayerDuellingCard_CardName = card.mab_CardName;
        self.PlayerDuellingCard_CardLevel = card.mab_CardLevel;
        self.PlayerDuellingCard_CardType = card.mab_CardType;
        self.PlayerDuellingCard_CardPower = card.mab_CardPower;
        self.PlayerDuellingCard_CardUpperHand = card.mab_CardUpperHand;

        if (self.IsPlayerDefending === true) {
          self.Duel_GetNpcPotentialFullCardPower();
        }

        self.Buttons.ConfirmDuellingCardChoice.removeClass(
          "mab-arena-button-hidden"
        ).addClass("mab-arena-button-display");
      }
    );

    self.Buttons.RetreatFromBattle.on("click", (e) => {
      self.Duel_PlayerRetreats();
    });

    self.Buttons.ConfirmDuellingCardChoice.on("click", (e) => {
      e.preventDefault();

      self.arena_DisableButtons();

      self.Duel_PlayerAttacks();
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
      timer: 1000,
    });
  };
  self.sweetAlertNewRound = () => {
    Swal.fire({
      position: "center",
      width: "15rem",
      icon: "info",
      theme: "bulma",
      title: `#${self.DuelsCount + 1} Duel`,
      showConfirmButton: false,
      timer: 1600,
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

  self.continueCampaign_ShowContainer = () => {
    self.toggleContainerVisibility(self.Containers.ContinueCampaign);
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

        self.reset_Arena();

        self.Fields.NpcName.html(resp.content.mab_NpcName);
        self.Fields.NpcLevel.html(resp.content.mab_NpcLevel);

        self.Fields.PlayerNickName.html(resp.content.mab_PlayerNickName);
        self.Fields.PlayerLevel.html(resp.content.mab_PlayerLevel);

        self.Fields.PlayerState.html(resp.content.mab_PlayerState);

        self.Battle_DoesPlayerGoFirst = resp.content.mab_DoesPlayerGoesFirst;
        if (self.Battle_DoesPlayerGoFirst === true) {
          self.Fields.PlayerFirstToGoImg.html(
            `<img class="first-player-img" src="/images/first_player.png"></img>`
          );
        } else {
          self.Fields.NpcFirstToGoImg.html(
            `<img class="first-player-img" src="/images/first_player.png"></img>`
          );
        }

        self.DeckSize = resp.content.mab_DeckSize;

        self.battle_HideContainer();
        self.arena_ShowContainer();

        self.Battle_ListPlayerDuellingCards();
        self.battle_ListNpcCards();

        self.Duel_Start();

        self.sweetAlertSuccess("Battle started!");
      },
      error: (err) => {
        self.sweetAlertError("Failed to start mab battle!");
      },
      complete: () => {},
    });
  };
  self.Battle_Auto = () => {
    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/mabautobattle",
      xhrFields: {
        withCredentials: true, // Only if you're using cookies; otherwise can be removed
      },
      success: (resp) => {
        if (!resp.content) {
          self.sweetAlertError(resp.message);
          return;
        }
        self.reset_Arena();

        let content = resp.content;

        let battleDoesPlayerGoFirst = content.mab_DoesPlayerGoesFirst;

        let playerNickname = content.mab_PlayerNickname;
        let playerLevel = content.mab_PlayerLevel;
        let playerFinalState = content.mab_PlayerFinalState;
        let playerCards = content.mab_PlayerCards;

        let npcName = content.mab_NpcName;
        let npcLevel = content.mab_NpcLevel;
        let npcCards = content.mab_NpcCards;

        if (battleDoesPlayerGoFirst === true) {
          self.Fields.PlayerFirstToGoImg.html(
            `<img class="first-player-img" src="/images/first_player.png"></img>`
          );
        } else {
          self.Fields.NpcFirstToGoImg.html(
            `<img class="first-player-img" src="/images/first_player.png"></img>`
          );
        }

        self.Fields.PlayerNickName.html(playerNickname);
        self.Fields.PlayerLevel.html(playerLevel);
        self.Fields.PlayerState.html(playerFinalState);

        self.Fields.NpcName.html(npcName);
        self.Fields.NpcLevel.html(npcLevel);

        playerCards.forEach((card, index) => {
          self.NpcWinningStreak.push(card.mab_DuelPoints <= 0);
          console.log("self.NpcWinningStreak: ", self.NpcWinningStreak);

          let usedCardClass =
            card.mab_DuelPoints > 0
              ? "mab-used-card-won"
              : "mab-used-card-lost";

          let used_cardHtml = `
              <div class="d-flex flex-column mab-card-front ${usedCardClass}" data-card-copy-id="${card.mab_PlayerCardId}">                    
                <div class="d-flex flex-row justify-content-start align-items-center w-100">
                  Card:<span>${card.mab_CardName}</span>
                </div>

                <div class="d-flex flex-row justify-content-between align-items-center w-100">
                  <div>
                    Type:<span>${card.mab_CardType}</span>
                  </div>  

                  <div>
                    Lvl:<span>${card.mab_CardLevel}</span>
                  </div>
                </div>

                <div class="d-flex flex-row justify-content-between align-items-center w-100">
                  <div>
                    Pwr.:<span>${card.mab_CardPower}</span>
                  </div>

                  <div>
                    UpH.:<span>${card.mab_CardUpperHand}</span>
                  </div>

                  <div>
                    F.Pwr.:<span id="span-mab-arena-player-${index}-card-total-power">${card.mab_CardFullPower}</span>
                  </div>
                </div>                                  
                                            
                <div class="d-flex flex-row justify-content-between align-items-center w-100">
                  <div>
                    Points:<span>${card.mab_DuelPoints}</span>                                                  
                  </div>  

                  <div class="d-flex flex-row justify-content-between align-items-center">  
                    <div>  
                      Xp:<span>${card.mab_DuelEarnedXp}</span>   
                    </div> 
                    (
                    <div>
                      +<span>${card.mab_DuelBonusXp}</span>  
                    </div> 
                    )
                  </div>
                </div>                 
              </div>
            `;

          self.Blocks.PlayerCards.append(used_cardHtml);
        });

        npcCards.forEach((card) => {
          self.NpcCards.push(card);

          self.NpcCardFullPowerSequence.push(card.mab_CardFullPower);
        });

        self.battle_HideContainer();
        self.arena_ShowContainer();

        self.Duel_CheckStatus();

        self.sweetAlertSuccess("Battle Auto Battle!");
      },
      error: (err) => {
        self.sweetAlertError("Failed to start mab auto battle!");
      },
      complete: () => {},
    });
  };
  self.Battle_Finish = () => {
    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/mabfinishbattle",
      xhrFields: {
        withCredentials: true, // Only if you're using cookies; otherwise can be removed
      },
      success: (resp) => {
        if (!resp.content) {
          self.sweetAlertError(resp.message);
          return;
        }

        self.Fields.BattlePoints.html(resp.content.mab_BattlePoints);
        self.Fields.BattleEarnedXp.html(resp.content.mab_BattleEarnedXp);
        self.Fields.BattleBonusXp.html(resp.content.mab_BattleBonusXp);

        self.sweetAlertSuccess(resp.message);
      },
      error: (err) => {
        self.sweetAlertError("Failed to start mab battle!");
      },
      complete: () => {},
    });
  };

  self.Duel_Start = () => {
    self.AreTurnsFinished = null;
    self.IsDuelResolved = null;
    self.IsPlayerDefending = null;
    self.PlayerState = null;

    self.clear_PlayerDuellingCard();

    self.clear_PlayerDuellingCard();
    self.clear_NpcDuellingCard();

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

        self.IsPlayerDefending = !self.IsPlayerTurn;

        $(".button-mab-arena-assigned-player-cards")
          .removeClass("active-card")
          .addClass("frozen-card");

        self.sweetAlertNewRound();

        setTimeout(() => {
          self.Duel_CheckStatus();
        }, self.Duel_AnimationsTime);
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

        self.Fields.DuelNumber.html(`${self.DuelsCount}#`);

        self.battle_RenderDuel();
      },
      error: function (xhr, status, error) {
        sweetAlertError(
          "Failed to fetch user available and assigned card copies. Try again later."
        );
      },
      complete: () => {},
    });
  };
  self.Duel_Resolve = () => {
    self.Fields.ArenaMessages.html(
      `Both turns are finished! Resolving this duel...`
    );

    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/mabresolveduel",
      xhrFields: {
        withCredentials: true,
      },
      success: (resp) => {
        if (!resp.content) {
          sweetAlertError(resp.message);

          return;
        }

        self.Fields.ArenaMessages.empty();

        self.PlayerDuellingCard_CardFullPower =
          resp.content.mab_PlayerCardFullPower;

        self.NpcDuellingCard_CardFullPower = resp.content.mab_NpcCardFullPower;

        self.Duel_EarnedPoints = resp.content.mab_DuelPoints;

        self.Duel_EarnedXp = resp.content.mab_EarnedXp;

        self.Duel_BonusXp = resp.content.mab_BonusXp;

        self.Duel_HasPlayerWon = resp.content.mab_HasPlayerWon;

        self.Battle_Points = self.Battle_Points + self.Duel_EarnedPoints;

        self.Battle_EarnedXp = self.Battle_EarnedXp + self.Duel_EarnedXp;

        self.Battle_BonusXp = self.Battle_BonusXp + self.Duel_BonusXp;

        self.PlayerState = resp.content.mab_PlayerState;

        self.Fields.PlayerState.empty();

        self.Fields.PlayerState.html(self.PlayerState);

        self.Fields.BattlePoints.html(self.Battle_Points);

        self.Fields.BattleEarnedXp.html(self.Battle_EarnedXp);

        self.Fields.BattleBonusXp.html(self.Battle_BonusXp);

        self.NpcWinningStreak[self.DuelsCount - 1] = !self.Duel_HasPlayerWon;

        self.NpcCardFullPowerSequence.push(self.NpcDuellingCard_CardFullPower);

        self.NewDuelBegins = true;

        self.Duel_CheckStatus();
      },
      error: (err) => {
        sweetAlertError(err);
      },
      complete: () => {},
    });
  };

  self.Battle_ListPlayerDuellingCards = () => {
    self.Blocks.PlayerCards.empty();

    $.ajax({
      type: "GET",
      url: "https://localhost:7081/users/mablistplayerduellingcards",
      xhrFields: { withCredentials: true },
      success: function (resp) {
        if (!resp.content) {
          sweetAlertError("Error", resp.message);
          return;
        }

        self.PlayerCards = resp.content;

        self.PlayerCards.forEach((card, index) => {
          if (!card.mab_DuelId) {
            let available_cardHtml = `
              <button
                class="btn d-flex flex-column mab-card-front mab-available-card button-mab-arena-assigned-player-cards frozen-card"
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

            self.Blocks.PlayerCards.append(available_cardHtml);
          } else {
            let usedCardClass =
              card.mab_DuelPoints > 0
                ? "mab-used-card-won"
                : "mab-used-card-lost";

            let used_cardHtml = `
              <div class="d-flex flex-column mab-card-front ${usedCardClass}" data-card-copy-id="${card.mab_PlayerCardId}">                    
                <div class="d-flex flex-row justify-content-start align-items-center w-100">
                  Card:<span>${card.mab_CardName}</span>
                </div>

                <div class="d-flex flex-row justify-content-between align-items-center w-100">
                  <div>
                    Type:<span>${card.mab_CardType}</span>
                  </div>  

                  <div>
                    Lvl:<span>${card.mab_CardLevel}</span>
                  </div>
                </div>

                <div class="d-flex flex-row justify-content-between align-items-center w-100">
                  <div>
                    Pwr.:<span>${card.mab_CardPower}</span>
                  </div>

                  <div>
                    UpH.:<span>${card.mab_CardUpperHand}</span>
                  </div>

                  <div>
                    F.Pwr.:<span id="span-mab-arena-player-${index}-card-total-power">${card.mab_CardFullPower}</span>
                  </div>
                </div>                                  
                                            
                <div class="d-flex flex-row justify-content-between align-items-center w-100">
                  <div>
                    Points:<span>${card.mab_DuelPoints}</span>                                                  
                  </div>  

                  <div class="d-flex flex-row justify-content-between align-items-center">  
                    <div>  
                      Xp:<span>${card.mab_EarnedXp}</span>   
                    </div> 
                    (
                    <div>
                      +<span>${card.mab_BonusXp}</span>  
                    </div> 
                    )
                  </div>
                </div>                 
              </div>
            `;

            self.Blocks.PlayerCards.append(used_cardHtml);
          }
        });

        if (self.IsPlayerTurn === true) {
          $(".button-mab-arena-assigned-player-cards")
            .removeClass("frozen-card")
            .addClass("active-card");
        } else {
          $(".button-mab-arena-assigned-player-cards")
            .removeClass("active-card")
            .addClass("frozen-card");
        }
      },
      error: function (xhr, status, error) {
        sweetAlertError(
          "Failed to fetch user available and assigned card copies. Try again later."
        );
      },
    });
  };
  self.Duel_PlayerAttacks = () => {
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
        if (!resp.content) {
          sweetAlertError(resp.message);

          return;
        }

        $(".button-mab-arena-assigned-player-cards")
          .removeClass("active-card")
          .addClass("frozen-card");

        self.Duel_ManageTurn();
      },
      error: (err) => {
        sweetAlertError(err);
      },
      complete: () => {},
    });
  };
  self.Duel_PlayerRetreats = () => {
    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/mabplayerretreats",
      xhrFields: {
        withCredentials: true, // Only if you're using cookies; otherwise can be removed
      },
      success: (resp) => {
        if (!resp.content) {
          sweetAlertError(resp.message);

          return;
        }

        self.HasPlayerRetreated = true;

        self.Duel_ManageTurn();
      },
      error: (err) => {
        sweetAlertError(err);
      },
      complete: () => {},
    });
  };

  self.Duel_NpcAttacks = () => {
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

        self.NpcCards.push(resp.content);

        self.battle_ListNpcCards();

        setTimeout(() => {
          self.Duel_ManageTurn();
        }, 300);
      },
      error: (err) => {
        sweetAlertError(err);
      },
      complete: () => {},
    });
  };
  self.Duel_GetNpcPotentialFullCardPower = () => {
    $.ajax({
      type: "GET",
      url: `https://localhost:7081/users/mabgetnpccardfullpower?Mab_PlayerCardId=${self.PlayerDuellingCard_PlayerCardId}`,
      xhrFields: { withCredentials: true },
      success: function (resp) {
        if (!resp.content) {
          sweetAlertError("Error", response.message);
          return;
        }

        self.NpcPotentialFullCardPower = resp.content.mab_NpcCardFullPower;

        self.battle_ListNpcCards();
      },
      error: function () {
        sweetAlertError(
          "Failed to fetch user available and assigned card copies. Try again later."
        );
      },
    });
  };
  self.battle_ListNpcCards = () => {
    self.Blocks.NpcCards.empty();

    self.NpcCards.forEach((card, index) => {
      let usedCardClass = "";

      if (
        !self.NpcWinningStreak[index] &&
        self.NpcWinningStreak[index] !== false
      ) {
        usedCardClass = "chosen-card";
      } else if (self.NpcWinningStreak[index] === true) {
        usedCardClass = "mab-used-card-won";
      } else {
        usedCardClass = "mab-used-card-lost";
      }

      let cardFullPower = null;

      if (
        !self.NpcCardFullPowerSequence[index] &&
        self.NpcCardFullPowerSequence[index] != 0
      ) {
        if (!self.NpcPotentialFullCardPower) {
          cardFullPower = "-";
        } else {
          cardFullPower = self.NpcPotentialFullCardPower;
        }
      } else {
        cardFullPower = self.NpcCardFullPowerSequence[index];
      }

      let usedNpcCard_Html = `
              <div class="d-flex flex-column mab-card-front ${usedCardClass}">                    
                <div class="d-flex flex-row justify-content-start align-items-center w-100">
                  Card:<span>${card.mab_CardName}</span>
                </div>

                <div class="d-flex flex-row justify-content-between align-items-center w-100">
                  <div>
                    Type:<span>${card.mab_CardType}</span>
                  </div>  

                  <div>
                    Lvl:<span>${card.mab_CardLevel}</span>
                  </div>
                </div>

                <div class="d-flex flex-row justify-content-between align-items-center w-100">
                  <div>
                    Pwr.:<span>${card.mab_CardPower}</span>
                  </div>

                  <div>
                    UpH.:<span>${card.mab_CardUpperHand}</span>
                  </div>

                  <div class="mab-npc-card-full-power">
                    F.Pwr.:<span>${cardFullPower}</span>
                  </div>
                </div>                                                          
              </div>
            `;

      self.Blocks.NpcCards.append(usedNpcCard_Html);
    });

    if (self.NpcCards.length < self.DeckSize) {
      for (let i = 0; i < self.DeckSize - self.NpcCards.length; i++) {
        let available_cardHtml = `
            <div class="d-flex flex-column mab-card-front">
            </div>             
            `;

        self.Blocks.NpcCards.append(available_cardHtml);
      }
    }
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

  self.arena_EnableButtons = () => {
    self.Buttons.ConfirmDuellingCardChoice.removeClass(
      "mab-arena-button-hidden"
    ).addClass("mab-arena-button-display");
  };
  self.arena_DisableButtons = () => {
    self.Buttons.ConfirmDuellingCardChoice.removeClass(
      "mab-arena-button-display"
    ).addClass("mab-arena-button-hidden");
  };

  self.battle_RenderDuel = () => {
    self.Fields.ArenaMessages.empty();

    if (self.HasPlayerRetreated === true) {
      self.arena_DisableButtons();

      self.Fields.ArenaMessages.html(`Player is retreating...`);

      return;
    }

    if (
      self.AreTurnsFinished === true &&
      self.IsDuelResolved === true &&
      self.IsBattleFinished === false
    ) {
      self.Fields.ArenaMessages.html(`Starting new duel ...`);

      setTimeout(() => {
        self.Duel_Start();
      }, self.Duel_AnimationsTime);

      self.NewDuelBegins = null;

      return;
    }

    if (self.AreTurnsFinished === true && self.IsDuelResolved === false) {
      self.arena_DisableButtons();

      self.Duel_Resolve();

      return;
    }

    if (self.IsPlayerTurn === true && self.AreTurnsFinished == false) {
      self.arena_DisableButtons();

      self.Fields.ArenaMessages.html(
        `Players's Turn: a card must be chosen...`
      );

      self.Battle_ListPlayerDuellingCards();
      setTimeout(() => {}, self.Duel_AnimationsTime);

      return;
    }

    if (self.IsPlayerTurn === false && self.AreTurnsFinished == false) {
      self.arena_DisableButtons();

      self.Fields.ArenaMessages.html(`NPC's Turn: a card is being chosen...`);

      setTimeout(() => {}, self.Duel_AnimationsTime);
      self.Duel_NpcAttacks();

      return;
    }

    if (self.IsBattleFinished === true) {
      self.arena_DisableButtons();

      self.battle_ListNpcCards();
      self.Battle_ListPlayerDuellingCards();

      self.Buttons.RetreatFromBattle.prop("disabled", true);

      let msg = self.Battle_Points > 0 ? "Victory!" : "Defeat!";

      self.Fields.ArenaMessages.html(`BATTLE FINISHED: ${msg}`);

      self.Battle_Finish();
    }
  };

  self.reset_Arena = () => {
    self.DuelsCount = null;
    self.IsPlayerTurn = null;
    self.IsPlayerDefending = null;
    self.AreTurnsFinished = null;
    self.IsDuelResolved = null;
    self.PlayerState = null;
    self.IsBattleFinished = false;
    self.DeckSize = null;

    self.NewDuelBegins = null;

    self.HasPlayerRetreated = false;

    self.Battle_Points = 0;
    self.Battle_EarnedXp = 0;
    self.Battle_BonusXp = 0;
    self.Battle_DoesPlayerGoFirst = null;

    self.Duel_EarnedPoints = null;
    self.Duel_EarnedXp = null;
    self.Duel_BonusXp = null;
    self.Duel_HasPlayerWon = null;

    self.Duel_AnimationsTime = 1600;

    self.PlayerCards = [];
    self.PlayerDuellingCard_PlayerCardId = null;
    self.PlayerDuellingCard_CardName = null;
    self.PlayerDuellingCard_CardLevel = null;
    self.PlayerDuellingCard_CardType = null;
    self.PlayerDuellingCard_CardPower = null;
    self.PlayerDuellingCard_CardUpperHand = null;
    self.PlayerDuellingCard_CardFullPower = null;

    self.NpcCards = [];
    self.NpcCardFullPowerSequence = [];
    self.NpcWinningStreak = [];
    self.NpcDuellingCard_NpcCardId = null;
    self.NpcDuellingCard_CardName = null;
    self.NpcDuellingCard_CardLevel = null;
    self.NpcDuellingCard_CardType = null;
    self.NpcDuellingCard_CardPower = null;
    self.NpcDuellingCard_CardUpperHand = null;
    self.NpcDuellingCard_CardFullPower = null;
    self.NpcPotentialFullCardPower = null;

    self.Fields.BattlePoints.empty();
    self.Fields.BattlePoints.html("...&nbsp;");
    self.Fields.BattleEarnedXp.empty();
    self.Fields.BattleEarnedXp.html("...&nbsp;");
    self.Fields.BattleBonusXp.empty();
    self.Fields.BattleBonusXp.html("...&nbsp;");

    self.Fields.DuelNumber.empty();
    self.Fields.ArenaMessages.empty();

    self.Fields.NpcFirstToGoImg.empty();
    self.Fields.NpcName.empty();
    self.Fields.NpcLevel.empty();

    self.Fields.PlayerFirstToGoImg.empty();
    self.Fields.PlayerNickName.empty();
    self.Fields.PlayerLevel.empty();
    self.Fields.PlayerState.empty();

    self.Blocks.NpcCards.empty();

    self.Blocks.PlayerCards.empty();

    self.Buttons.RetreatFromBattle.prop("disabled", false);
  };

  self.clear_PlayerDuellingCard = () => {
    self.PlayerDuellingCard_PlayerCardId = null;
    self.PlayerDuellingCard_CardName = null;
    self.PlayerDuellingCard_CardLevel = null;
    self.PlayerDuellingCard_CardType = null;
    self.PlayerDuellingCard_CardPower = null;
    self.PlayerDuellingCard_CardUpperHand = null;
    self.PlayerDuellingCard_CardFullPower = null;
  };
  self.clear_NpcDuellingCard = () => {
    self.NpcDuellingCard_NpcCardId = null;
    self.NpcDuellingCard_CardName = null;
    self.NpcDuellingCard_CardLevel = null;
    self.NpcDuellingCard_CardType = null;
    self.NpcDuellingCard_CardPower = null;
    self.NpcDuellingCard_CardUpperHand = null;
    self.NpcDuellingCard_CardFullPower = null;
  };
  self.clear_DuelResults = () => {
    self.Duel_EarnedPoints = null;
    self.Duel_EarnedXp = null;
    self.Duel_BonusXp = null;
    self.Duel_HasPlayerWon = null;
    self.NpcPotentialFullCardPower = null;
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
