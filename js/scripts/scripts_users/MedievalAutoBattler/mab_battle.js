function mab_battle() {
  let self = this;

  self.IsBuilt = false;

  self.DuelsCount = null;
  self.IsPlayerTurn = null;
  self.AreTurnsFinished = null;
  self.IsDuelResolved = null;
  self.PlayerState = null;
  self.IsBattleFinished = null;
  self.DeckSize = null;

  self.NewDuelBegins = null;

  self.HasPlayerRetreated = false;

  self.Battle_Points = 0;
  self.Battle_StackedXp = 0;
  self.Battle_StackedBonusXp = 0;

  self.Duel_EarnedPoints = null;
  self.Duel_EarnedXp = null;
  self.Duel_BonusXp = null;
  self.Duel_HasPlayerWon = null;

  self.PlayerCards = [];
  self.PlayerDuellingCard_PlayerCardId = null;
  self.PlayerDuellingCard_CardName = null;
  self.PlayerDuellingCard_CardLevel = null;
  self.PlayerDuellingCard_CardType = null;
  self.PlayerDuellingCard_CardPower = null;
  self.PlayerDuellingCard_CardUpperHand = null;
  self.PlayerDuellingCard_CardFullPower = null;

  self.NpcCards = [];
  self.NpcWinningStreak = [];
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
      self.Containers.Arena.find("#span-mab-battle-points");
    self.Fields[self.Fields.length] = self.Fields.BattleStackedEarnedXp =
      self.Containers.Arena.find("#span-mab-battle-earned-xp");
    self.Fields[self.Fields.length] = self.Fields.BattleStackedBonusXp =
      self.Containers.Arena.find("#span-mab-battle-bonus-xp");
    self.Fields[self.Fields.length] = self.Fields.NpcName =
      self.Containers.Arena.find("#span-mab-arena-npc-name");
    self.Fields[self.Fields.length] = self.Fields.NpcLevel =
      self.Containers.Arena.find("#span-mab-arena-npc-level");
    self.Fields[self.Fields.length] = self.Fields.PlayerNickName =
      self.Containers.Arena.find("#span-mab-arena-player-nickname");
    self.Fields[self.Fields.length] = self.Fields.PlayerLevel =
      self.Containers.Arena.find("#span-mab-arena-player-level");

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

    self.Buttons.ShowBattleContainer_ContinueBattle.on("click", (e) => {
      e.preventDefault();

      self.battle_HideContainer();
      self.continueCampaign_HideContainer();

      self.Battle_Continue();
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

    self.Buttons.RetreatFromBattle.on("click", (e) => {
      self.Duel_PlayerRetreats();
    });

    self.Buttons.ConfirmDuellingCardChoice.on("click", (e) => {
      e.preventDefault();

      self.arena_DisableButtons();

      if (self.IsPlayerTurn === true && self.AreTurnsFinished == false) {
        self.Duel_PlayerAttacks();

        self.Buttons.CancelDuellingCardChoice.removeClass(
          "mab-arena-button-display"
        ).addClass("mab-arena-button-hidden");

        return;
      }

      if (
        self.Buttons.ConfirmDuellingCardChoice.hasClass("mab-resolve-duel-mode")
      ) {
        self.Duel_Resolve();

        return;
      }

      if (
        self.Buttons.ConfirmDuellingCardChoice.hasClass("mab-next-duel-mode")
      ) {
        self.NewDuelBegins = true;

        self.battle_RenderDuel();
      }
    });

    self.Buttons.CancelDuellingCardChoice.on("click", (e) => {
      e.preventDefault();

      self.clear_PlayerDuellingCard();
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
      timer: 600,
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

        self.Fields.NpcName.html(resp.content.mab_NpcName);
        self.Fields.NpcLevel.html(resp.content.mab_NpcLevel);

        self.Fields.PlayerNickName.html(resp.content.mab_PlayerNickName);
        self.Fields.PlayerLevel.html(resp.content.mab_PlayerLevel);

        self.DeckSize = resp.content.mab_DeckSize;

        self.battle_HideContainer();
        self.arena_ShowContainer();

        self.Duel_Start();

        self.battle_ListNpcCards();
        self.Battle_ListPlayerCards();

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
      type: "GET",
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

        let playerName = battle.mab_PlayerNickName;
        let playerLevel = battle.mab_PlayerLevel;
        let playerCard = battle.mab_PlayerCard;
        if (playerCard != null) {
          self.PlayerDuellingCard_PlayerCardId = playerCard.mab_PlayerCardId;
          self.PlayerDuellingCard_CardName = playerCard.mab_CardName;
          self.PlayerDuellingCard_CardLevel = playerCard.mab_CardLevel;
          self.PlayerDuellingCard_CardType = playerCard.mab_CardType;
          self.PlayerDuellingCard_CardPower = playerCard.mab_CardPower;
          self.PlayerDuellingCard_CardUpperHand = playerCard.mab_CardUpperHand;
          self.PlayerDuellingCard_CardFullPower = playerCard.mab_CardFullPower;

          self.arena_PlayerDuellingCard_Add(
            self.PlayerDuellingCard_CardFullPower
          );
        }

        let npcName = battle.mab_NpcName;
        let npcLevel = battle.mab_NpcLevel;
        let npcCard = battle.mab_NpcCard;
        if (npcCard != null) {
          self.NpcDuellingCard_NpcCardId = npcCard.mab_NpcCardId;
          self.NpcDuellingCard_CardName = npcCard.mab_CardName;
          self.NpcDuellingCard_CardLevel = npcCard.mab_CardLevel;
          self.NpcDuellingCard_CardType = npcCard.mab_CardType;
          self.NpcDuellingCard_CardPower = npcCard.mab_CardPower;
          self.NpcDuellingCard_CardUpperHand = npcCard.mab_CardUpperHand;
          self.NpcDuellingCard_CardFullPower = npcCard.mab_CardFullPower;

          self.arena_NpcDuellingCard_Add(self.NpcDuellingCard_CardFullPower);
        }

        self.DuelsCount = battle.mab_DuelsCount;
        self.Battle_Points = battle.mab_BattlePoints;
        self.Battle_StackedXp = battle.mab_BattleEarnedXp;
        self.Battle_StackedBonusXp = battle.mab_BattleBonusXp;

        self.IsPlayerTurn = battle.mab_IsPlayerAttacking;
        self.Duel_EarnedPoints = battle.mab_DuelPoints;
        self.Duel_EarnedXp = battle.mab_DuelEarnedXp;
        self.Duel_BonusXp = battle.mab_DuelBonusXp;

        self.sweetAlertSuccess("Continuing Battle...");

        self.Fields.BattlePoints.html(self.Battle_Points);
        self.Fields.BattleStackedEarnedXp.html(self.Battle_StackedXp);
        self.Fields.BattleStackedBonusXp.html(self.Duel_BonusXp);

        self.Fields.NpcName.html(npcName);
        self.Fields.NpcLevel.html(npcLevel);

        self.Fields.PlayerNickName.html(playerName);
        self.Fields.PlayerLevel.html(playerLevel);

        self.battle_HideContainer();
        self.arena_ShowContainer();

        self.battle_ListNpcCards();
        self.Battle_ListPlayerCards();

        self.Duel_CheckStatus();
      },
      error: (err) => {
        self.sweetAlertError(err);
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

        self.sweetAlertSuccess(resp.message);
      },
      error: (err) => {
        self.sweetAlertError("Failed to start mab battle!");
      },
      complete: () => {},
    });
  };

  self.battle_ListNpcCards = (npcCardFullPower, hasPlayerWon) => {
    self.Blocks.NpcCards.empty();

    self.NpcCards.forEach((card, index) => {
      let usedCardClass =
        self.NpcWinningStreak[index] === true
          ? "mab-used-card-won"
          : "mab-used-card-lost";

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

                  <div>
                    F.Pwr.:<span>${npcCardFullPower}</span>
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
  self.Battle_ListPlayerCards = () => {
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
          if (card.mab_IsCardAvailable === true) {
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
              card.mab_HasPlayerWon === true
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

        self.Fields.ArenaMessages.html(
          `Player's Turn: please choose a card or pass...`
        );

        $(".button-mab-arena-assigned-player-cards")
          .removeClass("frozen-card")
          .addClass("active-card");
      },
      error: function (xhr, status, error) {
        sweetAlertError(
          "Failed to fetch user available and assigned card copies. Try again later."
        );
      },
    });
  };

  self.Duel_Start = () => {
    self.AreTurnsFinished = null;
    self.IsDuelResolved = null;

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

        self.PlayerState = resp.content.mab_PlayerState;

        self.sweetAlertNewRound();

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

        self.PlayerDuellingCard_CardFullPower =
          resp.content.mab_PlayerCardFullPower;

        self.NpcDuellingCard_CardFullPower = resp.content.mab_NpcCardFullPower;

        self.Duel_EarnedPoints = resp.content.mab_DuelPoints;

        self.Duel_EarnedXp = resp.content.mab_EarnedXp;

        self.Duel_BonusXp = resp.content.mab_BonusXp;

        self.Duel_HasPlayerWon = resp.content.mab_HasPlayerWon;

        self.Battle_Points = self.Battle_Points + self.Duel_EarnedPoints;

        self.Battle_StackedXp = self.Battle_StackedXp + self.Duel_EarnedXp;

        self.Battle_StackedBonusXp =
          self.Battle_StackedBonusXp + self.Duel_BonusXp;

        self.Fields.BattlePoints.html(self.Battle_Points);

        self.Fields.BattleStackedEarnedXp.html(self.Battle_StackedXp);

        self.Fields.BattleStackedBonusXp.html(self.Battle_StackedBonusXp);

        self.arena_PlayerDuellingCard_Remove();
        self.arena_NpcDuellingCard_Remove();

        self.arena_PlayerDuellingCard_Add(
          self.PlayerDuellingCard_CardFullPower
        );
        self.arena_NpcDuellingCard_Add(self.NpcDuellingCard_CardFullPower);

        self.NpcWinningStreak.push(!self.Duel_HasPlayerWon);

        self.battle_ListNpcCards(
          self.NpcDuellingCard_CardFullPower,
          self.Duel_HasPlayerWon
        );
        self.Battle_ListPlayerCards();

        self.Duel_CheckStatus();
      },
      error: (err) => {
        sweetAlertError(err);
      },
      complete: () => {},
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

        setTimeout(() => {
          self.arena_NpcDuellingCard_Add();

          self.Duel_ManageTurn();
        }, 300);
      },
      error: (err) => {
        sweetAlertError(err);
      },
      complete: () => {},
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

  self.arena_EnableButtons = () => {
    self.Buttons.ConfirmDuellingCardChoice.removeClass(
      "mab-arena-button-hidden"
    ).addClass("mab-arena-button-display");

    self.Buttons.ConfirmDuellingCardChoice.prop("disable", false);
  };
  self.arena_DisableButtons = () => {
    self.Buttons.ConfirmDuellingCardChoice.removeClass(
      "mab-arena-button-display"
    ).addClass("mab-arena-button-hidden");

    setTimeout(() => {
      self.Buttons.ConfirmDuellingCardChoice.prop("disable", true);
    }, 300);
  };

  self.arena_Button_ConfirmDuellingCardMode = () => {
    if (self.Buttons.ConfirmDuellingCardChoice.hasClass("mab-pass-turn-mode")) {
      self.Buttons.ConfirmDuellingCardChoice.removeClass("mab-pass-turn-mode");
    }

    if (
      self.Buttons.ConfirmDuellingCardChoice.hasClass("mab-resolve-duel-mode")
    ) {
      self.Buttons.ConfirmDuellingCardChoice.removeClass(
        "mab-resolve-duel-mode"
      );
    }

    if (self.Buttons.ConfirmDuellingCardChoice.hasClass("mab-next-duel-mode")) {
      self.Buttons.ConfirmDuellingCardChoice.removeClass("mab-next-duel-mode");
    }

    self.Buttons.ConfirmDuellingCardChoice.text("Confirm").addClass(
      "mab-confirm-duelling-card-mode"
    );

    self.arena_EnableButtons();
  };
  self.arena_Button_ResolveDuelMode = () => {
    if (self.Buttons.ConfirmDuellingCardChoice.hasClass("mab-pass-turn-mode")) {
      self.Buttons.ConfirmDuellingCardChoice.removeClass("mab-pass-turn-mode");
    }

    if (
      self.Buttons.ConfirmDuellingCardChoice.hasClass(
        "mab-confirm-duelling-card-mode"
      )
    ) {
      self.Buttons.ConfirmDuellingCardChoice.removeClass(
        "mab-confirm-duelling-card-mode"
      );
    }

    if (self.Buttons.ConfirmDuellingCardChoice.hasClass("mab-next-duel-mode")) {
      self.Buttons.ConfirmDuellingCardChoice.removeClass("mab-next-duel-mode");
    }

    self.Buttons.ConfirmDuellingCardChoice.text("Resolve Duel").addClass(
      "mab-resolve-duel-mode"
    );

    self.arena_EnableButtons();
  };
  self.arena_Button_NextDuelMode = () => {
    if (self.Buttons.ConfirmDuellingCardChoice.hasClass("mab-pass-turn-mode")) {
      self.Buttons.ConfirmDuellingCardChoice.removeClass("mab-pass-turn-mode");
    }

    if (
      self.Buttons.ConfirmDuellingCardChoice.hasClass(
        "mab-confirm-duelling-card-mode"
      )
    ) {
      self.Buttons.ConfirmDuellingCardChoice.removeClass(
        "mab-confirm-duelling-card-mode"
      );
    }

    if (
      self.Buttons.ConfirmDuellingCardChoice.hasClass("mab-resolve-duel-mode")
    ) {
      self.Buttons.ConfirmDuellingCardChoice.removeClass(
        "mab-resolve-duel-mode"
      );
    }

    self.Buttons.ConfirmDuellingCardChoice.text("Next Duel").addClass(
      "mab-next-duel-mode"
    );

    self.arena_EnableButtons();
  };

  self.battle_RenderDuel = () => {
    self.Fields.ArenaMessages.empty();

    if (self.HasPlayerRetreated === true) {
      self.arena_DisableButtons();

      self.Fields.ArenaMessages.html(`Player is retreating...`);

      return;
    }

    if (self.NewDuelBegins === true) {
      self.Fields.ArenaMessages.html(`Starting new duel ...`);

      setTimeout(() => {
        self.Duel_Start();
      }, 300);

      self.NewDuelBegins = null;

      return;
    }

    if (self.AreTurnsFinished === true && self.IsDuelResolved === false) {
      self.arena_DisableButtons();

      self.Fields.ArenaMessages.html(
        `Both turns are finished, to continue press the button to resolve this duel`
      );

      $(".button-mab-arena-assigned-player-cards")
        .removeClass("active-card")
        .addClass("frozen-card");

      self.arena_Button_ResolveDuelMode();

      return;
    }

    if (self.IsDuelResolved === true && self.IsBattleFinished === false) {
      self.Fields.ArenaMessages.html(
        `Duel resolved, to continue press the button`
      );

      $(".button-mab-arena-assigned-player-cards")
        .removeClass("active-card")
        .addClass("frozen-card");

      self.arena_Button_NextDuelMode();

      return;
    }

    if (self.IsPlayerTurn === true && self.AreTurnsFinished == false) {
      self.Fields.ArenaMessages.html(`Player's Turn: you must chose a card...`);
      //self.Battle_ListPlayerCards();
      return;
    }

    if (self.IsPlayerTurn === false && self.AreTurnsFinished == false) {
      self.arena_DisableButtons();

      self.Fields.ArenaMessages.html(`NPC's Turn: a card is being chosen...`);

      self.Duel_NpcAttacks();

      return;
    }

    if (self.IsBattleFinished === true) {
      self.Fields.ArenaMessages.html(`Battle is finished!`);

      self.Battle_Finish();
    }
  };

  self.arena_PlayerDuellingCard_Add = (cardFullPower) => {
    self.Fields.PlayerDuellingCard.empty();

    let cardFullPowerValue = cardFullPower ? cardFullPower : "?";
    let cardName = self.PlayerDuellingCard_CardName;
    let cardLevel = self.PlayerDuellingCard_CardLevel;
    let cardType = self.PlayerDuellingCard_CardType;
    let cardPower = self.PlayerDuellingCard_CardPower;
    let cardUpperHand = self.PlayerDuellingCard_CardUpperHand;

    let playerChosenCardCopyHtml = `
        <div class="d-flex flex-column justify-content-center align-items-center w-100 mab-card-front" >
          <div class="d-flex flex-row justify-content-between align-items-center w-100">
            <span>${cardName}</span>
            <span>${cardLevel}</span>
          </div>
          <div class="d-flex flex-row justify-content-center align-items-center">
            <span>${cardType}</span>
          </div>
          <div class="d-flex flex-row justify-content-between align-items-center w-100">
            <div>
              <span>${cardPower}</span>
              |
              <span >${cardUpperHand}</span>
            </div>
            <span id="span-player-card-full-power">${cardFullPowerValue}</span>
          </div>
        </div>
      `;

    self.Buttons.CancelDuellingCardChoice.removeClass(
      "mab-arena-button-hidden"
    ).addClass("mab-arena-button-display");

    setTimeout(() => {
      self.Fields.PlayerDuellingCard.addClass("duelling-card");

      setTimeout(() => {
        if (!cardFullPower && cardFullPower != 0) {
          self.arena_Button_ConfirmDuellingCardMode();
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

    self.Buttons.CancelDuellingCardChoice.removeClass(
      "mab-arena-button-display"
    ).addClass("mab-arena-button-hidden");
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

  self.clear_PlayerDuellingCard = () => {
    self.arena_PlayerDuellingCard_Remove();

    self.PlayerDuellingCard_PlayerCardId = null;
    self.PlayerDuellingCard_CardName = null;
    self.PlayerDuellingCard_CardLevel = null;
    self.PlayerDuellingCard_CardType = null;
    self.PlayerDuellingCard_CardPower = null;
    self.PlayerDuellingCard_CardUpperHand = null;
    self.PlayerDuellingCard_CardFullPower = null;
  };
  self.clear_NpcDuellingCard = () => {
    self.arena_NpcDuellingCard_Remove();

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
