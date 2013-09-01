<?php
class IndexController extends \Phalcon\Mvc\Controller {

	public function indexAction() {
        $this->response->redirect('home', false, 301);
        //$this->view->disable();
        return true;
	}
    
    public function homeAction() {
        $request = new Phalcon\Http\Request();
        $this->view->setVars([
            'currentPage' => 'home',
            'title' => 'x0 Server',
            'subtitle' => 'Home',
            'isAjax' => ($request->isAjax() ? true : false)
        ]);
        echo $this->view->render('home');
        return true;
    }
    
    public function docsAction() {
        $request = new Phalcon\Http\Request();
        $this->view->setVars([
            'currentPage' => 'docs',
            'title' => 'x0 Server',
            'subtitle' => 'Documentation',
            'isAjax' => ($request->isAjax() ? true : false)
        ]);
        echo $this->view->render('docs');
        return true;
    }
    
    public function privacyAction() {
        $request = new Phalcon\Http\Request();
        $this->view->setVars([
            'currentPage' => 'help/privacy',
            'title' => 'x0 Server',
            'subtitle' => 'Privacy Policy',
            'isAjax' => ($request->isAjax() ? true : false)
        ]);
        echo $this->view->render('help/privacy');
        return true;
    }
    
    public function donateAction() {
        $request = new Phalcon\Http\Request();
        $this->view->setVars([
            'currentPage' => 'help/donate',
            'title' => 'x0 Server',
            'subtitle' => 'Donate !',
            'isAjax' => ($request->isAjax() ? true : false)
        ]);
        echo $this->view->render('help/donate');
        return true;
    }
}