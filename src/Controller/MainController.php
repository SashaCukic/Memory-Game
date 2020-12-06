<?php

namespace App\Controller;

use App\Entity\Player;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class MainController extends AbstractController
{
    /** @var EntityManagerInterface */
    protected $em;

    public function __construct(EntityManagerInterface $entityManager)
    {
        //-- Instanciation de l'entityManager pour gérer les Entity
        $this->em = $entityManager;
    }

    /**
     * @Route("/", name="home")
     * @Route("/{playerId}", name="home_selected", requirements={"playerId"="\d+"})
     */
    public function index($playerId = null): Response
    {
        //-- Récupération des 20 meilleurs joueurs avec une query custom (cf PlayerRepository)
        $players = $this->em->getRepository(Player::class)->findClassement();

        //-- Si le joueur vient de jouer
        if ($playerId) {
            $player = $this->em->getRepository(Player::class)->findOneById($playerId);

            //-- Si le joueur n'est pas dans le top 20
            if (!$players->contains($player)) {
                // Création d'un flash message d'erreur
                $this->addFlash('primary', 'Désolé '.$player->getUsername().' vous n\'apparaissez pas dans le classement');
            }
        }

        //-- Return twig template
        return $this->render('game/index.html.twig', [
            'playerId' => $playerId,
            'players' => $players,
        ]);
    }

    /**
     * @Route("/memory", name="memory")
     */
    public function memory(): Response
    {
        //-- Création d'un array pour générer les cartes dynamiquement
        $cards = [
            'html',
            'css',
            'javascript',
            'php',
            'symfony',
            'jquery',
            'bootstrap',
            'mysql',
            'twig',
        ];

        //-- Return twig template
        return $this->render('game/memory.html.twig', [
            'cards' => $cards,
        ]);
    }
}
