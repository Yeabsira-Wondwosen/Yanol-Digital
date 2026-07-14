
<?php
 
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
 
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('system_logs', function (Blueprint $table) {
            $table->id();
            // matches the colored prefixes the UI keys off: SYSTEM / API / SECURITY / DATABASE / CACHE / WS
            $table->string('channel', 32)->index();
            $table->string('message', 1000);
            $table->json('context')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }
 
    public function down(): void
    {
        Schema::dropIfExists('system_logs');
    
}
};
 