<?php

$url = $_GET['image'];
$image = file_get_contents($url);
header('Content-Type: image/jpeg');
echo $image;
