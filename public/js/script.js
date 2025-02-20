const gamesContainer = document.getElementById("games-container");

document.addEventListener("click", async (event) => {
    if (event.target.classList.contains("delete-btn")) 
    {

        const gameId = event.target.getAttribute("data-id");
        try 
        {
            const response = await fetch(`/deletegame/${gameId}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Failed to delete game");

            fetchGames(); // Refresh the game list
        } catch (err) 
        {
            console.error("Error deleting game:", err);
        }
    }
});

const fetchgames = async ()=>{
    try{
        //fetch data from server
        const response = await fetch("/games");
        if(!response.ok){
            throw new Error("Failed to get details");
        }

        //Parse json
        const games = await response.json();
        console.log(games);
        //Format the data to html
        gamesContainer.innerHTML = "";

        games.forEach((game) => {
            const gameDiv = document.createElement("div");
            gameDiv.className = "games";
            gameDiv.innerHTML = `${game.Name} ${game.Developer} ${game.Designer}<button class="delete-btn" data-id="${game._id}">Delete</button> <a href="updategame.html?id=${game._id}"><button class="update-btn">Update</button></a>`;
            gamesContainer.appendChild(gameDiv);
        });

    }catch(error){
        console.error("Error: ", error);
        gamesContainer.innerHTML = "<p style='color:red'>Failed to get Games</p>";
    }
    
    
}

fetchgames();