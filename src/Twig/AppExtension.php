<?php

namespace App\Twig;

use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;

class AppExtension extends AbstractExtension
{
    public function getFilters()
    {
        return [
            new TwigFilter('shuffle', [$this, 'shuffleArray']),
        ];
    }

    /* Extention twig pour mélanger les cartes */
    public function shuffleArray($array)
    {
        shuffle($array);

        return $array;
    }
}
