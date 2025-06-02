const { createApp } = Vue;

createApp({
  data() {
    return {
      loading: false,
      error: null,
    };
  },
  methods: {
    createNewCounter() {
      this.loading = true;
      fetch("/api/lifecounter/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => {
          if (!response.ok) throw new Error("Failed to create counter");
          return response.json();
        })
        .then((data) => {
          console.log("New life counter created:", data);
          // Redirect or update UI
        })
        .catch((err) => {
          this.error = err.message;
          console.error(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    loadCounter() {
      // Example placeholder logic
      console.log("Load existing life counter...");
      // You can fetch saved counters and display them in a list.
    },
    showStats() {
      console.log("Showing statistics...");
      // Show statistics page or modal here
    },
    closeSetup() {
      // Hide this setup screen if it's modal-like
    },
  },
}).mount("#lifecounter-setup");

/* JQUERY */
// function life_counter_setup() {
//   let self = this;

//   self.LoadReferences = () => {
//     self.DOM = $("#lifecounter-setup");

//     self.Buttons = [];
//     self.Buttons[self.Buttons.length] = self.Buttons.CloseSetUp = self.DOM.find(
//       "#close-lifecounter-setup"
//     );

//     self.Locations = [];
//     self.Locations[self.Locations.length] = self.Locations.UsersPage =
//       "/html/pages_users/users_page.html";
//   };

//   self.RedirectToUsersPage = () => {
//     window.location.href = self.Locations.UsersPage;
//   };

//   self.LoadEvents = () => {
//     self.Buttons.CloseSetUp.on("click", function (e) {
//       e.preventDefault();

//       self.RedirectToUsersPage();
//     });
//   };

//   self.Build = () => {
//     self.LoadReferences();
//     self.LoadEvents();
//   };

//   self.Build();
// }

// $(function () {
//   new life_counter_setup();
// });
