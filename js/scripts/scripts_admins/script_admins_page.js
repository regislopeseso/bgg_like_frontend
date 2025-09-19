function admins_page() {
  let self = this;

  self.IsBuilt = false;

  self.CheckCredentials = async function () {
    $("body").loadpage("charge");

    let userData = null;
    let roleData = null;

    try {
      const statusResponse = await fetch(
        "https://localhost:7081/users/validatestatus",
        {
          method: "GET",
          credentials: "include",
        }
      );

      userData = await statusResponse.json();

      if (userData.content.isUserLoggedIn === true) {
        const roleResponse = await fetch(
          "https://localhost:7081/users/getrole",
          {
            method: "GET",
            credentials: "include",
          }
        );

        roleData = await roleResponse.json();

        if (
          roleData.content.role === "Admin" ||
          roleData.content.role === "Developer"
        ) {
          self.Build();
        }
      } else {
        sweetAlertError(userData.message);
      }
    } catch (err) {
      sweetAlertError("Failed to fetch authentication status or role", err);
    }
  };

  self.LoadReferences = () => {
    self.DOM = $("#body-admins-page");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.BgData =
      self.DOM.find("#bg-data-button");
    self.Buttons[self.Buttons.length] = self.Buttons.LoadBgData =
      self.DOM.find("#load-bg-button");
    self.Buttons[self.Buttons.length] = self.Buttons.LoadBgCategoryData =
      self.DOM.find("#load-category-button");
    self.Buttons[self.Buttons.length] = self.Buttons.LoadBgMechanicData =
      self.DOM.find("#load-mechanic-button");

    self.Buttons[self.Buttons.length] = self.Buttons.MabData =
      self.DOM.find("#mab-data-button");
    self.Buttons[self.Buttons.length] = self.Buttons.LoadMabQuestsData =
      self.DOM.find("#button-mab-quests-load");
    self.Buttons[self.Buttons.length] = self.Buttons.LoadMabCardsData =
      self.DOM.find("#button-mab-cards-load");
    self.Buttons[self.Buttons.length] = self.Buttons.LoadMabNpcsData =
      self.DOM.find("#button-mab-npcs-load");

    self.BgToolsWrapper = self.DOM.find("#bg-tools-wrapper");
    self.MabToolsWrapper = self.DOM.find("#mab-tools-wrapper");

    self.Modals = [];
    self.Modals[self.Modals.length] = self.Modals.BgData =
      self.DOM.find("#bg-modal");
    self.Modals[self.Modals.length] = self.Modals.BgCategoryData =
      self.DOM.find("#category-modal");
    self.Modals[self.Modals.length] = self.Modals.BgMechanicData =
      self.DOM.find("#mechanic-modal");

    self.Modals[self.Modals.length] = self.Modals.MabQuestsData =
      self.DOM.find("#mab-quests-modal");
    self.Modals[self.Modals.length] = self.Modals.MabCardsData =
      self.DOM.find("#mab-cards-modal");
    self.Modals[self.Modals.length] = self.Modals.MabNpcsData =
      self.DOM.find("#mab-npcs-modal");

    self.Locations = [];
    self.Locations[self.Locations.length] = self.Locations.Modal_BgDataBase =
      "admins_modal_bg_data_base.html";
    self.Locations[self.Locations.length] =
      self.Locations.Modal_BgCategoryData =
        "admins_modal_category_data_base.html";
    self.Locations[self.Locations.length] =
      self.Locations.Modal_BgMechanicData =
        "admins_modal_mechanic_data_base.html";

    self.Locations[self.Locations.length] = self.Locations.Modal_MabQuestsData =
      "modal_mab_quests_db.html";
    self.Locations[self.Locations.length] = self.Locations.Modal_MabCardsData =
      "modal_mab_cards_db.html";
    self.Locations[self.Locations.length] = self.Locations.Modal_MabNpcsData =
      "modal_mab_npcs_db.html";
  };

  self.LoadEvents = () => {
    // Toggle BG Data menu
    self.Buttons.BgData.on("click", (e) => {
      e.preventDefault();

      self.MabToolsWrapper.hide();

      self.BgToolsWrapper.slideToggle();
    });

    // Toggle BG Data menu
    self.Buttons.MabData.on("click", (e) => {
      e.preventDefault();

      self.BgToolsWrapper.hide();

      self.MabToolsWrapper.slideToggle();
    });

    // Load BOARD GAMES (BG) modal HTML, THEN initialize modal logic
    self.Modals.BgData.load(self.Locations.Modal_BgDataBase, function () {
      // Hook up the button to open the modal AFTER it's ready
      self.Buttons.LoadBgData.on("click", function () {
        __global.BgDataBaseModalController.OpenModal();
      });
    });

    // Load BG CATEGORY modal HTML, THEN initialize modal logic
    self.Modals.BgCategoryData.load(
      self.Locations.Modal_BgCategoryData,
      function () {
        // Hook up the button to open the modal AFTER it's ready
        self.Buttons.LoadBgCategoryData.on("click", function () {
          __global.CategoryDataBaseModalController.OpenModal();
        });
      }
    );

    // Load BG MECHANIC modal HTML, THEN initialize modal logic
    self.Modals.BgMechanicData.load(
      self.Locations.Modal_BgMechanicData,
      function () {
        // Hook up the button to open the modal AFTER it's ready
        self.Buttons.LoadBgMechanicData.on("click", function () {
          __global.MechanicDataBaseModalController.OpenModal();
        });
      }
    );

    // MEDIEVAL AUTO BATTLER (MAB)
    // Load MAB Quests modal HTML, THEN initialize modal logic
    self.Modals.MabQuestsData.load(
      self.Locations.Modal_MabQuestsData,
      function () {
        // Hook up the button to open the modal AFTER it's ready
        self.Buttons.LoadMabQuestsData.on("click", function () {
          __global.MabQuestsDataBaseModalController.OpenModal();
        });
      }
    );

    // Load MAB CARDS modal HTML, THEN initialize modal logic
    self.Modals.MabCardsData.load(
      self.Locations.Modal_MabCardsData,
      function () {
        // Hook up the button to open the modal AFTER it's ready
        self.Buttons.LoadMabCardsData.on("click", function () {
          __global.MabCardsDataBaseModalController.OpenModal();
        });
      }
    );

    // Load MAB NPCS modal HTML, THEN initialize modal logic
    self.Modals.MabNpcsData.load(self.Locations.Modal_MabNpcsData, function () {
      // Hook up the button to open the modal AFTER it's ready
      self.Buttons.LoadMabNpcsData.on("click", function () {
        __global.MabNpcsDataBaseModalController.OpenModal();
      });
    });
  };

  self.Build = () => {
    $("body").loadpage("demolish");

    if (self.IsBuilt == false) {
      self.LoadReferences();

      self.LoadEvents();

      self.IsBuilt = true;
    }
  };

  self.CheckCredentials();
}

$(function () {
  new admins_page();
});
