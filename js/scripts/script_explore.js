$(document).ready(function () {
  function loadRatedGames(data = {}) {
    $.get(
      "https://localhost:7081/explore/ratedboardgames",
      data,
      function (response) {
        // Verifica se existe a chave "content" na resposta
        if (!response.content || !Array.isArray(response.content)) {
          console.error("Unexpected response format:", response);
          return;
        }

        $(".table-ratedBG tbody").empty(); // Limpa a tabela

        $.each(response.content, function (index, item) {
          let tr = `
          <tr>
            <td>${index + 1}</td>  
            <td>${item.boardGameName}</td>
            <td>${item.avgRating}</td>
            <td>${item.ratingsCount}</td>
          </tr>
        `;
          $(".table-ratedBG tbody").append(tr);
        });

        console.log(response.message); // Exibe a mensagem da API no console
      }
    );
  }
  // Carrega os dados iniciais
  loadRatedGames();

  // function loadMostPlayedGames(data = {}) {
  //   $.get(
  //     "https://localhost:7081/explore/boardgamesrankings",
  //     data,
  //     function (response) {
  //       // Verifica se existe a chave "content" na resposta
  //       if (!response.content) {
  //         console.error("Unexpected response format:", response);
  //         return;
  //       }

  //       $(".table-mostPlayedBG tbody").empty(); // Limpa a tabela

  //       $.each(response.content, function (index, item) {
  //         console.log(item);
  //         $.each(item.mostPlayedBoardGames, function (bgindex, bgname) {
  //           console.log(bgname);
  //           let tr = `
  //                   <tr>
  //                     <td>${bgindex + 1}</td>
  //                     <td>${bgname}</td>
  //                   </tr>
  //                 `;
  //           $(".table-mostPlayedBG tbody").append(tr);
  //         });
  //       });

  //       console.log(response.message); // Exibe a mensagem da API no console
  //     }
  //   );
  // }
  // loadMostPlayedGames();
  function loadMostPlayedGames(data = {}) {
    $.get(
      "https://localhost:7081/explore/boardgamesrankings",
      data,
      function (response) {
        // Verifica se existe a chave "content" na resposta
        if (
          !response.content ||
          !Array.isArray(response.content.mostPlayedBoardGames)
        ) {
          console.error("Unexpected response format:", response);
          return;
        }

        $(".table-mostPlayedBG tbody").empty(); // Limpa a tabela

        // Acessa a lista de mostPlayedBoardGames
        const mostPlayedGames = response.content.mostPlayedBoardGames;

        // Verifica se a lista existe e tem elementos
        if (mostPlayedGames.length > 0) {
          $.each(mostPlayedGames, function (index, bgname) {
            let tr = `
            <tr>
              <td>${index + 1}</td>             
              <td>${bgname}</td>         
            </tr>
          `;
            $(".table-mostPlayedBG tbody").append(tr);
          });
        } else {
          $(".table-mostPlayedBG tbody").append(`
          <tr>
            <td colspan="2">No data available</td>
          </tr>
        `);
        }

        console.log(response.message); // Exibe a mensagem da API no console
      }
    );
  }

  // Call the function to load the most played games table
  loadMostPlayedGames();

  $("#boardGamesRanking").on("click", function () {
    event.preventDefault();

    $("#tbBoardGames").toggle();
  });
});
