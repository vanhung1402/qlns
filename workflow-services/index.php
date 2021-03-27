<?php
define('PATH_ROOT', __DIR__);
define('URLLLL','https://localhost:5001/');
define('URLLLL_Salary','http://localhost:4900/');
define('HURL','https://timekeeping-services.herokuapp.com/');

// Load class
include_once PATH_ROOT . '/Core/Route.php';
$router = new Core\Route;
include_once PATH_ROOT . '/Core/Routes.php';
include_once PATH_ROOT . '/Core/Function.php';
$request_url = !empty($_GET['url']) ? '/' . $_GET['url'] : '/';

$method_url = !empty($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : 'GET';
require_once "Controllers\BaseController.php";
session_start();
$router->map($request_url, $method_url);