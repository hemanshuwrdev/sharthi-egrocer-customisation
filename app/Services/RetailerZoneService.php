<?php

namespace App\Services;

use App\Helpers\CommonHelper;
use App\Models\City;
use App\Models\RetailerAddressChangeRequest;
use App\Models\RetailerProfile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Which delivery zones (cities rows) a retailer's shop sits in.
 *
 * Zones can overlap, but retailer_profiles.city_id only stores ONE of them (the first match at signup).
 * A distributor whose territory is a different zone covering the same spot would then wrongly see the
 * retailer as "not in your area". This keeps every zone containing the shop in retailer_profile_cities,
 * and the salesman app matches on any of them.
 */
class RetailerZoneService
{
    /**
     * Ids of every zone whose boundary contains the point — same maths as
     * CommonHelper::getDeliverableCityIds(), but takes pre-loaded zones so bulk jobs
     * don't reload them for every retailer.
     */
    public function zoneIdsForPoint($lat, $lng, ?Collection $cities = null): array
    {
        if ($lat === null || $lat === '' || $lng === null || $lng === '') {
            return [];
        }

        $point = ['lat' => $lat, 'lng' => $lng];
        $cities = $cities ?? City::all();
        $ids = [];

        foreach ($cities as $city) {
            $boundary = json_decode($city->boundary_points, true);
            if (!is_array($boundary) || empty($boundary)) {
                continue;
            }

            if ($city->geolocation_type == 'polygon') {
                if (CommonHelper::isPointInPolygon($point, $boundary)) {
                    $ids[] = (int) $city->id;
                }
            } elseif ($city->geolocation_type == 'circle') {
                if (CommonHelper::isPointInCircle($point, $boundary[0], $city->radius)) {
                    $ids[] = (int) $city->id;
                }
            }
        }

        return $ids;
    }

    /**
     * Ids of the open (pending / assigned) address-change requests whose NEW location sits in any of $zoneIds.
     *
     * A request stores only the first zone that matched its point (new_city_id), but zones overlap — so
     * matching new_city_id alone hides it from a distributor whose territory is another zone covering the
     * same spot, even though salesmen of every overlapping zone are notified. The stored zone is the cheap
     * check; otherwise every zone containing the point is worked out (open requests are few).
     *
     * @param  int[] $zoneIds the salesman's distributor's zones
     * @return int[]
     */
    public function openAddressChangeRequestIdsInZones(array $zoneIds): array
    {
        $zoneIds = array_map('intval', $zoneIds);
        if (empty($zoneIds)) {
            return [];
        }

        $cities = null;

        return RetailerAddressChangeRequest::whereIn('status', ['pending', 'assigned'])
            ->get(['id', 'new_city_id', 'new_gps_lat', 'new_gps_lng'])
            ->filter(function ($request) use ($zoneIds, &$cities) {
                if (in_array((int) $request->new_city_id, $zoneIds, true)) {
                    return true;
                }
                $cities = $cities ?? City::all();

                return !empty(array_intersect($this->zoneIdsForPoint($request->new_gps_lat, $request->new_gps_lng, $cities), $zoneIds));
            })
            ->pluck('id')
            ->all();
    }

    /**
     * Replace one retailer's zone list with every zone containing their location,
     * plus their stored city_id (so a retailer is never left without a zone).
     *
     * @return int[] the zone ids now stored
     */
    public function syncRetailer(int $userId, $lat, $lng, $storedCityId = null, ?Collection $cities = null): array
    {
        $ids = $this->zoneIdsForPoint($lat, $lng, $cities);
        if ($storedCityId) {
            $ids[] = (int) $storedCityId;
        }
        $ids = array_values(array_unique($ids));

        DB::transaction(function () use ($userId, $ids) {
            DB::table('retailer_profile_cities')->where('user_id', $userId)->delete();
            if (!empty($ids)) {
                $now = now();
                DB::table('retailer_profile_cities')->insert(array_map(fn ($cityId) => [
                    'user_id' => $userId,
                    'city_id' => $cityId,
                    'created_at' => $now,
                    'updated_at' => $now,
                ], $ids));
            }
        });

        return $ids;
    }

    /**
     * Recompute every retailer (after a zone is added or its boundary changes, and for the backfill).
     *
     * @return int number of retailers processed
     */
    public function syncAll(): int
    {
        $cities = City::all();
        $count = 0;

        RetailerProfile::query()->orderBy('id')->chunkById(200, function ($profiles) use ($cities, &$count) {
            foreach ($profiles as $profile) {
                $this->syncRetailer((int) $profile->user_id, $profile->gps_lat, $profile->gps_lng, $profile->city_id, $cities);
                $count++;
            }
        });

        return $count;
    }
}
