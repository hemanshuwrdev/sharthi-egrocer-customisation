<?php

namespace Database\Seeders;

use App\Models\Language;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class LanguageSeeder extends Seeder
{
   
    public function run()
    {
        $supportedLanguageId = 16;
        
        $displayName = 'English';
        
        $systemTypeFiles = [
            1 => 'customer.json',  // Customer App
            2 => 'partner.json',   // Seller and delivery boy App
            3 => 'web.json',       // Website
            4 => 'panel.json'      // Admin panel
        ];
        
        Language::where('is_default', 1)->update(['is_default' => 0]);
        
        foreach ($systemTypeFiles as $systemType => $fileName) {
            $filePath = public_path('sample-file/' . $fileName);
            
            if (!File::exists($filePath)) {
                $this->command->warn("Sample file not found: {$fileName}. Skipping system type {$systemType}.");
                continue;
            }
            
            $jsonContent = File::get($filePath);
            
            $jsonData = json_decode($jsonContent, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                $this->command->error("Invalid JSON in file: {$fileName}. Error: " . json_last_error_msg());
                continue;
            }
            
            $jsonString = json_encode($jsonData);
            
            $existingLanguage = Language::where('supported_language_id', $supportedLanguageId)
                ->where('system_type', $systemType)
                ->first();
            
            if ($existingLanguage) {
                $existingLanguage->update([
                    'json_data' => $jsonString,
                    'display_name' => $displayName,
                    'is_default' => 1,
                    'status' => 1
                ]);
                
                $this->command->info("Updated English language for system type {$systemType} ({$fileName})");
            } else {
                Language::create([
                    'supported_language_id' => $supportedLanguageId,
                    'system_type' => $systemType,
                    'json_data' => $jsonString,
                    'display_name' => $displayName,
                    'is_default' => 1,
                    'status' => 1
                ]);
                
                $this->command->info("Created English language for system type {$systemType} ({$fileName})");
            }
        }
        
        Language::where('supported_language_id', '!=', $supportedLanguageId)
            ->where('is_default', 1)
            ->update(['is_default' => 0]);
        
        $this->command->info("English language seeder completed successfully!");
    }
}

