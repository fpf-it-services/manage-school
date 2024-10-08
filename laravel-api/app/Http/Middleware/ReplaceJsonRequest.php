<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ReplaceJsonRequest
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next) : Response
    {
       if ($request->has('data')) {
            $tab = [];
            foreach($request->data['attributes'] as $key => $value) {
                $tab[$key] = $value;
            }
            $request->replace($tab);
        }

        return $next($request);
    }
}
