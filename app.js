
// Les combinaisons gagnantes
const combi1 = [1, 2, 3];
const combi2 = [4, 5, 6];
const combi3 = [7, 8, 9];
const combi4 = [1, 4, 7];
const combi5 = [2, 5, 8];
const combi6 = [3, 6, 9];
const combi7 = [1, 5, 9];
const combi8 = [3, 5, 7];


const app = {

     /**
     * @function init()
     * @desc : Méthode qui se lance au chargement du DOM, qui initialise le jeu en déclenchant app.createMorpion()
     * @param 
     * @return 
     */
    init: () => {
        app.createMorpion();   
    },

    /**
     * Objet qui permet de savoir si le joueur X (le premier joueur) a joué ou non
     * C'est une sorte de "state" comme dans React, Vue etc...
     */
    whichPlayer: {
        playerX: true,
    },

    // Objet qui stockent les réponses de chaque joueur tout au long de la partie
    players: {
        playerX : [],
        playerO: [],
    },

    /**
     * @function createMorpion()
     * @desc : Méthode qui créé la grille du morpion
     * @param 
     * @return 
     */
    createMorpion: () => {

        const root =  document.getElementById('root');
        const morpion = document.createElement('div');
        const repoLink = document.createElement('a');
        repoLink.className ="github";
        repoLink.innerText = "Repo GitHub";
        repoLink.href = "https://github.com/ismael2m/morpion";
        morpion.className = "morpion";
        root.appendChild(morpion)
        let boxId = 0;
        let caseNb = 0;

        for (let i = 0; i< 3; i++) {
            const line = document.createElement('div');
            line.className = "line";
            morpion.appendChild(line)

            for (let j = 0; j< 3; j++) { 

                const box = document.createElement('button');
                box.className = `case case${caseNb+=1}`;
                box.setAttribute("id", boxId+=1)
                box.addEventListener('click', (e) => app.play(e.target.id))
                line.appendChild(box)
            }
        }

        root.appendChild(repoLink);
    },

    winOrDraw: (symbole, nul) => {
        const winDiv = document.createElement('div');
        const winMess = document.createElement('p');
        const btnGroup = document.createElement('div');
        const replay = document.createElement('button');
        const morpion = document.querySelector('.morpion');
        winDiv.className = "win";
        winMess.className = "win-message";

        if(nul) {
            winMess.innerText = "Match Nul!";
        } else {
            winMess.innerText = `le joueur ${symbole} a gagné!`;
        }
        btnGroup.className = "win-buttons";
        replay.className = "win-buttons-btn";
        replay.innerText = "Rejouer";
        replay.addEventListener('click', app.reload);

        btnGroup.appendChild(replay);
        winDiv.appendChild(winMess);
        winDiv.appendChild(btnGroup);
        morpion.appendChild(winDiv);

    },

    reload : () => {
        const morpion = document.querySelector('.morpion');
        const repoLink = document.querySelector('.github');
        const root =  document.getElementById('root');
        root.removeChild(morpion);
        root.removeChild(repoLink)
        let { playerX, playerO } = app.players;
        app.players.playerO = [];
        app.players.playerX = [];
        app.whichPlayer.playerX = true;

        app.createMorpion();
    },

    /**
     * @function play()
     * @desc : chaque joueur joue chacun à son tour. Le premier joueur possède le symbole X.
     * @param id : on récupère l'id de la case où le joueur a cliqué
     * @return 
     */
    play: (id) => {

        const { playerX, playerO } = app.players;
        
        if(app.whichPlayer.playerX) {
            const box = document.getElementById(id);
            const cross = new Image();
            cross.src = './img/close.png';
            cross.className = 'img';
            box.appendChild(cross);
            box.setAttribute("disabled", "")
            playerX.push(parseInt(id));
            app.checkGamePlayerX();     
            app.whichPlayer.playerX = false;   
        }
        else {
            const box = document.getElementById(id);
            const cross = new Image();
            cross.src = './img/dot.png';
            cross.className = 'img';
            box.appendChild(cross);
            box.setAttribute("disabled", "")
            playerO.push(parseInt(id));
            app.checkGamePlayerO();
            app.whichPlayer.playerX = true;
        }        
    },

    /**
     * @function checkGamePlayerX()
     * @desc : Méthode qui se déclenche tout au long de la partie pour vérifier les choix du joueur X 
     * afin de savoir s'il a gagné ou pas.
     * @param
     * @return
     */
    checkGamePlayerX: () => {

        const { playerX } = app.players;
        let symbole = "X";

        if (playerX.length === 5 ) {

            const newChoiceX = app.recheckPlayerX(playerX);

            if (newChoiceX === 'perdu') {

                symbole = "Match nul!"
                app.winOrDraw(symbole,true)
            }

            else {
                const newResult = app.switchChoice(newChoiceX.sort().toString());

                if (newResult) {
                    app.winOrDraw(symbole);
                }
            }
        }

        else if (playerX.length === 4 ) {

            const newChoiceX = app.recheckPlayerX(playerX);

            if (newChoiceX !== 'perdu') {
                const newResult = app.switchChoice(newChoiceX.sort().toString());

                if (newResult) {
                    app.winOrDraw(symbole);
                }
            }
        }

        else if( playerX.length > 2 ) {

            if (playerX.length === 3) {

                const choiceX = playerX.sort().toString();
            
                const result = app.switchChoice(choiceX);

                if (result) {
                    app.winOrDraw(symbole);
                } 
            }
        }     
    },

    /**
     * @function checkGamePlayerO()
     * @desc : Méthode qui se déclenche tout au long de la partie pour vérifier les choix du joueur O 
     * afin de savoir s'il a gagné ou pas.
     * @param
     * @return
     */
    checkGamePlayerO: () => {

        const { playerO } = app.players;
        const symbole = "O";

        if (playerO.length === 4 ) {

            const newChoiceO = app.recheckPlayerO(playerO);

            if (newChoiceO === 'perdu') {
                return "Le joueur O a perdu";
            }

            else {
                const newResult = app.switchChoice(newChoiceO.sort().toString());

                if (newResult) {
                    app.winOrDraw(symbole);
                }
            }
        }

        else if( playerO.length > 2 ) {
        
            if (playerO.length === 3) {

                const choiceO = playerO.sort();
            
                app.switchChoice(choiceO.toString());

                if (app.switchChoice(choiceO.toString())) {
                    app.winOrDraw(symbole);
                } 

                else {
                    return 'on continue'
                }        
            }
        }     
    },

    /**
     * @function recheckPlayerX(param)
     * @desc : Méthode de vérification des choix du joueur qui possède le X quand il a joué 4 ou 5 fois.
     * @param array : les choix du joueurX
     * @return array : tableau filtré avec la bonne combinaison sinon ça renvoie la string 'perdu"
     */
    recheckPlayerX: (choice) => {

        const newChoice= choice.sort();

        const filteredChoice1 = newChoice.filter((num) => combi1.includes(num))
        const filteredChoice2 = newChoice.filter((num) => combi2.includes(num))
        const filteredChoice3 = newChoice.filter((num) => combi3.includes(num))
        const filteredChoice4 = newChoice.filter((num) => combi4.includes(num))
        const filteredChoice5 = newChoice.filter((num) => combi5.includes(num))
        const filteredChoice6 = newChoice.filter((num) => combi6.includes(num))
        const filteredChoice7 = newChoice.filter((num) => combi7.includes(num))
        const filteredChoice8 = newChoice.filter((num) => combi8.includes(num))

        if (filteredChoice1.length === 3) {
            return filteredChoice1;
        } 
        
        else if (filteredChoice2.length === 3) {
            return filteredChoice2;
        } 

        else if (filteredChoice3.length === 3) {
            return filteredChoice3;
        } 

        else if (filteredChoice4.length === 3) {
            return filteredChoice4;
        } 

        else if (filteredChoice5.length === 3) {
            return filteredChoice5;
        } 

        else if (filteredChoice6.length === 3) {
            return filteredChoice6;
        } 

        else if (filteredChoice7.length === 3) {
            return filteredChoice7;
        } 

        else if (filteredChoice8.length === 3) {
            return filteredChoice8;
        } 

        else {
            return 'perdu';
        }
    },

    /**
     * @function recheckPlayerO(param)
     * @desc : Méthode de vérification des choix du joueur qui possède le O quand il a joué 4 ou 5 fois.
     * @param array : les choix du joueurO
     * @return array : tableau filtré avec la bonne combinaison sinon ça renvoie la string 'perdu".
     */
    recheckPlayerO: (choice) => {

        const newChoice= choice.sort();

        const filteredChoice1 = newChoice.filter((num) => combi1.includes(num))
        const filteredChoice2 = newChoice.filter((num) => combi2.includes(num))
        const filteredChoice3 = newChoice.filter((num) => combi3.includes(num))
        const filteredChoice4 = newChoice.filter((num) => combi4.includes(num))
        const filteredChoice5 = newChoice.filter((num) => combi5.includes(num))
        const filteredChoice6 = newChoice.filter((num) => combi6.includes(num))
        const filteredChoice7 = newChoice.filter((num) => combi7.includes(num))
        const filteredChoice8 = newChoice.filter((num) => combi8.includes(num))

        if (filteredChoice1.length === 3) {
            return filteredChoice1;
        } 
        
        else if (filteredChoice2.length === 3) {
            return filteredChoice2;
        } 

        else if (filteredChoice3.length === 3) {
            return filteredChoice3;
        } 

        else if (filteredChoice4.length === 3) {
            return filteredChoice4;
        } 

        else if (filteredChoice5.length === 3) {
            return filteredChoice5;
        } 

        else if (filteredChoice6.length === 3) {
            return filteredChoice6;
        } 

        else if (filteredChoice7.length === 3) {
            return filteredChoice7;
        } 

        else if (filteredChoice8.length === 3) {
            return filteredChoice8;
        } 

        else {
            return 'perdu'
        }
    },

    /**
     * @function switchChoice(param)
     * @desc : Méthode de vérification des choix des joueurs quand ils ont joué 3 fois.
     * @param string : le choix qui est à l'origine un [] mais qui est converti en string pour comparer
     * avec les combinaisons qui, elles aussi, sont converti en string. Si les 2 strings sont identiques,
     * ça renvoie true et c'est gagné sinon ça renvoie false et le jeu continue.
     * @return bool : tableau filtré avec la bonne combinaison sinon ça renvoie la string 'perdu"
     */
    switchChoice : (choice) => {

        switch (choice) {
            case combi1.toString(): {
              return true 
            }

            case combi2.toString(): {
                return true 
            }

            case combi3.toString(): {
                return true 
            }
            
            case combi4.toString(): {
                return true 
            }

            case combi5.toString(): {
                return true 
            }

            case combi6.toString(): {
                return true 
            }

            case combi7.toString(): {
                return true 
            }

            case combi8.toString(): {
                return true 
            }

            default: return false
        }
    }
}

// app.init est déclenché au chargement du DOM
document.addEventListener('DOMContentLoaded', app.init);

