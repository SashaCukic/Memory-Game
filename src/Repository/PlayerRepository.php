<?php

namespace App\Repository;

use App\Entity\Player;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Collections;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Player|null find($id, $lockMode = null, $lockVersion = null)
 * @method Player|null findOneBy(array $criteria, array $orderBy = null)
 * @method Player[]    findAll()
 * @method Player[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PlayerRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Player::class);
    }

    /* Récupération du classement en BD */
    public function findClassement()
    {
        $result = $this->createQueryBuilder('p')
            ->addOrderBy('p.time', 'DESC') // Les joueurs avec le plus de temps
            ->addOrderBy('p.click', 'ASC') // Les joueurs avec le moin de clic
            ->addOrderBy('p.createdAt', 'ASC') // Les joueurs avec une date création la plus ancienne
            ->setMaxResults(20) // Seulement 20 joueurs maximum
            ->getQuery()
            ->getResult()
        ;

        return new Collections\ArrayCollection($result);
    }

    // /**
    //  * @return Player[] Returns an array of Player objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('p.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Player
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
