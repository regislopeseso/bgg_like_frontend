function mab_new_campaign() {
  let self = this;
  self.IsBuilt = false;

  self.loadReferences = () => {
    self.DOM = $("#dom-medieval-auto-battler");

    self.Containers = [];
    self.Containers[self.Containers.length] = self.Containers.MainMenu =
      self.DOM.find("#container-mab-main-menu");
    self.Containers[self.Containers.length] = self.Containers.NewCampaign =
      self.DOM.find("#container-mab-new-campaign");

    self.NewCampaign_Form = self.DOM.find("#form-mab-new-campaign");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.NewCampaign_ShowContainer =
      self.Containers.MainMenu.find("#button-mab-new-campaign-show-container");
    self.Buttons[self.Buttons.length] = self.Buttons.NewCampaign_HideContainer =
      self.Containers.NewCampaign.find(
        "#button-mab-new-campaign-hide-container"
      );
    self.Buttons[self.Buttons.length] = self.Buttons.NewCampaign_Start =
      self.Containers.NewCampaign.find("#button-mab-new-campaign-start");

    self.Inputs = [];
    self.Inputs[self.Inputs.length] = self.Inputs.NewCampaign_PlayerNickName =
      self.Containers.NewCampaign.find(
        "#input-mab-new-campaign-player-nickname"
      );
    self.Inputs[self.Inputs.length] = self.Inputs.NewCampaign_Difficulty_Easy =
      self.Containers.NewCampaign.find(
        "#input-mab-new-campaign-difficulty-easy"
      );
    self.Inputs[self.Inputs.length] =
      self.Inputs.NewCampaign_Difficulty_Medium =
        self.Containers.NewCampaign.find(
          "#input-mab-new-campaign-difficulty-medium"
        );
    self.Inputs[self.Inputs.length] = self.Inputs.NewCampaign_Difficulty_Hard =
      self.Containers.NewCampaign.find(
        "#input-mab-new-campaign-difficulty-hard"
      );

    self.DifficultyLabels = [];
    self.DifficultyLabels[self.DifficultyLabels.length] =
      self.DifficultyLabels.NewCampaign_Easy = self.Containers.NewCampaign.find(
        "#label-mab-new-campaign-difficulty-easy"
      );
    self.DifficultyLabels[self.DifficultyLabels.length] =
      self.DifficultyLabels.NewCampaign_Medium =
        self.Containers.NewCampaign.find(
          "#label-mab-new-campaign-difficulty-medium"
        );
    self.DifficultyLabels[self.DifficultyLabels.length] =
      self.DifficultyLabels.NewCampaign_Hard = self.Containers.NewCampaign.find(
        "#label-mab-new-campaign-difficulty-hard"
      );
  };

  self.loadEvents = () => {
    self.Buttons.NewCampaign_ShowContainer.on("click", (e) => {
      e.preventDefault();

      self.mainMenu_HideContainer();

      self.newCampaign_ShowContainer();
    });

    self.Buttons.NewCampaign_HideContainer.on("click", (e) => {
      e.preventDefault();

      self.newCampaign_HideContainer();

      self.mainMenu_ShowContainerr();
    });

    self.Inputs.NewCampaign_PlayerNickName.on("input change", () => {
      self.checkFormFilling();
    });

    self.Inputs.NewCampaign_Difficulty_Easy.on("click", (e) => {
      self.paintDifficultyLabel("easy");
    });

    self.Inputs.NewCampaign_Difficulty_Medium.on("click", (e) => {
      self.paintDifficultyLabel("medium");
    });

    self.Inputs.NewCampaign_Difficulty_Hard.on("click", (e) => {
      self.paintDifficultyLabel("hard");
    });

    self.Buttons.NewCampaign_Start.on("click", (e) => {
      e.preventDefault();

      self.checkFormFilling();

      self.StartCampaign();
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
        document.addEventListener("keydown", self.self.closeOnAnyKey);
      },
      willClose: () => {
        // Clean up listener when modal closes
        document.removeEventListener("keydown", self.self.closeOnAnyKey);
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

  self.newCampaign_ShowContainer = () => {
    self.toggleContainerVisibility(self.Containers.NewCampaign);

    self.Inputs.NewCampaign_PlayerNickName.trigger("focus");
  };
  self.newCampaign_HideContainer = () => {
    self.Inputs.NewCampaign_PlayerNickName.val("");

    self.toggleContainerVisibility(self.Containers.NewCampaign);
  };

  self.StartCampaign = () => {
    self.Buttons.forEach((button) => {
      button.attr("disabled", true);
    });

    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/startmabcampaign",
      data: self.NewCampaign_Form.serialize(),
      xhrFields: {
        withCredentials: true,
      },
      success: (response) => {
        if (!response.content) {
          self.sweetAlertError(response.message);
          return;
        }

        self.sweetAlertSuccess("New Mab Campaign Started!");

        self.Battle_TriggerStart();
      },
      error: (err) => {
        self.sweetAlertError(err);
      },
      complete: () => {
        self.Buttons.forEach((button) => {
          button.attr("disabled", false);
        });
      },
    });
  };
  self.checkFormFilling = () => {
    const inputValue = self.Inputs.NewCampaign_PlayerNickName.val().trim();

    if (inputValue.length === 0) {
      self.Buttons.NewCampaign_Start.attr("disabled", true);
    } else {
      self.Buttons.NewCampaign_Start.attr("disabled", false);
    }
  };
  self.paintDifficultyLabel = (difficulty) => {
    self.DifficultyLabels.NewCampaign_Easy.removeClass("paint-green");
    self.DifficultyLabels.NewCampaign_Medium.removeClass("paint-yellow");
    self.DifficultyLabels.NewCampaign_Hard.removeClass("paint-red");

    switch (difficulty) {
      case "medium":
        self.DifficultyLabels.NewCampaign_Medium.addClass("paint-yellow");
        return;
      case "hard":
        self.DifficultyLabels.NewCampaign_Hard.addClass("paint-red");
        return;
      default:
        self.DifficultyLabels.NewCampaign_Easy.addClass("paint-green");
        return;
    }
  };

  self.mainMenu_ShowContainerr = () => {
    self.toggleContainerVisibility(self.Containers.MainMenu);
  };
  self.mainMenu_HideContainer = () => {
    self.toggleContainerVisibility(self.Containers.MainMenu);
  };
  self.Battle_TriggerStart = () => {};

  self.build = () => {
    self.loadReferences();
    self.loadEvents();
  };

  self.build();
}

$(function () {
  new mab_new_campaign();
});
