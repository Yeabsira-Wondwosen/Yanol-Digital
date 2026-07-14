<?php
 
namespace App\Http\Controllers\Api;
 
use App\Http\Controllers\Controller;
use App\Models\Systemlog;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
 
class SystemMonitorController extends Controller
{
    /**
     * GET /api/system/telemetry
     * Real CPU / RAM / cache-hit-rate figures. No randomness.
     */
    public function telemetry()
    {
        return response()->json([
            'cpu_usage_percent'  => $this->cpuUsagePercent(),
            'ram_usage_percent'  => $this->ramUsagePercent(),
            'cache_hit_rate'     => $this->cacheHitRate(),
            'db_connection_ok'   => $this->databaseIsUp(),
            'measured_at'        => now()->toIso8601String(),
        ]);
    }
 
    /**
     * GET /api/system/services
     * Pings the actual services instead of hardcoding "Online".
     */
    public function services()
    {
        $services = [
            [
                'name'   => 'MySQL Database',
                'status' => $this->databaseIsUp() ? 'Online' : 'Offline',
                'delay'  => $this->timeMs(fn () => DB::select('SELECT 1')),
            ],
            [
                'name'   => 'Redis Cache Server',
                'status' => $this->redisIsUp() ? 'Online' : 'Offline',
                'delay'  => $this->timeMs(fn () => $this->redisIsUp() ? Redis::connection()->ping() : null),
            ],
            [
                'name'   => 'Queue Worker',
                'status' => $this->queueWorkerAlive() ? 'Online' : 'Idle / Not Detected',
                'delay'  => null,
            ],
            [
                'name'   => 'Mail (SMTP config)',
                'status' => config('mail.default') ? 'Configured' : 'Not Configured',
                'delay'  => null,
            ],
        ];
 
        return response()->json(['services' => $services]);
    }
 
    /**
     * GET /api/system/logs?after_id=123
     * Returns real log rows written by LogApiActivity + anything you record manually.
     */
    public function logs()
    {
        $afterId = request()->integer('after_id', 0);
 
        if ($afterId > 0) {
            // polling for new lines since the client's last-seen id
            $logs = SystemLog::query()
                ->where('id', '>', $afterId)
                ->orderBy('id')
                ->limit(100)
                ->get(['id', 'channel', 'message', 'created_at']);
        } else {
            // first load: most recent slice, returned oldest-first for display
            $logs = SystemLog::recent(40)
                ->get(['id', 'channel', 'message', 'created_at'])
                ->sortBy('id')
                ->values();
        }
 
        return response()->json(['logs' => $logs]);
    }
 
    /**
     * POST /api/system/cache/flush
     * Actually flushes the cache — this is a real, destructive action, so it
     * should sit behind auth + a permission check in production.
     */
    public function flushCache()
    {
        Cache::flush();
 
        SystemLog::record('SYSTEM', 'Cache flush executed via admin dashboard.', [
            'user_id' => request()->user()?->id,
        ]);
 
        return response()->json(['flushed' => true]);
    }
 
    // ---- helpers -----------------------------------------------------
 
    private function cpuUsagePercent(): ?float
    {
        // sys_getloadavg() is Unix-only and returns [1min, 5min, 15min] load averages.
        if (!function_exists('sys_getloadavg')) {
            return null;
        }
 
        $load = sys_getloadavg();
        if ($load === false) {
            return null;
        }
 
        $cores = (int) (shell_exec('nproc') ?: 1);
        $cores = max(1, $cores);
 
        $percent = ($load[0] / $cores) * 100;
 
        return round(min(100, $percent), 1);
    }
 
    private function ramUsagePercent(): ?float
    {
        // Linux-specific: parse /proc/meminfo. Returns null on non-Linux hosts
        // (e.g. during local dev on macOS) rather than faking a number.
        $path = '/proc/meminfo';
        if (!is_readable($path)) {
            return null;
        }
 
        $lines = file($path);
        $meminfo = [];
        foreach ($lines as $line) {
            if (preg_match('/^(\w+):\s+(\d+)/', $line, $m)) {
                $meminfo[$m[1]] = (int) $m[2];
            }
        }
 
        if (!isset($meminfo['MemTotal'], $meminfo['MemAvailable'])) {
            return null;
        }
 
        $used = $meminfo['MemTotal'] - $meminfo['MemAvailable'];
 
        return round(($used / $meminfo['MemTotal']) * 100, 1);
    }
 
    private function cacheHitRate(): ?float
    {
        // Only meaningful when the cache store is actually Redis.
        if (config('cache.default') !== 'redis' || !$this->redisIsUp()) {
            return null;
        }
 
        $info = Redis::connection()->info('stats');
        $hits = (int) ($info['keyspace_hits'] ?? 0);
        $misses = (int) ($info['keyspace_misses'] ?? 0);
        $total = $hits + $misses;
 
        if ($total === 0) {
            return null;
        }
 
        return round(($hits / $total) * 100, 1);
    }
 
    private function databaseIsUp(): bool
    {
        try {
            DB::connection()->getPdo();
            return true;
        } catch (\Throwable $e) {
            return false;
        }
    }
 
    private function redisIsUp(): bool
    {
        try {
            return Redis::connection()->ping() !== false;
        } catch (\Throwable $e) {
            return false;
        }
    }
 
    private function queueWorkerAlive(): bool
    {
        // Convention: a running queue worker (or a scheduled heartbeat job)
        // touches this cache key. Wire this up in your worker/scheduler.
        $heartbeat = Cache::get('queue:heartbeat');
        return $heartbeat && now()->diffInSeconds($heartbeat) < 90;
    }
 
    private function timeMs(callable $fn): ?int
    {
        try {
            $start = microtime(true);
            $fn();
            return (int) round((microtime(true) - $start) * 1000);
        } catch (\Throwable $e) {
            return null;
        }
    }
}
 