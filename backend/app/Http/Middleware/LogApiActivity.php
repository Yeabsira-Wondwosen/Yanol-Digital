<?php
 
namespace App\Http\Middleware;
 
use App\Models\SystemLog;
use Closure;
use Illuminate\Http\Request;
 
class LogApiActivity
{
    public function handle(Request $request, Closure $next)
    {
        $start = microtime(true);
 
        $response = $next($request);
 
        $durationMs = (int) round((microtime(true) - $start) * 1000);
        $status = $response->getStatusCode();
 
        SystemLog::record(
            channel: 'API',
            message: sprintf(
                'Ingress %s %s → Response: %d %s in %dms',
                $request->method(),
                $request->path(),
                $status,
                $this->statusText($status),
                $durationMs
            ),
            context: [
                'method'      => $request->method(),
                'path'        => $request->path(),
                'status'      => $status,
                'duration_ms' => $durationMs,
                'user_id'     => $request->user()?->id,
            ]
        );
 
        return $response;
    }
 
    private function statusText(int $status): string
    {
        return match (true) {
            $status === 200 => 'OK',
            $status === 201 => 'Created',
            $status === 204 => 'No Content',
            $status === 304 => 'Not Modified',
            $status === 401 => 'Unauthorized',
            $status === 403 => 'Forbidden',
            $status === 404 => 'Not Found',
            $status >= 500  => 'Server Error',
            $status >= 400  => 'Client Error',
            default         => '',
        };
    }
}