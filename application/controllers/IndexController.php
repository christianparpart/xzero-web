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
        
        $isCached = $this->viewCache->start('home');
        
        if($isCached === null) {
            
            // Call libs
            $this->callLibs();
            
            echo $this->view->render('home');
            
            $this->viewCache->save();
        
            return true;
        }
            
        echo $isCached;
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
        
        $isCached = $this->viewCache->start('docs');

        if($isCached === null) {
            
            // Call libs
            $this->callLibs();
            
            echo $this->view->render('docs');
            
            $this->viewCache->save();
        
            return true;
        }
            
        echo $isCached;
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
        
        $isCached = $this->viewCache->start('help-privacy');

        if($isCached === null) {
            
            // Call libs
            $this->callLibs();
            
            echo $this->view->render('help/privacy');
            
            $this->viewCache->save();
        
            return true;
        }
            
        echo $isCached;
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
        
        // Call libs
        $this->callLibs();
        
        $isCached = $this->viewCache->start('help-donate');

        if($isCached === null) {

            // Call libs
            $this->callLibs();
            
            echo $this->view->render('help/donate');
            
            $this->viewCache->save();
            
            return true;
        }
            
        echo $isCached;
        return true;
    }
    
    private function callLibs() {
        
        //Add some local JS resources
        $this->assets->collection('jsLibs')
            //The name of the final output
            ->setTargetPath(hash('sha256', 'jsLibs') . '.js')
            //The script tag is generated with this URI
            ->setTargetUri(hash('sha256', 'jsLibs') . '.js')
            //These are local resources that must be filtered
            ->addJs('js/jquery-1.10.2.min.js')
            ->addJs('js/xzero.dependencies.min.js')
            ->addJs('js/xzero.main.js')
            ->addJs('js/xzero.pages.js')
            //Join all the resources in a single file
            ->join(true)
            //Use the built-in Jsmin filter
            ->addFilter(new Phalcon\Assets\Filters\Jsmin());

        //Add some local JS resources
        $this->assets->collection('jsPreLibs')
            //The name of the final output
            ->setTargetPath(hash('sha256', 'jsPreLibs') . '.js')
            //The script tag is generated with this URI
            ->setTargetUri(hash('sha256', 'jsPreLibs') . '.js')
            //These are local resources that must be filtered
            ->addJs('js/xzero.modernizr.min.js')
            //Join all the resources in a single file
            ->join(true)
            //Use the built-in Jsmin filter
            ->addFilter(new Phalcon\Assets\Filters\Jsmin());
        
        //Add some local CSS resources
        $this->assets->collection('cssLibs')
            //The name of the final output
            ->setTargetPath(hash('sha256', 'cssLibs') . '.css')
            //The script tag is generated with this URI
            ->setTargetUri(hash('sha256', 'cssLibs') . '.css')
            //These are local resources that must be filtered
            ->addCss('css/normalize.css')
            ->addCss('https://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700|Ubuntu:400,500,700', false)
            ->addCss('css/animate.min.css')
            ->addCss('css/main.css')
            //Join all the resources in a single file
            ->join(true)
            //Use the built-in Jsmin filter
            ->addFilter(new Phalcon\Assets\Filters\Cssmin());
        
        return true;
    }
}