function loadHeader() {
  const header = document.createElement("header");
  header.className = "header";
  header.innerHTML = `
    <header class="header">
      <a href="index.html" class="logo">BBG <span>LIKE</span></a>
      
      
      <nav class="navbar">
        <div class="navOptions">
          <a href="index.html">HOME</a>
          <a href="explore.html">EXPLORE</a>
          <a class="anonymous-clearance" href="users_authentication.html">USER</a>
          <a class="admins-clearance d-none" href="admins.html">ADMIN</a>
          <a class="devs-clearance d-none" href="devs.html">DEV</a>
          <div class="profile-configs loggedIn-clearance">                                  
        </div>

        <div class="navHamburger">
          <nav class="navbar navbar-expand-lg">
            <div class="container-fluid">
              <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                  <i class="bi bi-list"></i>                
              </button>
              <div class="collapse navbar-collapse" id="navbarTogglerDemo01">                 
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                  <li class="nav-item">
                    <a class="nav-link" href="index.html">HOME</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="explore.html">EXPLORE</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link anonymous-clearance" href="users_authentication.html">USER</a>
                  </li>
                  <li class="nav-item admins-clearance d-none">
                    <a class="nav-link" href="admins.html">ADMIN</a>
                  </li>
                  <li class="nav-item devs-clearance d-none">
                    <a class="nav-link" href="devs.html">DEV</a>
                  </li>        
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </nav>
    </header>
  `;
  document.body.appendChild(header);
}

document.addEventListener("DOMContentLoaded", async function () {
  loadHeader();

  // Wait a little bit to ensure header is fully added
  setTimeout(async function () {
    // Fetch user status
    const userData = await fetch(
      "https://localhost:7081/users/validatestatus",
      {
        method: "GET",
        credentials: "include",
      }
    ).then((response) => response.json());

    if (userData.content.isUserLoggedIn) {
      // Fetch user role
      const roleData = await fetch("https://localhost:7081/users/getrole", {
        method: "GET",
        credentials: "include",
      }).then((response) => response.json());

      if (roleData.content.role === "Developer") {
        $(".anonymous-clearance").addClass("d-none");
        $(".devs-clearance").removeClass("d-none");
        $(".loggedIn-clearance").removeClass("d-none");
      } else if (roleData.content.role === "Administrator") {
        $(".admins-clearance").removeClass("d-none");
        $(".loggedIn-clearance").removeClass("d-none");
      } else if (roleData.content.role === "User") {
        $(".devs-clearance").addClass("d-none");
        $(".admins-clearance").addClass("d-none");
        $(".loggedIn-clearance").removeClass("d-none");
      }

      // Attach logout event after role is handled
      $(".logOut").on("click", async function (e) {
        e.preventDefault();

        const response = await fetch("https://localhost:7081/users/signout", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => res.json());

        if (response.content?.isUserSignOut) {
          // Successfully logged out
          window.location.href = "index.html";
        } else {
          alert("Failed to log out. Please try again.");
        }
      });
    } else {
      window.location.href = "users_authentication.html"; // If not logged in
    }
  }, 100); // Small timeout to wait header rendering
});
