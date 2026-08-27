# API Changes — Retailer Address: Area Selection

## What changed
Address save/update now accepts an optional `area_id`. One pincode can match more than one Area, so the app must let the retailer pick which one — the server will not guess.

## 1. New step: look up Areas by pincode

```
GET /api/area/search-by-pincode?pincode=382120
```
- No auth required.
- Response:
```json
{
  "status": 1,
  "message": "Success",
  "data": [
    { "id": 1, "city_id": 2, "name": "Area 1", "pincode": "382120", "state": "Gujarat", "district": "Ahmedabad", "status": 1 }
  ]
}
```
- If `data` has exactly 1 item → auto-select it.
- If `data` has 2+ items → show a picker (e.g. by `name`), retailer confirms one.
- If `data` is empty → no Area covers that pincode yet; proceed without `area_id` (nothing blocks the save).

## 2. Address save / update — one new field

```
POST /api/customer/address/add      (unchanged fields, PLUS:)
POST /api/customer/address/update   (unchanged fields, PLUS:)
```
Auth: `Authenticate:api-customers` (unchanged).

**New optional field:** `area_id` — the `id` from step 1's response, if one was picked.

- If `area_id` is sent, it must belong to the same `pincode` also being submitted, or the request is rejected:
```json
{ "status": 0, "message": "Selected area does not match the entered pincode" }
```
- If `area_id` is omitted, the address still saves normally (`area_id` stored as `null`).

## Suggested app flow
1. Retailer types pincode in the address form.
2. Call `GET area/search-by-pincode?pincode=X`.
3. Auto-select if 1 match, show picker if multiple, skip if none.
4. Submit address as before, including `area_id` if one was selected.

## Nothing else changes
No other fields, no other endpoints, no response shape changes on existing calls.
