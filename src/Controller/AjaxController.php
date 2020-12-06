<?php

namespace App\Controller;

use App\Entity\Player;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/ajax", name="ajax_")
 */
class AjaxController extends AbstractController
{
    /** @var EntityManager */
    protected $em;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->em = $entityManager;
    }

    /**
     * @Route("/new-player", name="new_player", methods={"POST"})
     */
    public function newPlayerAction(Request $request)
    {
        $response = new JsonResponse();

        // Récupération des parametres request
        $username = $request->request->get('username');
        $time = $request->request->get('time');
        $click = $request->request->get('click');

        // Création du joueur
        $player = new Player();
        $player->setUsername($username);
        $player->setTime($time);
        $player->setClick($click);
        $player->setCreatedAt(new \DateTime());
        $this->em->persist($player);
        $this->em->flush();

        // Création de la réponse
        $response->setData([
            'success' => true,
            'redirect' => $this->generateUrl('home_selected', ['playerId' => $player->getId()]),
        ]);

        return $response;
    }
}
