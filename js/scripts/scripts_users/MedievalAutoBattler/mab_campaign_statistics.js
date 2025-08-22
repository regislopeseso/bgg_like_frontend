function mab_campaign_statistics() {
  let self = this;
  self.IsBuilt = false;
  self.CurrentPlayerNickName = "";

  self.loadReferences = () => {
    self.DOM = $("#dom-medieval-auto-battler");

    self.Containers = [];
    self.Containers[self.Containers.length] = self.Containers.MainMenu =
      self.DOM.find("#container-mab-main-menu");
    self.Containers.CampaignStatistics = self.DOM.find(
      "#container-mab-campaign-statistics"
    );

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.ShowContainer =
      self.Containers.MainMenu.find(
        "#button-mab-campaign-statistics-show-container"
      );
    self.Buttons[self.Buttons.length] = self.Buttons.HideContainer =
      self.Containers.CampaignStatistics.find(
        "#button-mab-campaign-statistics-hide-container"
      );
    self.Buttons[self.Buttons.length] = self.Buttons.EditPlayerNickname =
      self.Containers.CampaignStatistics.find(
        "#button-mab-campaign-statistics-edit-player-nickname"
      );
    self.Buttons[self.Buttons.length] = self.Buttons.ConfirmNewPlayerNickName =
      self.Containers.CampaignStatistics.find(
        "#button-mab-campaign-statistics-confirm-new-player-nickname"
      );

    self.Inputs = [];
    self.Inputs[self.Inputs.length] = self.Inputs.NewPlayerNickname =
      self.Containers.CampaignStatistics.find(
        "#input-mab-campaign-statistics-new-player-nickname"
      );

    self.Fields = [];
    self.Fields[self.Fields.length] = self.Fields.PlayerLevel =
      self.Containers.CampaignStatistics.find(
        "#field-mab-campaign-statistics-player-level"
      );
    self.Fields[self.Fields.length] = self.Fields.GoldStash =
      self.Containers.CampaignStatistics.find(
        "#field-mab-campaign-statistics-gold-stash"
      );
    self.Fields[self.Fields.length] = self.Fields.BoostersOpened =
      self.Containers.CampaignStatistics.find(
        "#field-mab-campaign-statistics-boosters-opened"
      );
    self.Fields[self.Fields.length] = self.Fields.DecksOwned =
      self.Containers.CampaignStatistics.find(
        "#field-mab-campaign-statistics-decks-owned"
      );
    self.Fields[self.Fields.length] = self.Fields.BattlesCount =
      self.Containers.CampaignStatistics.find(
        "#field-mab-campaign-statistics-battles-count"
      );
    self.Fields[self.Fields.length] = self.Fields.BattlesWon =
      self.Containers.CampaignStatistics.find(
        "#field-mab-campaign-statistics-battles-won"
      );
    self.Fields[self.Fields.length] = self.Fields.BattlesLost =
      self.Containers.CampaignStatistics.find(
        "#field-mab-campaign-statistics-battles-lost"
      );

    self.Images = [];
    self.Images[self.Images.length] = self.Images.Trophy_AllCardsCollected =
      self.Containers.CampaignStatistics.find(
        "#img-mab-campaign-statistics-all-cards-collected-trophy"
      );
    self.Images[self.Images.length] = self.Images.Trophy_AllNpcsDefeated =
      self.Containers.CampaignStatistics.find(
        "#img-mab-campaign-statistics-all-npcs-defeated-trophy"
      );
  };

  self.loadEvents = () => {
    self.Buttons.ShowContainer.on("click", (e) => {
      e.preventDefault();

      self.mainMenu_HideContainer();

      self.campaignStatistics_ShowContainer();
    });

    self.Buttons.HideContainer.on("click", (e) => {
      e.preventDefault();

      self.campaignStatistics_HideContainer();

      self.mainMenu_ShowContainer();

      setTimeout(() => {
        self.reset_EditPlayerNickname_ButtonAndInput();
      }, 150);
    });

    self.Buttons.EditPlayerNickname.on("click", (e) => {
      e.preventDefault();

      self.Inputs.NewPlayerNickname.prop("readonly", false)
        .removeClass("current-data")
        .trigger("select");

      self.Inputs.NewPlayerNickname.prop("required", true);

      self.Buttons.EditPlayerNickname.prop("disabled", true);

      self.Buttons.ConfirmNewPlayerNickName.prop("disabled", false);
    });

    self.Inputs.NewPlayerNickname.on("input change", () => {
      self.checkFormFilling();
    });

    self.Buttons.ConfirmNewPlayerNickName.on("click", (e) => {
      e.preventDefault();

      self.EditPlayerNickname();
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

  self.campaignStatistics_ShowContainer = () => {
    self.toggleContainerVisibility(self.Containers.CampaignStatistics);

    self.LoadCampaignStatistics();
  };
  self.campaignStatistics_HideContainer = () => {
    self.toggleContainerVisibility(self.Containers.CampaignStatistics);
  };

  self.LoadCampaignStatistics = () => {
    $.ajax({
      type: "GET",
      url: `https://localhost:7081/users/showmabcampaignstatistics`,
      xhrFields: { withCredentials: true },
      success: function (response) {
        if (!response.content) {
          self.sweetAlertError(response.message_text);
          return;
        }

        let mabCampaignDB = response.content;
        self.CurrentPlayerNickName = mabCampaignDB.mabPlayerNickName;

        self.Inputs.NewPlayerNickname.val(self.CurrentPlayerNickName);

        self.Fields.PlayerLevel.html(
          `<strong>${mabCampaignDB.playerLevel}</strong>`
        );
        self.Fields.GoldStash.html(
          `<strong>${mabCampaignDB.goldstash}</strong>`
        );
        self.Fields.BoostersOpened.html(
          `<strong>${mabCampaignDB.countBoosters}</strong>`
        );
        self.Fields.BattlesCount.html(
          `<strong>${mabCampaignDB.countMatches}</strong>`
        );
        self.Fields.BattlesWon.html(
          `<strong>${mabCampaignDB.countVictories}</strong>`
        );
        self.Fields.BattlesLost.html(
          `<strong>${mabCampaignDB.countDefeats}</strong>`
        );

        self.Fields.DecksOwned.html(
          `<strong>${mabCampaignDB.decksOwned}</strong>`
        );

        if (mabCampaignDB.allCardsCollectedTrophy == true) {
          self.Imgs.Trophy_AllCardsCollected.attr(
            "src",
            "/images/icons/trophy_allcardscollected_achieved.svg"
          );
        }

        if (mabCampaignDB.allNpcsDefeatedTrophy == true) {
          self.Imgs.Trophy_AllNpcsDefeated.attr(
            "src",
            "/images/icons/trophy_allnpcsdefeated_achieved.svg"
          );
        }
      },
      error: function (xhr, status, error) {
        self.sweetAlertError("Could not load life counter");
      },
    });
  };

  self.EditPlayerNickname = () => {
    let newMabPlayerNickname = self.Inputs.NewPlayerNickname.val().trim();

    if (
      newMabPlayerNickname.toLocaleLowerCase() ===
      self.CurrentPlayerNickName.toLocaleLowerCase()
    ) {
      self.reset_EditPlayerNickname_ButtonAndInput();

      return;
    }

    if (!newMabPlayerNickname || newMabPlayerNickname.length < 1) {
      self.sweetAlertError("Please fill the Nickname field!");

      return;
    }

    $.ajax({
      type: "PUT",
      url: "https://localhost:7081/users/editmabplayernickname",
      data: JSON.stringify({
        NewMabPlayerNickname: newMabPlayerNickname,
      }),
      contentType: "application/json",
      xhrFields: {
        withCredentials: true,
      },
      success: (resp) => {
        if (!resp.content) {
          self.sweetAlertError(resp.message);
          return;
        }

        self.CurrentPlayerNickName = newMabPlayerNickname;

        self.sweetAlertSuccess(resp.message);
      },
      error: (err) => {
        self.sweetAlertError(err);
      },
      complete: () => {
        self.reset_EditPlayerNickname_ButtonAndInput();
      },
    });
  };
  self.checkFormFilling = () => {
    const inputValue = self.Inputs.NewPlayerNickname.val().trim();

    if (inputValue.length === 0) {
      self.Buttons.ConfirmNewPlayerNickName.attr("disabled", true);
    } else {
      self.Buttons.ConfirmNewPlayerNickName.attr("disabled", false);
    }
  };
  self.reset_EditPlayerNickname_ButtonAndInput = () => {
    const playerNickName = self.Inputs.NewPlayerNickname.val().trim();

    self.Inputs.NewPlayerNickname.val("");

    setTimeout(() => {
      self.Inputs.NewPlayerNickname.val(playerNickName)
        .prop("readonly", true)
        .addClass("current-data")
        .blur();
    }, 1);

    self.Buttons.EditPlayerNickname.prop("disabled", false);

    self.Buttons.ConfirmNewPlayerNickName.prop("disabled", true);
  };

  self.mainMenu_ShowContainer = () => {
    self.toggleContainerVisibility(self.Containers.MainMenu);
  };
  self.mainMenu_HideContainer = () => {
    self.toggleContainerVisibility(self.Containers.MainMenu);
  };

  self.build = () => {
    self.loadReferences();
    self.loadEvents();
  };

  self.build();
}

$(function () {
  new mab_campaign_statistics();
});
