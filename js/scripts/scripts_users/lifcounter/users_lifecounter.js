function life_counter() {
  let self = this;

  self.LoadReferences = () => {
    self.DOM = $("#lifecounter-new");

    self.LifeCountersField = self.DOM.find("#lifecounters-field");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.RefreshLifeCounters =
      self.DOM.find("#lifecounter-refresh-btn");
    self.Buttons[self.Buttons.length] = self.Buttons.AddLifeCounter =
      self.DOM.find("#lifecounter-add-btn");
    self.Buttons[self.Buttons.length] = self.Buttons.Close = self.DOM.find(
      "#lifecounters-close-btn"
    );
    self.Buttons[self.Buttons.length] = self.Buttons.IncreaseLifePoints =
      self.DOM.find(".increase-life-points");
    self.Buttons[self.Buttons.length] = self.Buttons.DecreaseLifePoints =
      self.DOM.find(".decrease-life-points");

    self.Locations = [];
    self.Locations[self.Locations.length] = self.Locations.UsersPage =
      "/html/pages_users/users_page.html";
    self.Locations[self.Locations.length] = self.Locations.SetUpLifeCounter =
      "/html/pages_users/lifecounter/users_lifecounter_setup.html";
  };

  function sweetAlertError(title_text, message_text) {
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
        document.addEventListener("keydown", closeOnAnyKey);
      },
      willClose: () => {
        // Clean up listener when modal closes
        document.removeEventListener("keydown", closeOnAnyKey);
      },
    });
  }
  function closeOnAnyKey() {
    Swal.close();
  }

  self.LoadEvents = () => {
    self.Buttons.Close.on("click", function (e) {
      e.preventDefault();
      self.RedirectToUsersPage();
    });

    self.Buttons.AddLifeCounter.on("click", function (e) {
      e.preventDefault();
      self.AddLifeCounter();
    });

    closeOnAnyKey();
  };

  self.BuildLifeCounter = () => {
    return `
      <div class="player-block d-flex flex-column align-items-center m-3 w-100">
        <div class="d-flex flex-row justify-content-center align-items-center w-100 gap-5">
          <button
              id="lifecounter-instance-refresh-btn"
              class="btn btn-outline-warning p-3 h-50"
              type="button"
            >
            <i class="bi bi-arrow-clockwise"></i>
          </button>

          <div class="player-index d-flex text-center p-1">
            Player 1
          </div>

          <button
            id="lifecounter-instance-close-btn"
            class="btn btn-outline-danger p-3 h-50"
            type="button"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>        
        </div>
        

        <div class="lifecounter-wrapper d-flex flex-column align-items-center justify-content-center w-100 h-100">
          <button class="increase-life-points d-flex flex-fill align-items-start justify-content-center w-100">
            <i class="bi bi-chevron-compact-up"></i>
          </button>

          <div class="lifepoints">
            20
          </div>

          <button class="decrease-life-points d-flex flex-fill align-items-end justify-content-center w-100">
            <i class="bi bi-chevron-compact-down"></i>
          </button>
        </div>
      </div>
      `;
  };

  self.AddLifeCounter = () => {
    const newCounter = self.BuildLifeCounter(); // Should return the HTML
    self.LifeCountersField.append(newCounter);
  };

  self.Build = () => {
    self.LoadReferences();
    self.LoadEvents();
    self.AddLifeCounter();
  };

  self.Build();
}

$(function () {
  new life_counter();
});
