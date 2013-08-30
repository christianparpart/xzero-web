<?php
/*
 * Copyright (C) 2010-2013 x0 Server <http://xzero.io/>
 *
 * This program is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the
 * Free Software Foundation; either version 2 of the License, or (at your
 * option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
 * more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

use Phalcon\Events\Manager as EventsManager,
    Phalcon\Dispatcher as Dispatcher;

try {

	/**
	 * Read the configuration
	 */
	$config = new Phalcon\Config\Adapter\Ini(__DIR__ . '/../application/configs/application.ini');
    
    //Register an autoloader
    $loader = new \Phalcon\Loader();
    
    $loader->registerDirs([
        __DIR__ . $config->application->controllersDir,
        __DIR__ . $config->application->pluginsDir,
        __DIR__ . $config->application->libraryDir,
        __DIR__ . $config->application->modelsDir,
    ])->register();
    
    //Create a DI
    $di = new Phalcon\DI\FactoryDefault();
    
    //Specify routes for modules
    $di->set('router', function() {
        
        $router = new \Phalcon\Mvc\Router(false);
        
        $router->setUriSource(\Phalcon\Mvc\Router::URI_SOURCE_SERVER_REQUEST_URI);
        $router->removeExtraSlashes(true);
        
        // Error 404 handler
        $router->notFound([
            'controller' => 'errors',
            'action' => 'e404'
        ]);
        
        // Redirection to /home
        $router->add('/', [
            'controller' => 'index',
            'action' => 'index'
        ]);
        
        // Homepage
        $router->add('/home', [
            'controller' => 'home',
            'action' => 'index'
        ]);
        
        return $router;
        
    }, true);
    
    //Setting up the view component
    $di->set('view', function() use ($config) {
        $view = new Phalcon\Mvc\View\Simple();
        $view->setViewsDir(__DIR__ . $config->application->viewsDir);
        
        return $view;
    });
    
    //Handle the request
    $application = new \Phalcon\Mvc\Application($di);
    
    // Use simple views
    $application->useImplicitView(false);

    echo $application->handle()->getContent();

} catch(\Phalcon\Exception $e) {
     echo 'PhalconException: ', $e->getMessage();
}