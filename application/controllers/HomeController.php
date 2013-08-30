<?php
class HomeController extends \Phalcon\Mvc\Controller {

    public function indexAction() {
        // Render homepage
        echo $this->view->render('home');
    }
}