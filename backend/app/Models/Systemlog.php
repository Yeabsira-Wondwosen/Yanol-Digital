<?php
 
namespace App\Models;
 
use Illuminate\Database\Eloquent\Model;
 
class Systemlog extends Model
{
    public $timestamps = false; // we only use created_at, set manually via useCurrent()
 
    protected $fillable = ['channel', 'message', 'context'];
 
    protected $casts = [
        'context'    => 'array',
        'created_at' => 'datetime',
    ];
 
    /**
     * Write a log line and keep the table from growing forever.
     * Call this instead of inserting directly so old rows get trimmed.
     */
    public static function record(string $channel, string $message, array $context = []): self
    {
        $log = static::create([
            'channel' => $channel,
            'message' => $message,
            'context' => $context,
        ]);
 
        // keep only the most recent 500 rows — this is a live console, not an audit trail
        $cutoffId = static::query()->orderByDesc('id')->skip(500)->value('id');
        if ($cutoffId) {
            static::where('id', '<=', $cutoffId)->delete();
        }
 
        return $log;
    }
 
    public function scopeRecent($query, int $limit = 40)
    {
        return $query->orderByDesc('id')->limit($limit);
    }
}
 