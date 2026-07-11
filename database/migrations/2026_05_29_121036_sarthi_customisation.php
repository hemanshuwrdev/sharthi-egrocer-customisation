<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class SarthiCustomisation extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // 0. Distributor UPI details (replaces bank details on the form)
        Schema::table('sellers', function (Blueprint $table) {
            if (!Schema::hasColumn('sellers', 'upi_id')) {
                $table->string('upi_id')->nullable()->after('account_name');
            }
            if (!Schema::hasColumn('sellers', 'upi_mobile')) {
                $table->string('upi_mobile', 15)->nullable()->after('upi_id');
            }
            if (!Schema::hasColumn('sellers', 'upi_name')) {
                $table->string('upi_name')->nullable()->after('upi_mobile');
            }
        });

        // 1. Master Product System (Product Variants)
        Schema::table('product_variants', function (Blueprint $table) {
            if (!Schema::hasColumn('product_variants', 'sku')) {
                $table->string('sku')->nullable()->after('type');
            }
            if (!Schema::hasColumn('product_variants', 'secondary_unit_id')) {
                $table->integer('secondary_unit_id')->nullable()->after('stock_unit_id')->comment('e.g., Box, Case, Bag');
            }
            if (!Schema::hasColumn('product_variants', 'secondary_unit_value')) {
                $table->float('secondary_unit_value', 8, 2)->nullable()->after('secondary_unit_id')->comment('How many primary units in secondary unit');
            }
        });

        if (!Schema::hasTable('vehicles_and_dispatches_tables')) {
            Schema::create('vehicles_and_dispatches_tables', function (Blueprint $table) {
                $table->id();
                $table->timestamps();
            });
        }

        // Vehicles Table
        if (!Schema::hasTable('vehicles')) {
            Schema::create('vehicles', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('vehicle_number')->unique();
                $table->double('capacity', 8, 2);
                $table->tinyInteger('status')->default(1);
                $table->timestamps();
            });
        }

        // Loading Slips Table
        if (!Schema::hasTable('loading_slips')) {
            Schema::create('loading_slips', function (Blueprint $table) {
                $table->id();
                $table->string('slip_no')->unique();
                $table->foreignId('vehicle_id')->constrained('vehicles')->onDelete('cascade');
                $table->foreignId('driver_id')->constrained('delivery_boys')->onDelete('cascade');
                $table->tinyInteger('status')->default(0);
                $table->double('total_weight', 8, 2)->default(0.00);
                $table->integer('total_items')->default(0);
                $table->integer('total_orders')->default(0);
                $table->foreignId('created_by')->constrained('admins')->onDelete('cascade');
                $table->decimal('cash_received', 15, 2)->nullable();
                $table->enum('reconciliation_status', ['unreconciled', 'partial_match', 'full_match', 'overpaid'])->default('unreconciled');
                $table->timestamp('reconciled_at')->nullable();
                $table->unsignedBigInteger('reconciled_by')->nullable();
                $table->timestamps();
            });
        } else {
            Schema::table('loading_slips', function (Blueprint $table) {
                if (!Schema::hasColumn('loading_slips', 'cash_received')) {
                    $table->decimal('cash_received', 15, 2)->nullable()->after('created_by');
                }
                if (!Schema::hasColumn('loading_slips', 'reconciliation_status')) {
                    $table->enum('reconciliation_status', ['unreconciled', 'partial_match', 'full_match', 'overpaid'])
                          ->default('unreconciled')->after('cash_received');
                }
                if (!Schema::hasColumn('loading_slips', 'reconciled_at')) {
                    $table->timestamp('reconciled_at')->nullable()->after('reconciliation_status');
                }
                if (!Schema::hasColumn('loading_slips', 'reconciled_by')) {
                    $table->unsignedBigInteger('reconciled_by')->nullable()->after('reconciled_at');
                }
            });
        }

        // Add weight and loading_slip_id to orders table
        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'weight')) {
                $table->double('weight', 8, 2)->nullable()->after('final_total');
            }
            if (!Schema::hasColumn('orders', 'loading_slip_id')) {
                $table->foreignId('loading_slip_id')->nullable()->constrained('loading_slips')->onDelete('set null')->after('weight');
            }
        });      

        // 2. Slab (Bulk) Pricing per variant
        // Schema::create('product_slab_prices', function (Blueprint $table) {
        //     $table->bigIncrements('id');
        //     $table->unsignedBigInteger('product_variant_id');
        //     $table->unsignedInteger('min_qty');
        //     $table->unsignedInteger('max_qty')->nullable()->comment('NULL = open-ended (e.g. "50+")');
        //     $table->decimal('price', 15, 4);
        //     $table->timestamps();

        //     $table->foreign('product_variant_id')
        //         ->references('id')->on('product_variants')
        //         ->onDelete('cascade');

        //     $table->index(['product_variant_id', 'min_qty'], 'idx_psp_variant_minqty');
        // });

        // 3-pre. Sarthi: favorites — add master_product_variant_id so retailer can favourite master-catalog SKUs
        if (Schema::hasTable('favorites')) {
            Schema::table('favorites', function (Blueprint $table) {
                if (!Schema::hasColumn('favorites', 'master_product_variant_id')) {
                    $table->unsignedBigInteger('master_product_variant_id')->nullable()->after('product_id');
                    $table->index('master_product_variant_id', 'idx_fav_master_variant');
                }
                if (!Schema::hasColumn('favorites', 'seller_id')) {
                    $table->unsignedBigInteger('seller_id')->nullable()->after('master_product_variant_id');
                    $table->index('seller_id', 'idx_fav_seller');
                }
            });
        }

        // 3. Slab snapshot + master catalog references on order_items (frozen at order time)
        Schema::table('order_items', function (Blueprint $table) {
            if (!Schema::hasColumn('order_items', 'slab_unit_price')) {
                $table->decimal('slab_unit_price', 15, 4)->nullable()->after('discounted_price');
            }
            if (!Schema::hasColumn('order_items', 'slab_min_qty')) {
                $table->unsignedInteger('slab_min_qty')->nullable()->after('slab_unit_price');
            }
            if (!Schema::hasColumn('order_items', 'slab_max_qty')) {
                $table->unsignedInteger('slab_max_qty')->nullable()->after('slab_min_qty');
            }
            if (!Schema::hasColumn('order_items', 'master_product_variant_id')) {
                $table->unsignedBigInteger('master_product_variant_id')->nullable()->after('product_variant_id');
                $table->index('master_product_variant_id', 'idx_oi_master_variant');
            }
            if (!Schema::hasColumn('order_items', 'seller_product_id')) {
                $table->unsignedBigInteger('seller_product_id')->nullable()->after('master_product_variant_id');
                $table->index('seller_product_id', 'idx_oi_seller_product');
            }
        });

        // 3c. Master catalog references on carts (retailer can have master + legacy items)
        if (Schema::hasTable('carts')) {
            Schema::table('carts', function (Blueprint $table) {
                if (!Schema::hasColumn('carts', 'master_product_variant_id')) {
                    $table->unsignedBigInteger('master_product_variant_id')->nullable()->after('product_variant_id');
                    $table->index('master_product_variant_id', 'idx_carts_master_variant');
                }
                if (!Schema::hasColumn('carts', 'seller_id')) {
                    $table->unsignedBigInteger('seller_id')->nullable()->after('master_product_variant_id');
                    $table->index('seller_id', 'idx_carts_seller');
                }
                if (!Schema::hasColumn('carts', 'seller_product_id')) {
                    $table->unsignedBigInteger('seller_product_id')->nullable()->after('seller_id');
                }
            });
        }

        // 3b. Same snapshot fields on pos_order_items so POS sales can reference master catalog too.
        Schema::table('pos_order_items', function (Blueprint $table) {
            if (!Schema::hasColumn('pos_order_items', 'master_product_variant_id')) {
                $table->unsignedBigInteger('master_product_variant_id')->nullable()->after('product_variant_id');
                $table->index('master_product_variant_id', 'idx_poi_master_variant');
            }
            if (!Schema::hasColumn('pos_order_items', 'seller_product_id')) {
                $table->unsignedBigInteger('seller_product_id')->nullable()->after('master_product_variant_id');
                $table->index('seller_product_id', 'idx_poi_seller_product');
            }
            if (!Schema::hasColumn('pos_order_items', 'slab_unit_price')) {
                $table->decimal('slab_unit_price', 15, 4)->nullable()->after('total_price');
            }
            if (!Schema::hasColumn('pos_order_items', 'slab_min_qty')) {
                $table->unsignedInteger('slab_min_qty')->nullable()->after('slab_unit_price');
            }
            if (!Schema::hasColumn('pos_order_items', 'slab_max_qty')) {
                $table->unsignedInteger('slab_max_qty')->nullable()->after('slab_min_qty');
            }
        });

        // 4. Brand overlap flag (multiple distributors for same brand)
        Schema::table('brands', function (Blueprint $table) {
            if (!Schema::hasColumn('brands', 'is_overlap_allowed')) {
                $table->tinyInteger('is_overlap_allowed')->default(0)->after('status')
                    ->comment('1 = multiple distributors can deliver this brand in same area');
            }
        });

        // 5. Per-distributor order cutoff time
        // NOTE: managed_territories was dropped — sellers.city_id is already a CSV of city IDs.
        Schema::table('sellers', function (Blueprint $table) {
            if (!Schema::hasColumn('sellers', 'order_cutoff_time')) {
                $table->string('order_cutoff_time', 5)->nullable()->after('city_id')
                    ->comment('HH:MM 24h. Per-distributor order cutoff. At/before this time -> next-day delivery; after -> day-after.');
            }
        });

        // 6. Brand → Distributor → City mapping (territory control)
        if (!Schema::hasTable('brand_distributor_mappings')) {
            Schema::create('brand_distributor_mappings', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('brand_id');
                $table->unsignedBigInteger('seller_id');
                $table->unsignedBigInteger('city_id');
                $table->timestamps();

                $table->unique(['brand_id', 'seller_id', 'city_id'], 'uniq_bdm_brand_seller_city');
                $table->index('brand_id', 'idx_bdm_brand');
                $table->index('seller_id', 'idx_bdm_seller');
                $table->index('city_id', 'idx_bdm_city');
            });
        }

        // 7. Order cutoff / delivery date (3 PM rule)

        // Schema::table('orders', function (Blueprint $table) {
        //     $table->date('delivery_date')->nullable()->after('delivery_time')
        //         ->comment('Auto-tagged delivery date per cutoff rule');
        // });
        
        
        
        Schema::table('orders', function (Blueprint $table) {
    if (!Schema::hasColumn('orders', 'delivery_date')) {
        $table->date('delivery_date')
            ->nullable()
            ->after('delivery_time')
            ->comment('Auto-tagged delivery date per cutoff rule');
    }
});

        // 9. Master Catalog: Parent Companies (e.g., Nestlé, ITC, HUL)
        if (!Schema::hasTable('parent_companies')) {
            Schema::create('parent_companies', function (Blueprint $table) {
                $table->id();
                $table->string('name')->unique();
                $table->tinyInteger('status')->default(1);
                $table->timestamps();
            });
        }

        // 10. Master Catalog: Products (super admin owned catalog)
        if (!Schema::hasTable('master_products')) {
            Schema::create('master_products', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('slug')->nullable();
                $table->unsignedBigInteger('parent_company_id')->nullable();
                $table->unsignedBigInteger('brand_id')->nullable();
                $table->unsignedBigInteger('category_id')->nullable();
                $table->unsignedBigInteger('tax_id')->nullable();
                $table->string('hsn')->nullable();
                $table->string('image')->nullable();
                $table->text('other_images')->nullable()->comment('JSON array of additional image paths');
                $table->text('short_description')->nullable();
                $table->longText('description')->nullable();
                $table->string('type')->default('single')->comment('single | variable');
                $table->tinyInteger('status')->default(1);
                $table->unsignedBigInteger('created_by')->nullable();
                $table->timestamps();

                $table->index('parent_company_id', 'idx_mp_parent');
                $table->index('brand_id', 'idx_mp_brand');
                $table->index('category_id', 'idx_mp_category');
            });
        }

        // 11. Master Catalog: Variants (SKU + unit + secondary unit + weight)
        if (!Schema::hasTable('master_product_variants')) {
            Schema::create('master_product_variants', function (Blueprint $table) {
                $table->id();
                $table->foreignId('master_product_id')->constrained('master_products')->onDelete('cascade');
                $table->string('sku')->nullable();
                $table->unsignedBigInteger('unit_id')->nullable();
                $table->unsignedBigInteger('secondary_unit_id')->nullable()->comment('e.g., Box, Case, Bag');
                $table->float('secondary_unit_value', 8, 2)->nullable()->comment('How many primary units in secondary unit');
                $table->double('weight', 10, 3)->nullable();
                $table->string('image')->nullable();
                $table->tinyInteger('status')->default(1);
                $table->timestamps();

                $table->index('master_product_id', 'idx_mpv_product');
                $table->index('sku', 'idx_mpv_sku');
            });
        }

        // 11a. Master Catalog: SEO columns on master_products (default-language fallback)
        Schema::table('master_products', function (Blueprint $table) {
            if (!Schema::hasColumn('master_products', 'meta_title')) {
                $table->string('meta_title')->nullable()->after('description');
            }
            if (!Schema::hasColumn('master_products', 'meta_keywords')) {
                $table->text('meta_keywords')->nullable()->after('meta_title');
            }
            if (!Schema::hasColumn('master_products', 'meta_description')) {
                $table->text('meta_description')->nullable()->after('meta_keywords');
            }
            if (!Schema::hasColumn('master_products', 'schema_markup')) {
                $table->text('schema_markup')->nullable()->after('meta_description');
            }
        });

        // 11b. Master Catalog: Translations (per-language name / description / SEO fields)
        if (!Schema::hasTable('master_product_translations')) {
            Schema::create('master_product_translations', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('master_product_id');
                $table->unsignedBigInteger('language_id');
                $table->string('name')->nullable();
                $table->longText('description')->nullable();
                $table->string('meta_title')->nullable();
                $table->text('meta_keywords')->nullable();
                $table->text('schema_markup')->nullable();
                $table->text('meta_description')->nullable();
                $table->timestamps();

                $table->unique(['master_product_id', 'language_id'], 'uniq_mpt_product_language');
                $table->foreign('master_product_id', 'fk_mpt_product')
                    ->references('id')->on('master_products')->onDelete('cascade');
                $table->foreign('language_id', 'fk_mpt_language')
                    ->references('id')->on('languages')->onDelete('cascade');
            });
        }

        // 12. Seller (Distributor) Product Control: per-seller activation, mrp, selling price, stock
        if (!Schema::hasTable('seller_products')) {
            Schema::create('seller_products', function (Blueprint $table) {
                $table->id();
                $table->foreignId('seller_id')->constrained('sellers')->onDelete('cascade');
                $table->foreignId('master_product_variant_id')->constrained('master_product_variants')->onDelete('cascade');
                $table->decimal('mrp', 15, 4)->default(0);
                $table->decimal('selling_price', 15, 4)->default(0);
                $table->decimal('discounted_price', 15, 4)->nullable();
                $table->double('stock', 12, 3)->default(0);
                $table->tinyInteger('status')->default(1)->comment('1 = activated by distributor');
                $table->timestamps();

                $table->unique(['seller_id', 'master_product_variant_id'], 'uniq_sp_seller_variant');
                $table->index('seller_id', 'idx_sp_seller');
                $table->index('master_product_variant_id', 'idx_sp_variant');
            });
        }

        // 13. Seller Slab (Bulk) Pricing per seller_product
        if (!Schema::hasTable('seller_product_slab_prices')) {
            Schema::create('seller_product_slab_prices', function (Blueprint $table) {
                $table->id();
                $table->foreignId('seller_product_id')->constrained('seller_products')->onDelete('cascade');
                $table->unsignedInteger('min_qty');
                $table->unsignedInteger('max_qty')->nullable()->comment('NULL = open-ended (e.g. "50+")');
                $table->decimal('price', 15, 4);
                $table->timestamps();

                $table->index(['seller_product_id', 'min_qty'], 'idx_spsp_sp_minqty');
            });
        }

        // 8. Salesmen Table (onboarded by distributor)
        if (!Schema::hasTable('salesmen')) {
            Schema::create('salesmen', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('mobile')->unique();
                $table->foreignId('seller_id')->constrained('sellers')->onDelete('cascade')->comment('Distributor who onboarded the salesman');
                $table->text('brands')->comment('JSON array or CSV of assigned brand IDs');
                $table->boolean('allow_payment_collection')->default(false);
                $table->decimal('discount', 8, 2)->nullable()->comment('Discount percentage or amount');
                $table->tinyInteger('status')->default(1);
                $table->timestamps();
            });
        } else {
            Schema::table('salesmen', function (Blueprint $table) {
                if (!Schema::hasColumn('salesmen', 'discount')) {
                    $table->decimal('discount', 8, 2)->nullable()->after('allow_payment_collection')->comment('Discount percentage or amount');
                }
            });
        }


        // Delivery Boys Table Additions
        Schema::table('delivery_boys', function (Blueprint $table) {
            if (!Schema::hasColumn('delivery_boys', 'license_no')) {
                $table->string('license_no')->nullable()->after('mobile');
            }
            $table->text('address')->nullable()->change();
        });

        Schema::table('admins', function (Blueprint $table) {
            $table->string('email')->nullable()->change();
        });


        // 8.b Salesman login wiring: link to admins (email/password) for app/panel login (mirrors seller/delivery_boy)
        Schema::table('salesmen', function (Blueprint $table) {
            if (!Schema::hasColumn('salesmen', 'admin_id')) {
                $table->unsignedBigInteger('admin_id')->nullable()->after('id')->comment('FK to admins.id for login credentials');
            }
            if (!Schema::hasColumn('salesmen', 'email')) {
                $table->string('email')->nullable()->after('mobile');
            }
        });

        // 9. Retailer verification (Sarthi onboarding flow): hot-path columns on users + profile/audit table
        //    Status flow per spec: pending -> salesman_verified -> approved -> active
        //    Fan-out + first-claim model: salesman_id is set atomically at verify time.
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'verification_status')) {
                $table->enum('verification_status', ['pending', 'salesman_verified', 'approved', 'active'])
                      ->nullable()
                      ->after('status')
                      ->comment('Retailer onboarding lifecycle; NULL for non-retailer users');
            }
            if (!Schema::hasColumn('users', 'salesman_id')) {
                $table->unsignedBigInteger('salesman_id')->nullable()->after('verification_status')
                      ->comment('Owning salesman; set atomically on first verification claim');
                $table->index('salesman_id', 'idx_users_salesman');
            }
        });

        // 9.b Salesman assisted-order attribution.
        //     - carts.placed_by_salesman_id separates salesman drafts from retailer's own cart
        //     - orders.placed_by_salesman_id is the audit of who actually placed it
        //     - orders.salesman_discount records the absolute amount applied via salesman's discount cap
        Schema::table('carts', function (Blueprint $table) {
            if (!Schema::hasColumn('carts', 'placed_by_salesman_id')) {
                $table->unsignedBigInteger('placed_by_salesman_id')->nullable()->after('user_id')
                      ->comment('Salesman drafting this cart row on behalf of the retailer; NULL = retailer added themselves');
                $table->index(['user_id', 'placed_by_salesman_id'], 'idx_carts_user_salesman');
            }
        });
        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'placed_by_salesman_id')) {
                $table->unsignedBigInteger('placed_by_salesman_id')->nullable()->after('user_id')
                      ->comment('Set when a salesman placed the order on retailer behalf; NULL for direct retailer orders');
                $table->index('placed_by_salesman_id', 'idx_orders_salesman');
            }
            if (!Schema::hasColumn('orders', 'salesman_discount')) {
                $table->decimal('salesman_discount', 10, 2)->nullable()->after('discount')
                      ->comment('Absolute discount amount applied via salesman discount cap');
            }
        });

        if (!Schema::hasTable('retailer_profiles')) {
            Schema::create('retailer_profiles', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id')->unique()->comment('FK to users.id (retailer)');
                // Registration profile (set at signup)
                $table->string('shop_name')->nullable()->comment('Display name of the shop');
                $table->string('party_name')->nullable()->comment('Billing name for Tally sync');
                $table->string('gst_no')->nullable();
                $table->text('address')->nullable()->comment('Shop address captured at signup');
                $table->unsignedBigInteger('city_id')->nullable()->comment('Drives distributor fan-out');
                $table->decimal('gps_lat', 10, 7)->nullable()->comment('Captured at signup');
                $table->decimal('gps_lng', 10, 7)->nullable();
                // Verification audit (set when a salesman verifies in person)
                $table->decimal('verified_lat', 10, 7)->nullable()->comment('Storefront GPS captured by salesman');
                $table->decimal('verified_lng', 10, 7)->nullable();
                $table->string('storefront_photo')->nullable();
                $table->text('verification_notes')->nullable();
                $table->timestamp('verified_at')->nullable();
                $table->unsignedBigInteger('verified_by_salesman_id')->nullable();
                $table->timestamps();

                $table->index('city_id', 'idx_rp_city');
                $table->index('verified_by_salesman_id', 'idx_rp_verified_by');
            });
        }


        // Order Execution per Stop: Cash, UPI, photo and reason
        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'cash_received')) {
                $table->decimal('cash_received', 15, 2)->nullable()->after('final_total');
            }
            if (!Schema::hasColumn('orders', 'upi_received')) {
                $table->decimal('upi_received', 15, 2)->nullable()->after('cash_received');
            }
            if (!Schema::hasColumn('orders', 'upi_photo')) {
                $table->string('upi_photo')->nullable()->after('upi_received');
            }
            if (!Schema::hasColumn('orders', 'delivery_reason')) {
                $table->string('delivery_reason')->nullable()->after('upi_photo');
            }
        });

        // Item level delivery tracking
        Schema::table('order_items', function (Blueprint $table) {
            if (!Schema::hasColumn('order_items', 'delivered_quantity')) {
                $table->integer('delivered_quantity')->nullable()->after('quantity');
            }
            if (!Schema::hasColumn('order_items', 'damage_photo')) {
                $table->string('damage_photo')->nullable()->after('delivered_quantity');
            }
        });

        // 10. Scheme Engine: distributor-owned offers (Buy X Get Y + group slab discount, auto-apply best)
        if (!Schema::hasTable('schemes')) {
            Schema::create('schemes', function (Blueprint $table) {
                $table->id();
                $table->foreignId('seller_id')->constrained('sellers')->onDelete('cascade');
                $table->string('name');
                $table->enum('type', ['buy_x_get_y', 'group_discount_price', 'group_discount_qty']);
                // buy_x_get_y fields (NULL for group_discount)
                $table->unsignedBigInteger('buy_seller_product_id')->nullable();
                $table->unsignedInteger('buy_qty')->nullable();
                $table->unsignedBigInteger('free_seller_product_id')->nullable();
                $table->unsignedInteger('free_qty')->nullable();
                $table->date('start_date');
                $table->date('end_date');
                $table->tinyInteger('status')->default(1);
                $table->timestamps();

                $table->index(['seller_id', 'status', 'start_date', 'end_date'], 'idx_schemes_active');
            });
        }

        // 10.b Group-discount basket definition
        if (!Schema::hasTable('scheme_products')) {
            Schema::create('scheme_products', function (Blueprint $table) {
                $table->id();
                $table->foreignId('scheme_id')->constrained('schemes')->onDelete('cascade');
                $table->foreignId('seller_product_id')->constrained('seller_products')->onDelete('cascade');
                $table->timestamps();

                $table->unique(['scheme_id', 'seller_product_id'], 'uniq_schemeprod');
            });
        }

        // 10.c Group-discount value slabs (combined basket value -> discount)
        if (!Schema::hasTable('scheme_slabs')) {
            Schema::create('scheme_slabs', function (Blueprint $table) {
                $table->id();
                $table->foreignId('scheme_id')->constrained('schemes')->onDelete('cascade');
                $table->decimal('min_value', 15, 4)->comment('Combined group basket value to trigger this slab');
                $table->enum('discount_type', ['percentage', 'flat']);
                $table->decimal('discount_value', 15, 4);
                $table->timestamps();

                $table->index(['scheme_id', 'min_value'], 'idx_schemeslabs_minval');
            });
        }

        // 10.d-pre. Migrate existing 'group_discount' records to 'group_discount_price' and expand enum
        if (Schema::hasTable('schemes')) {
            // Step 1: expand enum to include all old + new values so the UPDATE below is valid
            DB::statement("ALTER TABLE schemes MODIFY COLUMN type ENUM('buy_x_get_y','group_discount','group_discount_price','group_discount_qty') NOT NULL");
            // Step 2: rename existing data
            DB::table('schemes')->where('type', 'group_discount')->update(['type' => 'group_discount_price']);
            // Step 3: drop the legacy value
            DB::statement("ALTER TABLE schemes MODIFY COLUMN type ENUM('buy_x_get_y','group_discount_price','group_discount_qty') NOT NULL");
        }

        // 10.d Scheme snapshot on orders (kept even if scheme is later deleted/edited)
        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'scheme_id')) {
                $table->unsignedBigInteger('scheme_id')->nullable()->after('promo_discount')
                      ->comment('Best scheme auto-applied at place-order time');
            }
            if (!Schema::hasColumn('orders', 'scheme_discount')) {
                $table->decimal('scheme_discount', 15, 4)->default(0)->after('scheme_id')
                      ->comment('Absolute amount deducted by group_discount scheme');
            }
        });
        Schema::table('order_items', function (Blueprint $table) {
            if (!Schema::hasColumn('order_items', 'scheme_id')) {
                $table->unsignedBigInteger('scheme_id')->nullable()->after('slab_max_qty');
            }
            if (!Schema::hasColumn('order_items', 'is_free_item')) {
                $table->tinyInteger('is_free_item')->default(0)->after('scheme_id')
                      ->comment('1 = free line added by buy_x_get_y scheme (price 0, deducts stock)');
            }
        });

        // ── 11. Payment Collection & Settlement ────────────────────────────────

        // 11.a Admin-level payment method toggles — 4 rows in the existing settings table
        $methods = ['cash', 'upi', 'cheque', 'signature'];
        foreach ($methods as $method) {
            $key = 'payment_method_' . $method;
            if (!DB::table('settings')->where('variable', $key)->exists()) {
                DB::table('settings')->insert(['variable' => $key, 'value' => '1']);
            }
        }

        // 11.b Distributor-level toggles — 4 tinyint columns on sellers
        Schema::table('sellers', function (Blueprint $table) {
            if (!Schema::hasColumn('sellers', 'payment_method_cash')) {
                $table->tinyInteger('payment_method_cash')->default(1)->after('change_order_status_delivered');
            }
            if (!Schema::hasColumn('sellers', 'payment_method_upi')) {
                $table->tinyInteger('payment_method_upi')->default(1)->after('payment_method_cash');
            }
            if (!Schema::hasColumn('sellers', 'payment_method_cheque')) {
                $table->tinyInteger('payment_method_cheque')->default(1)->after('payment_method_upi');
            }
            if (!Schema::hasColumn('sellers', 'payment_method_signature')) {
                $table->tinyInteger('payment_method_signature')->default(1)->after('payment_method_cheque');
            }
        });

        // 11.c Link delivery_boy to distributor (seller) so we can resolve their payment settings
        Schema::table('delivery_boys', function (Blueprint $table) {
            if (!Schema::hasColumn('delivery_boys', 'seller_id')) {
                $table->unsignedBigInteger('seller_id')->nullable()->after('admin_id')
                      ->comment('Distributor this driver belongs to');
                $table->index('seller_id', 'idx_db_seller');
            }
        });

        // 11.d Driver payment collection records (one row per collection event per order)
        if (!Schema::hasTable('order_payments')) {
            Schema::create('order_payments', function (Blueprint $table) {
                $table->id();
                $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
                $table->foreignId('delivery_boy_id')->constrained('delivery_boys')->onDelete('cascade');
                $table->enum('method', ['cash', 'upi', 'cheque', 'signature']);
                $table->decimal('amount', 15, 2)->nullable()->comment('Amount collected; required for all methods');
                $table->string('proof_photo')->nullable()->comment('Required for upi/cheque/signature');
                $table->enum('status', ['pending', 'verified'])->default('pending');
                $table->unsignedBigInteger('verified_by')->nullable()->comment('admins.id of distributor who verified');
                $table->timestamp('verified_at')->nullable();
                $table->timestamps();

                $table->index(['order_id'], 'idx_op_order');
                $table->index(['delivery_boy_id', 'status'], 'idx_op_driver_status');
            });
        }

        // 11.e Driver EOD settlement summary (one row per driver per day)
        if (!Schema::hasTable('driver_settlements')) {
            Schema::create('driver_settlements', function (Blueprint $table) {
                $table->id();
                $table->foreignId('delivery_boy_id')->constrained('delivery_boys')->onDelete('cascade');
                $table->unsignedBigInteger('seller_id');
                $table->date('settlement_date');
                $table->integer('total_orders')->default(0);
                $table->decimal('total_cash', 15, 2)->default(0);
                $table->decimal('total_upi', 15, 2)->default(0);
                $table->decimal('total_cheque', 15, 2)->default(0);
                $table->decimal('total_signature', 15, 2)->default(0);
                $table->enum('status', ['open', 'locked', 'reconciled'])->default('open');
                $table->timestamp('locked_at')->nullable();
                $table->decimal('cash_received', 15, 2)->nullable();
                $table->enum('reconciliation_status', ['unreconciled', 'partial_match', 'full_match', 'overpaid'])->default('unreconciled');
                $table->timestamp('reconciled_at')->nullable();
                $table->unsignedBigInteger('reconciled_by')->nullable();
                $table->timestamps();

                $table->unique(['delivery_boy_id', 'settlement_date'], 'uniq_ds_driver_date');
                $table->index('seller_id', 'idx_ds_seller');
            });
        } else {
            // Add reconciliation columns if table already existed from a prior migration run
            Schema::table('driver_settlements', function (Blueprint $table) {
                if (!Schema::hasColumn('driver_settlements', 'cash_received')) {
                    $table->decimal('cash_received', 15, 2)->nullable()->after('locked_at');
                }
                if (!Schema::hasColumn('driver_settlements', 'reconciliation_status')) {
                    $table->enum('reconciliation_status', ['unreconciled', 'partial_match', 'full_match', 'overpaid'])
                          ->default('unreconciled')->after('cash_received');
                }
                if (!Schema::hasColumn('driver_settlements', 'reconciled_at')) {
                    $table->timestamp('reconciled_at')->nullable()->after('reconciliation_status');
                }
                if (!Schema::hasColumn('driver_settlements', 'reconciled_by')) {
                    $table->unsignedBigInteger('reconciled_by')->nullable()->after('reconciled_at');
                }
            });
            // Ensure status enum includes 'reconciled' (was added after initial deploy)
            DB::statement("ALTER TABLE driver_settlements MODIFY status ENUM('open','locked','reconciled') NOT NULL DEFAULT 'open'");
        }

        // Seller-wise product ratings
        Schema::table('product_ratings', function (Blueprint $table) {
            if (!Schema::hasColumn('product_ratings', 'seller_id')) {
                $table->unsignedBigInteger('seller_id')->nullable()->after('product_id');
                $table->index('seller_id', 'idx_pr_seller');
            }
            // try { $table->dropUnique(['product_id', 'user_id']); } catch (\Throwable $e) {}
            $existingIndexes = collect(DB::select("SHOW INDEX FROM product_ratings"))->pluck('Key_name')->toArray();
            if (!in_array('uniq_pr_product_user_seller', $existingIndexes)) {
                $table->unique(['product_id', 'user_id', 'seller_id'], 'uniq_pr_product_user_seller');
            }
        });

        // Salesman notifications (bell icon in mobile app)
        if (!Schema::hasTable('salesman_notifications')) {
            Schema::create('salesman_notifications', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('salesman_id');
                $table->string('title');
                $table->text('message');
                $table->string('type')->default('general');
                $table->unsignedBigInteger('order_id')->nullable();
                $table->timestamp('read_at')->nullable();
                $table->timestamps();
                $table->index('salesman_id', 'idx_sn_salesman');
            });
        }

        // ── Retailer Address Change Requests ─────────────────────────────────
        if (!Schema::hasTable('retailer_address_change_requests')) {
            Schema::create('retailer_address_change_requests', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id')->comment('Retailer user ID');
                $table->text('reason')->nullable();

                // Old address snapshot (captured at request time)
                $table->text('old_address')->nullable();
                $table->unsignedBigInteger('old_city_id')->nullable();
                $table->decimal('old_gps_lat', 10, 7)->nullable();
                $table->decimal('old_gps_lng', 10, 7)->nullable();

                // New requested address
                $table->text('new_address');
                $table->unsignedBigInteger('new_city_id');
                $table->decimal('new_gps_lat', 10, 7);
                $table->decimal('new_gps_lng', 10, 7);

                // Workflow status
                $table->enum('status', ['pending', 'assigned', 'verified', 'rejected'])->default('pending');
                $table->unsignedBigInteger('assigned_salesman_id')->nullable();

                // Filled by salesman on re-verification
                $table->decimal('verified_lat', 10, 7)->nullable();
                $table->decimal('verified_lng', 10, 7)->nullable();
                $table->string('storefront_photo')->nullable();
                $table->text('verification_notes')->nullable();
                $table->unsignedBigInteger('verified_by_salesman_id')->nullable();
                $table->timestamp('verified_at')->nullable();

                $table->text('rejected_reason')->nullable();
                $table->timestamps();

                $table->index('user_id', 'idx_racr_user');
                $table->index('status', 'idx_racr_status');
                $table->index('new_city_id', 'idx_racr_city');
            });
        }

        // ── Reconciliation Redesign ────────────────────────────────────────────
        // Trips are now per-person (driver or salesman) per day, not per loading slip.

        // Add salesman_id to order_payments so salesmen can also collect signed payments.
        // delivery_boy_id becomes nullable — exactly one of the two is always set per row.
        Schema::table('order_payments', function (Blueprint $table) {
            if (!Schema::hasColumn('order_payments', 'salesman_id')) {
                $table->unsignedBigInteger('salesman_id')->nullable()->after('delivery_boy_id')
                      ->comment('Set when a salesman collected this payment; mutually exclusive with delivery_boy_id');
                $table->index(['salesman_id', 'status'], 'idx_op_salesman_status');
            }
            if (Schema::hasColumn('order_payments', 'delivery_boy_id')) {
                $table->unsignedBigInteger('delivery_boy_id')->nullable()->change();
            }
        });

        // Salesman EOD settlement summary — mirrors driver_settlements, one row per salesman per day.
        if (!Schema::hasTable('salesman_settlements')) {
            Schema::create('salesman_settlements', function (Blueprint $table) {
                $table->id();
                $table->foreignId('salesman_id')->constrained('salesmen')->onDelete('cascade');
                $table->unsignedBigInteger('seller_id')->comment('Distributor who owns this salesman');
                $table->date('settlement_date');
                $table->integer('total_orders')->default(0);
                $table->decimal('total_cash', 15, 2)->default(0);
                $table->decimal('total_upi', 15, 2)->default(0);
                $table->decimal('total_cheque', 15, 2)->default(0);
                $table->decimal('total_signature', 15, 2)->default(0);
                $table->enum('status', ['open', 'locked', 'reconciled'])->default('open');
                $table->timestamp('locked_at')->nullable();
                $table->decimal('cash_received', 15, 2)->nullable()->comment('Cash physically handed to distributor');
                $table->enum('reconciliation_status', ['unreconciled', 'partial_match', 'full_match', 'overpaid'])->default('unreconciled');
                $table->timestamp('reconciled_at')->nullable();
                $table->unsignedBigInteger('reconciled_by')->nullable()->comment('admins.id of distributor who reconciled');
                $table->timestamps();

                $table->unique(['salesman_id', 'settlement_date'], 'uniq_ss_salesman_date');
                $table->index('seller_id', 'idx_ss_seller');
            });
        }

        // OTP role locking — scope OTPs to the role that requested them (3=seller, 4=delivery_boy, 5=salesman)
        Schema::table('sms_verifications', function (Blueprint $table) {
            if (!Schema::hasColumn('sms_verifications', 'user_type')) {
                $table->tinyInteger('user_type')->nullable()->after('phone');
            }
        });

        // Ensure Rescheduled status (ID 12) exists in the order_status_lists table
        $rescheduledExists = DB::table('order_status_lists')->where('id', 12)->exists();
        if (!$rescheduledExists) {
            DB::table('order_status_lists')->where('status', 'Rescheduled')->delete();
            DB::table('order_status_lists')->insert([
                'id' => 12,
                'status' => 'Rescheduled'
            ]);
        }

        // POS orders in mainline: expand order_type enum + make user_id nullable
        if (Schema::hasColumn('orders', 'order_type')) {
            DB::statement("ALTER TABLE orders MODIFY COLUMN order_type ENUM('doorstep','selfpickup','pos') NOT NULL DEFAULT 'doorstep'");
        }
        Schema::table('orders', function (Blueprint $table) {
            if (Schema::hasColumn('orders', 'user_id')) {
                $table->unsignedBigInteger('user_id')->nullable()->change();
            }
        });

        $orders = DB::table('orders')->get();
        foreach ($orders as $order) {
            $latestStatus = DB::table('order_statuses')
                ->where('order_id', $order->id)
                ->orderBy('id', 'desc')
                ->first();

            if ($latestStatus && trim(strtolower($latestStatus->status)) === 'rescheduled') {
                DB::table('orders')
                    ->where('id', $order->id)
                    ->update(['active_status' => \App\Models\OrderStatusList::$rescheduled]);

                DB::table('order_items')
                    ->where('order_id', $order->id)
                    ->whereNotIn('active_status', [\App\Models\OrderStatusList::$cancelled, \App\Models\OrderStatusList::$returned])
                    ->update(['active_status' => \App\Models\OrderStatusList::$rescheduled]);
            }
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // POS mainline order_type shrink back + user_id not-nullable
        DB::statement("ALTER TABLE orders MODIFY COLUMN order_type ENUM('doorstep','selfpickup') NOT NULL DEFAULT 'doorstep'");
        Schema::table('orders', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable(false)->change();
        });

        // OTP role locking (reverse)
        Schema::table('sms_verifications', function (Blueprint $table) {
            if (Schema::hasColumn('sms_verifications', 'user_type')) {
                $table->dropColumn('user_type');
            }
        });

        // Address change requests (reverse)
        Schema::dropIfExists('retailer_address_change_requests');

        // Reconciliation redesign (reverse)
        Schema::dropIfExists('salesman_settlements');
        Schema::table('order_payments', function (Blueprint $table) {
            if (Schema::hasColumn('order_payments', 'salesman_id')) {
                $table->dropIndex('idx_op_salesman_status');
                $table->dropColumn('salesman_id');
            }
        });

        // Settlement (reverse)
        Schema::dropIfExists('salesman_notifications');
        Schema::dropIfExists('driver_settlements');
        Schema::dropIfExists('order_payments');
        Schema::table('delivery_boys', function (Blueprint $table) {
            if (Schema::hasColumn('delivery_boys', 'seller_id')) {
                $table->dropIndex('idx_db_seller');
                $table->dropColumn('seller_id');
            }
        });
        Schema::table('sellers', function (Blueprint $table) {
            foreach (['payment_method_cash', 'payment_method_upi', 'payment_method_cheque', 'payment_method_signature'] as $col) {
                if (Schema::hasColumn('sellers', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
        DB::table('settings')->whereIn('variable', [
            'payment_method_cash', 'payment_method_upi', 'payment_method_cheque', 'payment_method_signature',
        ])->delete();

        // Scheme engine (reverse FK order)
        if (Schema::hasTable('schemes')) {
            DB::statement("ALTER TABLE schemes MODIFY COLUMN type ENUM('buy_x_get_y','group_discount','group_discount_price','group_discount_qty') NOT NULL");
            DB::table('schemes')->whereIn('type', ['group_discount_price', 'group_discount_qty'])->update(['type' => 'group_discount']);
            DB::statement("ALTER TABLE schemes MODIFY COLUMN type ENUM('buy_x_get_y','group_discount') NOT NULL");
        }
        Schema::dropIfExists('scheme_slabs');
        Schema::dropIfExists('scheme_products');
        Schema::dropIfExists('schemes');
        Schema::table('orders', function (Blueprint $table) {
            foreach (['scheme_id', 'scheme_discount'] as $col) {
                if (Schema::hasColumn('orders', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
        Schema::table('order_items', function (Blueprint $table) {
            foreach (['scheme_id', 'is_free_item'] as $col) {
                if (Schema::hasColumn('order_items', $col)) {
                    $table->dropColumn($col);
                }
            }
        });

        // Salesman assisted-order attribution
        Schema::table('orders', function (Blueprint $table) {
            if (Schema::hasColumn('orders', 'salesman_discount')) {
                $table->dropColumn('salesman_discount');
            }
            if (Schema::hasColumn('orders', 'placed_by_salesman_id')) {
                $table->dropIndex('idx_orders_salesman');
                $table->dropColumn('placed_by_salesman_id');
            }
        });
        Schema::table('carts', function (Blueprint $table) {
            if (Schema::hasColumn('carts', 'placed_by_salesman_id')) {
                $table->dropIndex('idx_carts_user_salesman');
                $table->dropColumn('placed_by_salesman_id');
            }
        });

        // Retailer verification
        Schema::dropIfExists('retailer_profiles');
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'salesman_id')) {
                $table->dropIndex('idx_users_salesman');
                $table->dropColumn('salesman_id');
            }
            if (Schema::hasColumn('users', 'verification_status')) {
                $table->dropColumn('verification_status');
            }
        });

        // Master catalog (reverse FK order)
        Schema::dropIfExists('seller_product_slab_prices');
        Schema::dropIfExists('seller_products');
        Schema::dropIfExists('master_product_translations');
        Schema::dropIfExists('master_product_variants');
        Schema::dropIfExists('master_products');
        Schema::dropIfExists('parent_companies');

        if (Schema::hasColumn('orders', 'delivery_date')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->dropColumn('delivery_date');
            });
        }


        Schema::dropIfExists('brand_distributor_mappings');

        Schema::table('sellers', function (Blueprint $table) {
            if (Schema::hasColumn('sellers', 'order_cutoff_time')) {
                $table->dropColumn('order_cutoff_time');
            }
        });

        if (Schema::hasColumn('brands', 'is_overlap_allowed')) {
            Schema::table('brands', function (Blueprint $table) {
                $table->dropColumn('is_overlap_allowed');
            });
        }

        Schema::table('order_items', function (Blueprint $table) {
            foreach (['slab_unit_price', 'slab_min_qty', 'slab_max_qty', 'master_product_variant_id', 'seller_product_id', 'delivered_quantity', 'damage_photo'] as $col) {
                if (Schema::hasColumn('order_items', $col)) {
                    $table->dropColumn($col);
                }
            }
        });

        if (Schema::hasTable('pos_order_items')) {
            Schema::table('pos_order_items', function (Blueprint $table) {
                foreach (['slab_unit_price', 'slab_min_qty', 'slab_max_qty', 'master_product_variant_id', 'seller_product_id'] as $col) {
                    if (Schema::hasColumn('pos_order_items', $col)) {
                        $table->dropColumn($col);
                    }
                }
            });
        }

        if (Schema::hasTable('carts')) {
            Schema::table('carts', function (Blueprint $table) {
                foreach (['master_product_variant_id', 'seller_id', 'seller_product_id'] as $col) {
                    if (Schema::hasColumn('carts', $col)) {
                        $table->dropColumn($col);
                    }
                }
            });
        }

        Schema::dropIfExists('product_slab_prices');

        Schema::table('product_variants', function (Blueprint $table) {
            if (Schema::hasColumn('product_variants', 'sku')) {
                $table->dropColumn('sku');
            }
            if (Schema::hasColumn('product_variants', 'secondary_unit_id')) {
                $table->dropColumn('secondary_unit_id');
            }
            if (Schema::hasColumn('product_variants', 'secondary_unit_value')) {
                $table->dropColumn('secondary_unit_value');
            }
        });

        Schema::table('orders', function (Blueprint $table) {
            if (Schema::hasColumn('orders', 'weight')) {
                $table->dropColumn('weight');
            }
            if (Schema::hasColumn('orders', 'loading_slip_id')) {
                $table->dropColumn('loading_slip_id');
            }
            foreach (['cash_received', 'upi_received', 'upi_photo', 'delivery_reason'] as $col) {
                if (Schema::hasColumn('orders', $col)) {
                    $table->dropColumn($col);
                }
            }
        });

        Schema::dropIfExists('loading_slips');
        Schema::dropIfExists('vehicles');
        Schema::dropIfExists('vehicles_and_dispatches_tables');
        Schema::dropIfExists('salesmen');

        Schema::table('delivery_boys', function (Blueprint $table) {
            if (Schema::hasColumn('delivery_boys', 'license_no')) {
                $table->dropColumn('license_no');
            }
        });

        Schema::table('admins', function (Blueprint $table) {
            $table->string('email')->nullable(false)->change();
        });
    }
}
