function mab_mine() {
  let self = this;

  self.IsBuilt = false;

  self.PlayerCardId = null;

  self.loadReferences = () => {
    self.DOM = $("#dom-medieval-auto-battler");

    self.MabContainersContent = self.DOM.find("#mab-containers-content");

    self.Containers = [];
    self.Containers[self.Containers.length] = self.Containers.MainMenu =
      self.DOM.find("#container-mab-main-menu");
    self.Containers[self.Containers.length] = self.Containers.Mine =
      self.DOM.find("#container-mab-mine");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.Mine_ShowContainer =
      self.Containers.MainMenu.find("#button-mab-mine-show-container");
    self.Buttons[self.Buttons.length] = self.Buttons.Mine_HideContainer =
      self.Containers.Mine.find("#button-mab-mine-hide-container");
    self.Buttons[self.Buttons.length] = self.Buttons.Mine_ExtractRawMaterial =
      self.Containers.Mine.find("#button-mab-mine-forge");
    self.Buttons[self.Buttons.length] = self.Buttons.Mine_Sharpen =
      self.Containers.Mine.find("#button-mab-mine-sharpen");
    self.Buttons[self.Buttons.length] = self.Buttons.Mine_Melt =
      self.Containers.Mine.find("#button-mab-mine-melt");

    self.Mine_ListPlayerCards_Select2 = self.Containers.Mine.find(
      "#select-mab-mine-player-cards"
    );

    self.Blocks = [];
    self.Blocks[self.Blocks.length] = self.Blocks.Mine_CoinsBlock =
      self.Containers.Mine.find("#block-mab-mine-coins");

    self.Blocks[self.Blocks.length] = self.Blocks.Mine_BrassBlock =
      self.Containers.Mine.find("#block-mab-mine-brass");
    self.Blocks[self.Blocks.length] = self.Blocks.Mine_CopperBlock =
      self.Containers.Mine.find("#block-mab-mine-copper");
    self.Blocks[self.Blocks.length] = self.Blocks.Mine_Iron =
      self.Containers.Mine.find("#block-mab-mine-iron");

    self.Blocks[self.Blocks.length] = self.Blocks.Mine_SteelBlock =
      self.Containers.Mine.find("#block-mab-mine-steel");
    self.Blocks[self.Blocks.length] = self.Blocks.Mine_TitaniumBlock =
      self.Containers.Mine.find("#block-mab-mine-titanium");
    self.Blocks[self.Blocks.length] = self.Blocks.Mine_SilverBlock =
      self.Containers.Mine.find("#block-mab-mine-silver");

    self.Blocks[self.Blocks.length] = self.Blocks.Mine_GoldBlock =
      self.Containers.Mine.find("#block-mab-mine-gold");
    self.Blocks[self.Blocks.length] = self.Blocks.Mine_DiamondBlock =
      self.Containers.Mine.find("#block-mab-mine-diamond");
    self.Blocks[self.Blocks.length] = self.Blocks.Mine_AdamantiumBlock =
      self.Containers.Mine.find("#block-mab-mine-adamantium");

    self.Fields = [];
    self.Fields[self.Fields.length] = self.Fields.Mine_Coins =
      self.Containers.Mine.find("#span-mab-mine-owned-coins");
    self.Fields[self.Fields.length] = self.Fields.Mine_MiningPrice =
      self.Containers.Mine.find("#span-mab-mine-mining-price");

    self.Fields[self.Fields.length] = self.Fields.Mine_Brass =
      self.Containers.Mine.find("#span-mab-mine-owned-brass");
    self.Fields[self.Fields.length] = self.Fields.Mine_Copper =
      self.Containers.Mine.find("#span-mab-mine-owned-copper");
    self.Fields[self.Fields.length] = self.Fields.Mine_Iron =
      self.Containers.Mine.find("#span-mab-mine-owned-iron");

    self.Fields[self.Fields.length] = self.Fields.Mine_Steel =
      self.Containers.Mine.find("#span-mab-mine-owned-steel");
    self.Fields[self.Fields.length] = self.Fields.Mine_Titanium =
      self.Containers.Mine.find("#span-mab-mine-owned-titanium");
    self.Fields[self.Fields.length] = self.Fields.Mine_Silver =
      self.Containers.Mine.find("#span-mab-mine-owned-silver");

    self.Fields[self.Fields.length] = self.Fields.Mine_Gold =
      self.Containers.Mine.find("#span-mab-mine-owned-gold");
    self.Fields[self.Fields.length] = self.Fields.Mine_Diamond =
      self.Containers.Mine.find("#span-mab-mine-owned-diamond");
    self.Fields[self.Fields.length] = self.Fields.Mine_Adamantium =
      self.Containers.Mine.find("#span-mab-mine-owned-adamantium");

    self.Fields[self.Fields.length] = self.Fields.Mine_CardName =
      self.Containers.Mine.find("#span-mab-mine-card-name");
    self.Fields[self.Fields.length] = self.Fields.Mine_CardPower =
      self.Containers.Mine.find("#span-mab-mine-card-power");
    self.Fields[self.Fields.length] = self.Fields.Mine_CardUpperHand =
      self.Containers.Mine.find("#span-mab-mine-card-upper-hand");
    self.Fields[self.Fields.length] = self.Fields.Mine_CardType =
      self.Containers.Mine.find("#img-mab-mine-card-type");
    self.Fields[self.Fields.length] = self.Fields.Mine_CardCode =
      self.Containers.Mine.find("#span-mab-mine-card-code");

    self.Mine_Card = self.Containers.Mine.find("#mab-mine-card");
    self.Mine_Tools = self.Containers.Mine.find("#mab-mine-tools");
  };

  self.loadEvents = () => {
    self.Buttons.Mine_ShowContainer.on("click", (e) => {
      e.preventDefault();

      self.mainMenu_HideContainer();

      self.mine_ShowContainer();

      self.IsBuilt = false;

      self.Mine_ListResources();
    });
    self.Buttons.Mine_HideContainer.on("click", (e) => {
      e.preventDefault();

      self.mine_HideContainer();

      self.IsBuilt = false;

      self.mainMenu_ShowContainer();

      __global.MabMainMenuController.LoadCampaignStatistics();
    });

    self.Buttons.Mine_ExtractRawMaterial.on("click", (e) => {
      e.preventDefault();

      self.Mine_ExtractRawMaterial();
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
  self.mine_ShowContainer = () => {
    self.toggleContainerVisibility(self.Containers.Mine);
    self.mine_clearData();
  };
  self.mine_HideContainer = () => {
    self.toggleContainerVisibility(self.Containers.Mine);
  };

  self.Mine_ListResources = () => {
    $.ajax({
      method: "GET",
      url: "https://localhost:7081/users/mablistresources",
      xhrFields: {
        withCredentials: true,
      },
      success: function (resp) {
        if (!resp.content) {
          sweetAlertError(resp.message);

          return;
        }

        let resources = resp.content;

        self.Fields.Mine_Coins.empty();

        self.Fields.Mine_Brass.empty();
        self.Fields.Mine_Copper.empty();
        self.Fields.Mine_Iron.empty();

        self.Fields.Mine_Steel.empty();
        self.Fields.Mine_Titanium.empty();
        self.Fields.Mine_Silver.empty();

        self.Fields.Mine_Gold.empty();
        self.Fields.Mine_Diamond.empty();
        self.Fields.Mine_Adamantium.empty();

        self.Fields.Mine_Coins.html(resources.mab_Coins);

        self.Fields.Mine_Brass.html(resources.mab_Brass);

        self.Fields.Mine_Copper.html(resources.mab_Copper);

        self.Fields.Mine_Iron.html(resources.mab_Iron);

        self.Fields.Mine_Steel.html(resources.mab_Steel);

        self.Fields.Mine_Titanium.html(resources.mab_Titanium);

        self.Fields.Mine_Silver.html(resources.mab_Silver);

        self.Fields.Mine_Gold.html(resources.mab_Gold);

        self.Fields.Mine_Diamond.html(resources.mab_Diamond);

        self.Fields.Mine_Adamantium.html(resources.mab_Adamantium);

        self.Mine_ShowMiningDetails();
      },
      error: function (xhr, status, error) {
        sweetAlertError("Request failed:", error);
      },
    });
  };

  self.Mine_ShowMiningDetails = () => {
    $.ajax({
      method: "GET",
      url: `https://localhost:7081/users/mabshowminingdetails`,
      xhrFields: {
        withCredentials: true,
      },
      success: function (resp) {
        if (!resp.content) {
          self.sweetAlertError(resp.message);
          return;
        }

        self.mine_clearData();

        let miningDetails = resp.content;

        self.Fields.Mine_MiningPrice.html(miningDetails.mab_MiningPrice);

        self.Fields.Mine_CardName.html(miningDetails.mab_CardName);
        self.Fields.Mine_CardPower.html(miningDetails.mab_CardPower);
        self.Fields.Mine_CardUpperHand.html(miningDetails.mab_CardUpperHand);
        self.Fields.Mine_CardCode.html(miningDetails.mab_CardCode);
      },
      error: function (error) {
        sweetAlertError(error);
      },
    });
  };

  self.Mine_ExtractRawMaterial = () => {
    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/mabextractrawmaterial",
      xhrFields: {
        withCredentials: true, // Only if you're using cookies; otherwise can be removed
      },
      success: (resp) => {
        if (!resp.content) {
          self.sweetAlertError(resp.message);
          return;
        }

        self.mine_clearData();

        setTimeout(() => {
          self.Mine_ListResources();
        }, 200);
      },
      error: (err) => {
        self.sweetAlertError(err);
      },
    });
  };

  self.mine_clearData = () => {
    self.PlayerCardId = null;

    self.Fields.Mine_CardName.empty();
    self.Fields.Mine_CardPower.empty();
    self.Fields.Mine_CardUpperHand.empty();
    self.Fields.Mine_CardCode.empty();
  };

  self.build = () => {
    self.loadReferences();

    self.loadEvents();
  };

  self.build();
}

$(function () {
  new mab_mine();
});
