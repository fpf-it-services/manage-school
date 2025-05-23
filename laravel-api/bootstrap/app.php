<?php

use Illuminate\Foundation\Application;
use App\Http\Middleware\EcoleMiddleware;
use App\Http\Middleware\ReplaceJsonRequest;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'replace_json_request' => ReplaceJsonRequest::class,
            'ecole' => EcoleMiddleware::class
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->renderable(function (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'error' => $e->validator->errors()->all()
            ], 422);
        });
        $exceptions->renderable(function (\Symfony\Component\HttpKernel\Exception\NotFoundHttpException $e) {
            return response()->json([
                'success' => false,
                'error' => [
                    "message"  => "Not found"
                ]
            ], 404);
        });
    })->create();
