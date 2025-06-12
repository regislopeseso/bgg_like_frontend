function life_counter_menu() {
  let self = this;

  self.LoadReferences = () => {
    self.DOM = $("#lifecounter-setup");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.CloseSetUp = self.DOM.find(
      "#close-lifecounter-setup"
    );

    self.Buttons[self.Buttons.length] = self.Buttons.NewLifeCounter =
      self.DOM.find("#main-lifeCounter-newTemplate");
    self.Buttons[self.Buttons.length] = self.Buttons.StartLifeCounter =
      self.DOM.find("#lifecounter-start");
    self.Buttons[self.Buttons.length] = self.Buttons.LoadLifeCounter =
      self.DOM.find("#lifecounter-load");
    self.Buttons[self.Buttons.length] = self.Buttons.ShowLifeCounterStats =
      self.DOM.find("#show-stats");

    self.Locations = [];
    self.Locations[self.Locations.length] = self.Locations.UsersPage =
      "/html/pages_users/users_page.html";
    self.Locations[self.Locations.length] = self.Locations.NewLifeCounterPage =
      "/html/pages_users/lifecounter/users_lifecounter_setup.html";
    self.Locations[self.Locations.length] =
      self.Locations.StartLifeCounterPage =
        "/html/pages_users/lifecounter/users_lifecounter_start.html";
    self.Locations[self.Locations.length] = self.Locations.LoadLifeCounterPage =
      "/html/pages_users/lifecounter/users_lifecounter_load.html";
    self.Locations[self.Locations.length] =
      self.Locations.ShowLifeCounterStatsPage =
        "/html/pages_users/lifecounter/users_lifecounter_showstats.html";
  };

  self.RedirectToUsersPage = () => {
    window.location.href = self.Locations.UsersPage;
  };

  self.RedirectToNewLifeCounterPage = () => {
    window.location.href = self.Locations.NewLifeCounterPage;
  };
  self.RedirectToStartLifeCounterPage = () => {
    window.location.href = self.Locations.StartLifeCounterPage;
  };

  self.LoadEvents = () => {
    self.Buttons.CloseSetUp.on("click", function (e) {
      e.preventDefault();
      self.RedirectToUsersPage();
    });

    self.Buttons.NewLifeCounter.on("click", (e) => {
      e.preventDefault();
      self.RedirectToNewLifeCounterPage();
    });

    self.Buttons.StartLifeCounter.on("click", (e) => {
      e.preventDefault();
      self.RedirectToStartLifeCounterPage();
    });
  };

  self.Build = () => {
    self.LoadReferences();
    self.LoadEvents();
  };

  self.Build();
}

$(function () {
  new life_counter_menu();
});
