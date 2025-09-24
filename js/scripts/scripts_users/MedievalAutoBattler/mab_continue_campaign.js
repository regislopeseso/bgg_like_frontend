function mab_continue_campaign() {
  let self = this;

  self.IsBuilt = false;

  self.isActiveDeckMode = true;

  self.MabDeck_CurrentDeckSize = 0;
  self.MabPlayer_MabDeck = {
    MabDeckId: null,
    MabDeckName: "",
  };

  self.MabDeck_DeckSizeLimit = null;

  self.SelectedMabCardCopyId = null;
  self.MabDeck_CardIds = [];

  self.loadReferences = () => {
    self.DOM = $("#dom-medieval-auto-battler");

    self.MabContainersContent = self.DOM.find("#mab-containers-content");

    self.Containers = [];
    self.Containers[self.Containers.length] = self.Containers.MainMenu =
      self.MabContainersContent.find("#container-mab-main-menu");
    self.Containers[self.Containers.length] = self.Containers.ContinueCampaign =
      self.MabContainersContent.find("#container-mab-continue-campaign");
    self.Containers[self.Containers.length] = self.Containers.Battle =
      self.MabContainersContent.find("#container-mab-quest");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] =
      self.Buttons.ShowContinueCampaignContainer =
        self.Containers.MainMenu.find(
          "#button-mab-continue-campaign-show-container"
        );
    self.Buttons[self.Buttons.length] =
      self.Buttons.HideContinueCampaignContainer =
        self.Containers.ContinueCampaign.find(
          "#button-mab-continue-campaign-hide-container"
        );
    self.Buttons[self.Buttons.length] = self.Buttons.HideBattleContainer =
      self.Containers.Battle.find("#button-mab-battle--hide-container");

    self.Blocks = [];
    self.Blocks[self.Blocks.length] = self.Blocks.QuestsList =
      self.Containers.ContinueCampaign.find("#mab-quests-block");
  };

  self.loadEvents = () => {
    self.Buttons.ShowContinueCampaignContainer.on("click", (e) => {
      e.preventDefault();

      self.mainMenu_HideContainer();

      self.continueCampaign_ShowContainer();

      self.ContinueCampaign_ListQuests();
    });
    self.Buttons.HideContinueCampaignContainer.on("click", (e) => {
      e.preventDefault();

      self.continueCampaign_HideContainer();

      self.mainMenu_ShowContainer();
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
  self.mainMenu_ShowContainer = () => {
    self.toggleContainerVisibility(self.Containers.MainMenu);
  };
  self.mainMenu_HideContainer = () => {
    self.toggleContainerVisibility(self.Containers.MainMenu);
  };
  self.continueCampaign_ShowContainer = () => {
    self.toggleContainerVisibility(self.Containers.ContinueCampaign);
  };
  self.continueCampaign_HideContainer = () => {
    self.toggleContainerVisibility(self.Containers.ContinueCampaign);
  };
  self.battle_HideContainer = () => {
    self.toggleContainerVisibility(self.Containers.Battle);
  };

  self.ContinueCampaign_ListQuests = () => {
    $.ajax({
      type: "GET",
      url: `https://localhost:7081/users/mablistquests`,
      xhrFields: { withCredentials: true },
      success: function (resp) {
        if (!resp.content) {
          sweetAlertError("Error", resp.message);
          return;
        }

        let quests = resp.content;

        quests.forEach((quest, index) => {
          let defeatedNpcsCount = quest.mab_DefeatedNpcsCount;
          let npcsCount = quest.mab_NpcsCount;
          let isQuestFulfilled = `${defeatedNpcsCount} / ${npcsCount}`;

          if (npcsCount === defeatedNpcsCount) {
            isQuestFulfilled = "Fulfilled!";
          }

          let questDiv = `            
            <button class="btn button-mab-quest-content" data-mab-quest-id="${quest.mab_QuestId}">
              <div class="mab-quest-title"><h3 class="p-0 m-0">${quest.mab_QuestTitle}</h3></div>

              <div class="mab-quest-description">"${quest.mab_QuestDescription}"</div>

              <div class="mab-quest-gold-bounty">Gold Bounty: ${quest.mab_GoldBounty}</div>
              <div class="mab-quest-xp-reward">Xp Reward: ${quest.mab_XpReward}</div>                                        
              <div class="mab-quest-is-fulfilled">Defeated Opponents: ${isQuestFulfilled}</div>
            </button>           
            `;

          self.Blocks.QuestsList.append(questDiv);
        });
      },
      error: function (xhr, status, error) {
        sweetAlertError(
          "Failed to fetch user available and assigned cards. Try again later."
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
  new mab_continue_campaign();
});
