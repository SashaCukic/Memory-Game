/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you import will output into a single css file (app.css in this case)
import './styles/app.scss';

// loads the packages from node_modules
const $ = require('jquery');
require('bootstrap');

$(document).ready(function() {

    let totalCards = 4; // Nombre de cartes totales
    let username = ''; // Nom du joueur
    let nbClicks = 0; // Nombre de clique du joueur
    let totalTime; // Temps total
    let hasFlippedCard = false; // Détecter si une carte a été retournée
    let lockBoard = true; // Déverrouiller le plateau de jeu
    let firstCard, secondCard; // Les cartes retournées

    function flipCard(card) {
        if (lockBoard) return; //-- Plateau verrouillé
        if (card === firstCard) return; //-- Ne pas pouvoir flipper 2x la même carte

        card.addClass("flip"); // Ajouter le class "flip" pour retourner visuellement la carte

        //-- Si aucune carte n'a déjà été retourné
        if (!hasFlippedCard) {
            hasFlippedCard = true; // Une carte a été retourné
            firstCard = card; // Instanciation de la première carte
            return; // Fin
        }

        secondCard = card; // Instanciation de la deuxième carte

        checkForMatch(); // Vérifier les cartes
    }

    function checkForMatch() {
        //-- Si les deux cartes sont identiques
        if (firstCard.data('value') === secondCard.data('value')) {
            disableCards(); // Désactiver les deux cartes
            return;
        }

        //-- Sinon, retrouner les cartes
        unflipCards();
    }

    function disableCards() {
        firstCard.removeClass("flip") // Retiré la class "flip"
        secondCard.removeClass("flip") // Retiré la class "flip"
        firstCard.addClass("win"); // Ajouter la class "win"
        secondCard.addClass("win"); // Ajouter la class "win"
        resetBoard(); // Réinitialiser le plateau
    }

    function unflipCards() {
        lockBoard = true; // Plateau dévérrouillé

        //-- Attendre 1 seconde
        setTimeout(() => {
            firstCard.removeClass("flip") // Retourner la carte
            secondCard.removeClass("flip") // Retourner la carte
            resetBoard(); // Réinitialiser le plateau
        }, 1000);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    function checkWin() {
        // Vérifier le nombre de cartes qui ont été gagné
        if ($('.win').length == totalCards) {
            return true;
        }

        return false;
    }

    //-- Création du joueur
    function createPlayer(username, time, click) {

        //-- Récupérer les informations du joueur
        var data = {
            username: username,
            time: time,
            click: click,
        };

        //-- Requête ajax
        $.ajax({
            type: 'POST',
            url: '/ajax/new-player',
            data: data,
            success: function(response) {
                if (response.success) {
                    $(location).attr("href", response.redirect); // Redirection vers la page du classement
                }
            },
            error: function() {},
        });
    }

    /* Timer function */
    function startTimer(duration, counter, progressBar) {
        //-- Attribution de la variable duration dans la variable timer
        var timer = duration;

        var interval = setInterval(function() {
            var minutes = parseInt(timer / 60, 10); // Récupération des minutes de la variable timer
            var seconds = parseInt(timer % 60, 10); // Récupération des seconds de la variable timer
            var remainingSeconds = minutes * 60 + seconds; // Calcul des secondes restantes
            progressBar.css("width", (remainingSeconds * 100 / duration) + "%"); // Modifier la barre de progression

            // Formater les minutes et les secondes
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            // Afficher le compteur avec minutes et secondes formatées
            counter.text(minutes + ":" + seconds);

            // Decrémentation du timer
            --timer;

            if (timer < 0) {
                //-- Le temps est fini
                clearInterval(interval); // Stop setInterval function
                lockBoard = true; // Plateau verrouillé
            } else if (checkWin()) {
                //-- Vérifier si le joueur à gagné
                clearInterval(interval); // Stop setInterval function
                totalTime = timer; // Attribution de timer dans totalTime
                $('#usernameModal').modal('show'); // Affichage de la modal pour inscrire le joueur
            }
        }, 1000); // milliseconds 
    }

    //-- Mélanger les éléments enfants
    $.fn.shuffleChildren = function() {
        $.each(this.get(), function(index, el) {
            var $el = $(el);
            var $find = $el.children();

            $find.sort(function() {
                return 0.5 - Math.random();
            });

            $el.empty();
            $find.appendTo($el);
        });
    };

    // event onClick sur la carte
    $(document).on('click', '.flip-card', function() {
        // Vérification si la carte est active
        if (!$(this).hasClass('flip') && !$(this).hasClass('win')) {
            nbClicks++; // Count nb clicks
            flipCard($(this)); // Run function flipCard
        }
    });

    // event onClick sur le boutton start-game
    $(document).on('click', '#start-game', function() {
        if (!$(this).hasClass('disabled')) {
            $(this).addClass("disabled"); // Désactiver le bouton
            lockBoard = false; // Plateau verrouillé
            // Get Timer & ProgressBar éléments
            var counter = $("#timer");
            var progressBar = $("#progressBar");
            startTimer(60, counter, progressBar); // Start Timer function
        }
    });

    // event onClick sur le boutton submit-username
    $(document).on('click', '#submit-username', function() {
        //-- Vérification sur le nom du joueur
        if ($('#player-name').val() != '') {
            username = $('#player-name').val(); // Récupération du nom du joueur
            createPlayer(username, totalTime, nbClicks); // Création du joueur
        } else {
            $('#player-name-error').text('Vous ne pouvez pas vous appelez ainsi !'); // Affichage du message d'erreur
            $('#usernameModal').modal('show'); // Affichage de la modal pour inscrire le joueur
        }
    });

    //-- Mélanger les cartes
    $(".memory-game").shuffleChildren();
});