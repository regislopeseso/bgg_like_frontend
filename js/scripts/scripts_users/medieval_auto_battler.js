function medieval_auto_battler() {
  let self = this;
  self.IsBuilt = false;

  self.LoadReferences = () => {
    self.DOM = $("#dom-medieval-auto-battler");

    self.MabContent = self.DOM.find("#mab-content");

    self.MabMenu = self.DOM.find("#mab-menu");

    self.StartNewMabCampaign_FormContainer = self.DOM.find(
      "#container-mab-start-new-campaign-form"
    );
    self.StartNewMabCampaign_Form = self.DOM.find(
      "#form-mab-start-new-campaign"
    );

    self.MabCampaignStats_Container = self.DOM.find(
      "#container-mab-campaign-stats"
    );

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.OpenStartNewCampaign_Form =
      self.DOM.find("#button-mab-start-new-campaign");
    self.Buttons[self.Buttons.length] =
      self.Buttons.CloseStartNewCampaign_Form = self.DOM.find(
        "#button-mab-start-new-campain-close-form"
      );
    self.Buttons[self.Buttons.length] = self.Buttons.LoadCampaign =
      self.DOM.find("#button-mab-load-campaign");

    self.Buttons[self.Buttons.length] = self.Buttons.OpenCampaignStats =
      self.DOM.find("#button-mab-show-campaign-stats");
    self.Buttons[self.Buttons.length] = self.Buttons.CloseCampaignStats =
      self.DOM.find("#button-mab-close-campaign-stats");

    self.Inputs = [];
    self.Inputs[self.Inputs.length] = self.Inputs.MabPlayer_NickName =
      self.DOM.find("#mab-campaign-player-nickname");
    self.Inputs[self.Inputs.length] = self.Inputs.MabCampaignDifficulty_Easy =
      self.DOM.find("#mab-campaign-difficulty-easy");
    self.Inputs[self.Inputs.length] = self.Inputs.MabCampaignDifficulty_Medium =
      self.DOM.find("#mab-campaign-difficulty-medium");
    self.Inputs[self.Inputs.length] = self.Inputs.MabCampaignDifficulty_Hard =
      self.DOM.find("#mab-campaign-difficulty-hard");
    self.Inputs[self.Inputs.length] = self.Inputs.MabPlayer_NewNickName =
      self.DOM.find("#mab-player-new-nickname");

    self.DifficultyLabels = [];
    self.DifficultyLabels[self.DifficultyLabels.length] =
      self.DifficultyLabels.Easy = self.DOM.find(
        "#text-mab-campaign-difficulty-easy"
      );
    self.DifficultyLabels[self.DifficultyLabels.length] =
      self.DifficultyLabels.Medium = self.DOM.find(
        "#text-mab-campaign-difficulty-medium"
      );
    self.DifficultyLabels[self.DifficultyLabels.length] =
      self.DifficultyLabels.Hard = self.DOM.find(
        "#text-mab-campaign-difficulty-hard"
      );
  };

  self.LoadEvents = () => {
    self.Buttons.OpenStartNewCampaign_Form.on("click", (e) => {
      e.preventDefault();

      self.MabMainMenu_Close();

      self.StartNewMabCampaign_OpenForm();
    });
    self.Buttons.CloseStartNewCampaign_Form.on("click", (e) => {
      e.preventDefault();

      self.StartNewMabCampaign_CloseForm();

      self.MabMainMenu_Open();
    });

    self.Inputs.MabCampaignDifficulty_Easy.on("click", (e) => {
      self.PaintLabel("easy");
    });
    self.Inputs.MabCampaignDifficulty_Medium.on("click", (e) => {
      self.PaintLabel("medium");
    });
    self.Inputs.MabCampaignDifficulty_Hard.on("click", (e) => {
      self.PaintLabel("hard");
    });

    self.Buttons.LoadCampaign.on("click", (e) => {
      e.preventDefault();

      self.LoadMabCampaign();
    });

    self.Buttons.OpenCampaignStats.on("click", (e) => {
      e.preventDefault();

      self.MabMainMenu_Close();

      self.MabCampaignStats_Open();
    });
    self.Buttons.CloseCampaignStats.on("click", (e) => {
      e.preventDefault();

      self.MabCampaignStats_Close();

      self.MabMainMenu_Open();
    });
  };

  self.ToggleVisibility = (div) => {
    div.hasClass("show-div")
      ? div.removeClass("show-div").addClass("hide-div")
      : div.removeClass("hide-div").addClass("show-div");
  };

  self.MabMainMenu_Open = () => {
    self.ToggleVisibility(self.MabMenu);
  };
  self.MabMainMenu_Close = () => {
    self.ToggleVisibility(self.MabMenu);
  };

  self.StartNewMabCampaign_OpenForm = () => {
    self.ToggleVisibility(self.StartNewMabCampaign_FormContainer);
    self.Inputs.MabPlayer_NickName.trigger("focus");
  };
  self.StartNewMabCampaign_CloseForm = () => {
    self.Inputs.MabPlayer_NickName.val("");

    self.ToggleVisibility(self.StartNewMabCampaign_FormContainer);
  };
  self.PaintLabel = (difficulty) => {
    self.DifficultyLabels.Easy.removeClass("paint-green");
    self.DifficultyLabels.Medium.removeClass("paint-yellow");
    self.DifficultyLabels.Hard.removeClass("paint-red");

    switch (difficulty) {
      case "medium":
        self.DifficultyLabels.Medium.addClass("paint-yellow");
        return;
      case "hard":
        self.DifficultyLabels.Hard.addClass("paint-red");
        return;
      default:
        self.DifficultyLabels.Hard.addClass("paint-red");
        return;
    }
  };

  self.LoadMabCampaign = () => {};

  self.MabCampaignStats_Open = () => {
    self.ToggleVisibility(self.MabCampaignStats_Container);
  };
  self.MabCampaignStats_Close = () => {
    self.ToggleVisibility(self.MabCampaignStats_Container);
  };

  self.Build = () => {
    self.LoadReferences();
    self.LoadEvents();
  };

  self.Build();
}

$(function () {
  new medieval_auto_battler();
});
