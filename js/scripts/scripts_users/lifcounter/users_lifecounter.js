function life_counter() {
  let self = this;

  self.LifeCounterId = null;
  self.LifeCounterManagerName = "";
  self.StartingLife = "";
  self.MaxLifePoints = "";

  self.GetLifeCounterId = () => {
    self.LifeCounterId = new URLSearchParams(window.location.search).get("id");
    console.log(self.LifeCounterId);
  };

  self.GetLifeCounterDetails = () => {
    if (!self.LifeCounterId) {
      console.log(self.LifeCounterId);
    } else {
      // Fetch Life Counter Details based on provided LifeCounterId
      $.ajax({
        url: `https://localhost:7081/users/getlifecounterdetails?LifeCounterId=${self.LifeCounterId}`,
        type: "GET",
        xhrFields: { withCredentials: true },
        success: function (response) {
          self.LifeCounterManagerName = response.content.name;
          self.StartingLife = response.content.startingLifePoints;
          self.MaxLifePoints = response.content.maxLifePoints;
          self.BuildLifeCounter();
        },
        error: function (xhr, status, error) {
          alert("Could not load life counter");
        },
      });
    }
  };

  self.LoadReferences = () => {
    self.DOM = $("#lifecounter-new");

    self.LifeCountersField = self.DOM.find("#lifecounters-field");

    self.Buttons = [];
    self.Buttons[self.Buttons.length] = self.Buttons.RefreshLifeCounters =
      self.DOM.find("#lifecounter-refresh-btn");
    self.Buttons[self.Buttons.length] = self.Buttons.AddLifeCounter =
      self.DOM.find("#lifecounter-add-btn");
    self.Buttons[self.Buttons.length] = self.Buttons.Close = self.DOM.find(
      "#lifecounter-close-btn"
    );
    self.Buttons[self.Buttons.length] = self.Buttons.IncreaseLifePoints =
      self.DOM.find(".increase-life-points");
    self.Buttons[self.Buttons.length] = self.Buttons.DecreaseLifePoints =
      self.DOM.find(".decrease-life-points");

    self.Fields = [];
    self.Fields[self.Fields.length] = self.Fields.LifeCounterManagerName =
      self.DOM.find("#lifecounter-manager-name");
    self.Fields[self.Fields.length] = self.Fields.PlayerName =
      self.DOM.find(".player-title");

    self.Fields[self.Fields.length] = self.Fields.PlayerStartingLifePoints =
      self.DOM.find(".player-lifepoints");

    self.Locations = [];
    self.Locations[self.Locations.length] = self.Locations.UsersPage =
      "/html/pages_users/users_page.html";
    self.Locations[self.Locations.length] = self.Locations.SetUpLifeCounter =
      "/html/pages_users/lifecounter/users_lifecounter_setup.html";
  };
  self.RedirectToUsersPage = () => {
    window.location.href = self.Locations.UsersPage;
  };

  function sweetAlertSuccess(title_text, message_text) {
    Swal.fire({
      position: "center",
      cancelButtonText: "close",
      icon: "success",
      theme: "bulma",
      title: title_text,
      text: message_text || "",
      showConfirmButton: true,
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

    closeOnAnyKey();
  };

  self.BuildLifeCounter = () => {
    const formData = new FormData();
    formData.append("LifeCounterId", self.LifeCounterId);
    formData.append("PlayersCount", 1);
    formData.append("StartingLifePoints", self.StartingLife);

    $.ajax({
      type: "POST",
      url: "https://localhost:7081/users/startlifecountermanager",
      data: formData,
      processData: false,
      contentType: false,
      xhrFields: {
        withCredentials: true, // Only if you're using cookies; otherwise can be removed
      },
      success: (resp) => {
        sweetAlertSuccess(resp.message);

        self.Fields.LifeCounterManagerName.html(
          `<span>${self.LifeCounterManagerName}</span>`
        );

        self.Fields.PlayerName.html(`Player Test`);

        self.Fields.PlayerStartingLifePoints.html(`${self.StartingLife}`);
      },
      error: (err) => {
        sweetAlertError(err);
      },
      complete: () => {},
    });
  };

  self.Build = () => {
    self.GetLifeCounterId();
    self.LoadReferences();
    self.LoadEvents();
    self.GetLifeCounterDetails();
  };

  self.Build();
}

$(function () {
  new life_counter();
});
