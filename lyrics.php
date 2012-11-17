<?php
define('KEY', 'b1fd30e730ccd98a5d95e4a5c8a13d19');
$baseUrl = 'http://api.musixmatch.com/ws/1.1';
$url = "{$baseUrl}/matcher.subtitle.get?" . http_build_query(array(
    'apikey' => KEY,
    'q_track' => $_GET['q_track'],
    'q_artist' => $_GET['q_artist'],
));
header('Content-Type: application/json');
die(file_get_contents($url));
