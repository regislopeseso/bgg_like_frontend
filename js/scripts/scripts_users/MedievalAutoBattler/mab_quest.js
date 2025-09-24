function mab_quest() {
  let self = this;

  self.IsBuilt = false;

  self.loadReferences = () => {
    self.DOM = $("#dom-medieval-auto-battler");

    self.MabContainersContent = self.DOM.find("#mab-containers-content");

    self.Containers = [];

    self.Containers[self.Containers.length] = self.Containers.ContinueCampaign =
      self.MabContainersContent.find("#container-mab-continue-campaign");
    self.Containers[self.Containers.length] = self.Containers.Quest =
      self.MabContainersContent.find("#container-mab-quest");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.Quest_HideContainer =
      self.Containers.Quest.find("#button-mab-quest-hide-container");

    self.Containers.QuestDetailsBlock = self.Containers.Quest.find(
      "#block-mab-quest-details"
    );
  };

  self.loadEvents = () => {
    self.Buttons.Quest_HideContainer.on("click", (e) => {
      e.preventDefault();

      self.quest_HideContainer();

      self.continueCampaign_ShowContainer();
    });

    $(document).on("click", ".button-mab-quest-content", function () {
      self.continueCampaign_HideContainer();

      let questId = $(this).data("mab-quest-id");

      self.quest_ShowContainer();

      self.Quest_ShowQuestDetails(questId);
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
    self.toggleContainerVisibility(self.Containers.Quest);
  };
  self.battle_HideContainer = () => {
    self.toggleContainerVisibility(self.Containers.Quest);
  };

  self.continueCampaign_ShowContainer = () => {
    self.toggleContainerVisibility(self.Containers.ContinueCampaign);
  };
  self.continueCampaign_HideContainer = () => {
    self.toggleContainerVisibility(self.Containers.ContinueCampaign);
  };

  self.quest_ShowContainer = () => {
    self.toggleContainerVisibility(self.Containers.Quest);
  };
  self.quest_HideContainer = () => {
    self.toggleContainerVisibility(self.Containers.Quest);
  };

  self.Quest_ShowQuestDetails = (questId) => {
    $.ajax({
      type: "GET",
      url: `https://localhost:7081/users/mabshowquestdetails?Mab_QuestId=${questId}`,
      xhrFields: { withCredentials: true },
      success: function (resp) {
        if (!resp.content) {
          sweetAlertError("Error", resp.message);
          return;
        }

        self.Containers.QuestDetailsBlock.empty();

        let quest = resp.content;

        let questHtml = `
        <div class="d-flex flex-column justify-content-center align-items-center">
          <h3>
            <span>${quest.mab_QuestTitle}</span>        
          </h3>
          <div class="mab-quest-description">
            "${quest.mab_QuestDescription}"
          </div>       
        </div>
        
        `;
        self.Containers.QuestDetailsBlock.append(questHtml);

        quest.mab_Npcs.forEach((npc, index) => {
          let npcHtml = `
          <button 
            class="btn mab-opponent ps-3" 
            data-mab-quest-id="${quest.mab_QuestId}"
            data-mab-npc-id="${npc.mab_NpcId}"
          >
            #${index + 1} ${npc.mab_NpcName}          
          </button>`;

          self.Containers.QuestDetailsBlock.append(npcHtml);
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
  new mab_quest();
});
