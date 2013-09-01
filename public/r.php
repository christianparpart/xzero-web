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
    
    // Register the configuration itself as a service
    $di->set('config', $config);
    
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
            'controller' => 'index',
            'action' => 'home'
        ]);
        
        // Documentation
        $router->add('/docs', [
            'controller' => 'index',
            'action' => 'docs'
        ]);
        
        // Privacy Policy
        $router->add('/help/privacy', [
            'controller' => 'index',
            'action' => 'privacy'
        ]);
        
        // Donations page
        $router->add('/help/donate', [
            'controller' => 'index',
            'action' => 'donate'
        ]);
        
        return $router;
        
    }, true);
    
    // Setting up the view component
    $di->set('view', function() use ($config) {
        $view = new Phalcon\Mvc\View\Simple();
        $view->setViewsDir(__DIR__ . $config->application->viewsDir);
        
        return $view;
    });
    
    // View cache
    $di->set('viewCache', function() use ($config) {
        
        //Cache data for one day by default
        $frontCache = new \Phalcon\Cache\Frontend\Output(array(
            'lifetime' => ($config->application->production ? 2592000 : 1)
        ));
    
        // File settings
        return new \Phalcon\Cache\Backend\File($frontCache, array(
            'cacheDir' => __DIR__ . '/../application/cache/views/',
            'prefix' => 'cache-'
        ));
    });
    
    $di->set('security', function() {
        $security = new Phalcon\Security();
    
        //Set the password hashing factor to 12 rounds
        $security->setWorkFactor(12);
    
        return $security;
    }, true);
    
    //Handle the request
    $application = new \Phalcon\Mvc\Application($di);
    
    // Use simple views
    $application->useImplicitView(false);

    echo $application->handle()->getContent();

} catch(\Phalcon\Exception $e) {
    //echo 'An unknown error occured, please try again later.';
    echo 'PhalconException: ', $e->getMessage();
}