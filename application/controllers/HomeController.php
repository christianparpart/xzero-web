<?php
class HomeController extends \Phalcon\Mvc\Controller {

    public function indexAction() {
        echo $this->view->render('home');
    }
}