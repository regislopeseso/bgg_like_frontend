function life_counter() {
  let self = this;

  self.LifeCounterId = null;
  self.LifeCounterManagerName = "";
  self.DefaultPlayersCount = "";
  self.StartingLife = "";
  self.MaxLifePoints = "";

  self.GetLifeCounterId = () => {
    self.LifeCounterId = new URLSearchParams(window.location.search).get("id");
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
          self.DefaultPlayersCount = response.content.defaultPlayersCount;
          self.StartingLife = response.content.startingLifePoints;
          self.MaxLifePoints = response.content.maxLifePoints;
          self.BuildLifeCounter();
          console.log("Players count: ", self.DefaultPlayersCount);
          self.OrganizeLifeCounters(self.DefaultPlayersCount);
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

    self.LifeCountersOrganizer = self.DOM.find("#lifecounters-organizer");

    self.FirstPlayerBlock = self.DOM.find(".player-block").eq(0);
    self.SecondPlayerBlock = self.DOM.find(".player-block").eq(1);
    self.ThirdPlayerBlock = self.DOM.find(".player-block").eq(2);
    self.FourthPlayerBlock = self.DOM.find(".player-block").eq(3);
    self.FifthPlayerBlock = self.DOM.find(".player-block").eq(4);
    self.SixthPlayerBlock = self.DOM.find(".player-block").eq(5);

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

    self.LifeCounterInstances = [];
    self.LifeCounterInstances[self.LifeCounterInstances.length] =
      self.LifeCounterPlayer1 = self.DOM.find("#lifecounter1");
    self.LifeCounterInstances[self.LifeCounterInstances.length] =
      self.LifeCounterPlayer2 = self.DOM.find("#lifecounter2");
    self.LifeCounterInstances[self.LifeCounterInstances.length] =
      self.LifeCounterPlayer3 = self.DOM.find("#lifecounter3");
    self.LifeCounterInstances[self.LifeCounterInstances.length] =
      self.LifeCounterPlayer4 = self.DOM.find("#lifecounter4");
    self.LifeCounterInstances[self.LifeCounterInstances.length] =
      self.LifeCounterPlayer5 = self.DOM.find("#lifecounter5");
    self.LifeCounterInstances[self.LifeCounterInstances.length] =
      self.LifeCounterPlayer6 = self.DOM.find("#lifecounter6");

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

  self.OrganizeLifeCounters = (lifeCountersCount) => {
    function ShowOneLifeCounter() {
      if (self.LifeCounterInstances[0].hasClass("d-none")) {
        self.LifeCounterInstances[0].removeClass("d-none");
      }
      for (let i = 1; i < self.LifeCounterInstances.length; i++) {
        self.LifeCounterInstances[i].addClass("d-none");
      }

      self.LifeCountersOrganizer.css({
        "grid-template-columns": "repeat(1, 1fr)",
        "grid-template-rows": "repeat(1, 1fr)",
      });

      self.FirstPlayerBlock.css({
        "grid-column-start": "1",
        "grid-column-end": "2",

        "grid-row-start": "1",
        "grid-row-end": "2",
      });
    }

    function ShowTwoLifeCounters() {
      for (let i = 0; i < 2; i++) {
        if (self.LifeCounterInstances[i].hasClass("d-none")) {
          self.LifeCounterInstances[i].removeClass("d-none");
        }
      }
      for (let i = 2; i < self.LifeCounterInstances.length; i++) {
        self.LifeCounterInstances[i].addClass("d-none");
      }

      self.LifeCountersOrganizer.css({
        "grid-template-columns": "repeat(1, 1fr)",
        "grid-template-rows": "repeat(2, 1fr)",
      });

      self.FirstPlayerBlock.css({
        "transform": "rotate(180deg)",

        "grid-column-start": "1",
        "grid-column-end": "2",

        "grid-row-start": "1",
        "grid-row-end": "2",
      });

      self.SecondPlayerBlock.css({
        "grid-column-start": "1",
        "grid-column-end": "2",

        "grid-row-start": "2",
        "grid-row-end": "3",
      });
    }

    function ShowThreeLifeCounters() {
      for (let i = 0; i < 3; i++) {
        if (self.LifeCounterInstances[i].hasClass("d-none")) {
          self.LifeCounterInstances[i].removeClass("d-none");
        }
      }
      for (let i = 3; i < self.LifeCounterInstances.length; i++) {
        self.LifeCounterInstances[i].addClass("d-none");
      }

      self.LifeCountersOrganizer.css({
        "grid-template-columns": "repeat(2, 1fr)",
        "grid-template-rows": "repeat(2, 1fr)",
      });

      self.FirstPlayerBlock.css({
        "transform": "rotate(180deg)",

        "grid-column-start": "1",
        "grid-column-end": "3",

        "grid-row-start": "1",
        "grid-row-end": "2",
      });

      self.SecondPlayerBlock.css({
        "display": "flex",
        "flex-direction": "column",

        "grid-column-start": "1",
        "grid-column-end": "2",

        "grid-row-start": "2",
        "grid-row-end": "3",
      });
      self.SecondPlayerBlock.find("button .bi-dash-lg").addClass("rotate-i");
      self.SecondPlayerBlock.find(".playerstats").addClass(
        "rotate-text-clockWise"
      );

      self.ThirdPlayerBlock.css({
        "display": "flex",
        "flex-direction": "column",

        "grid-column-start": "2",
        "grid-column-end": "3",

        "grid-row-start": "2",
        "grid-row-end": "3",
      });
      self.ThirdPlayerBlock.find("button .bi-dash-lg").addClass("rotate-i");

      self.ThirdPlayerBlock.find(".playerstats").addClass(
        "rotate-text-antiClockWise"
      );
    }

    function ShowFourLifeCounters() {
      for (let i = 0; i < 4; i++) {
        if (self.LifeCounterInstances[i].hasClass("d-none")) {
          self.LifeCounterInstances[i].removeClass("d-none");
        }
      }
      for (let i = 4; i < self.LifeCounterInstances.length; i++) {
        self.LifeCounterInstances[i].addClass("d-none");
      }

      self.LifeCountersOrganizer.css({
        "grid-template-columns": "repeat(2, 1fr)",
        "grid-template-rows": "repeat(2, 1fr)",
      });

      self.FirstPlayerBlock.css({
        "transform": "rotate(90deg)",

        "grid-column-start": "1",
        "grid-column-end": "2",

        "grid-row-start": "1",
        "grid-row-end": "2",
      });

      self.SecondPlayerBlock.css({
        "transform": "rotate(90deg)",

        "grid-column-start": "1",
        "grid-column-end": "2",

        "grid-row-start": "2",
        "grid-row-end": "3",
      });

      self.ThirdPlayerBlock.css({
        "transform": "rotate(-90deg)",

        "grid-column-start": "2",
        "grid-column-end": "3",

        "grid-row-start": "1",
        "grid-row-end": "2",
      });

      self.FourthPlayerBlock.css({
        "transform": "rotate(-90deg)",

        "grid-column-start": "2",
        "grid-column-end": "3",

        "grid-row-start": "2",
        "grid-row-end": "3",
      });
    }

    function ShowFiveLifeCounters() {
      for (let i = 0; i < 5; i++) {
        if (self.LifeCounterInstances[i].hasClass("d-none")) {
          self.LifeCounterInstances[i].removeClass("d-none");
        }
      }
      for (let i = 5; i < self.LifeCounterInstances.length; i++) {
        self.LifeCounterInstances[i].addClass("d-none");
      }
    }

    function ShowSixLifeCounters() {
      for (let i = 0; i < self.LifeCounterInstances.length; i++) {
        if (self.LifeCounterInstances[i].hasClass("d-none")) {
          self.LifeCounterInstances[i].removeClass("d-none");
        }
      }
    }

    switch (lifeCountersCount) {
      case 1:
        return ShowOneLifeCounter();
      case 2:
        return ShowTwoLifeCounters();
      case 3:
        return ShowThreeLifeCounters();
      case 4:
        return ShowFourLifeCounters();
      case 5:
        return ShowFiveLifeCounters();
      case 6:
        return ShowSixLifeCounters();
      default:
        return ShowOneLifeCounter();
    }
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
