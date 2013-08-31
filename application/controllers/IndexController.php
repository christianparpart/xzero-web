<?php
class IndexController extends \Phalcon\Mvc\Controller {

	public function indexAction() {
        $this->response->redirect('home', false, 301);
        //$this->view->disable();
        return true;
	}
    
    public function homeAction() {
        // Render homepage
        $request = new Phalcon\Http\Request();
        $this->view->setVars([
            'title' => 'x0 Server',
            'subtitle' => 'Home',
            'isAjax' => ($request->isAjax() ? true : false)
        ]);
        echo $this->view->render('home');
        return true;
    }
    
    public function docsAction() {
        // Render homepage
        $request = new Phalcon\Http\Request();
        $this->view->setVars([
            'title' => 'x0 Server',
            'subtitle' => 'Documentation',
            'isAjax' => ($request->isAjax() ? true : false)
        ]);
        echo $this->view->render('docs');
        return true;
    }
}