# API Changes — Scheme quantity tiers (+ a few other small changes)

## What changed
A scheme can now have **several quantity tiers**, e.g. *min 25 max 100 → ₹321 off*, *min 101 max 200 → ₹432 off*, *min 201 (no max) → ₹500 off*. The distributor sets the Min, Max and the amount of each tier; the discount type (flat / % / free product) and the qty basis (outer / inner) stay the same for every tier. Only **one tier applies** to a cart — the one its combined quantity falls in (tiers don't add up; different schemes still stack as before). A quantity outside every tier gets no discount from that scheme.

Everything below is **additive**. Existing keys keep their meaning and older app builds keep working — but for a tiered scheme the old keys describe **tier 1 only**, so the apps should show the new `tiers` list.

**Discounts are always worked out by the server.** The cart, order preview and place-order already use the right tier — the apps must not compute a tier discount themselves. `applied_schemes[]` / `applied_scheme` show what was actually applied, as before.

## 1. The `tiers` list — retailer and salesman apps

A new `tiers` key is added to every scheme object returned by:

| App | Endpoint |
|---|---|
| Retailer | `GET /customer/schemes` |
| Salesman | `GET /api/salesman/schemes` |

and to every `nearest_scheme` object (see section 2).

```json
"tiers": [
  { "min_qty": 25,  "max_qty": 100,  "conditions": "Combined Min 25 Pack, Max 100 Pack", "reward": "₹321 off" },
  { "min_qty": 101, "max_qty": 200,  "conditions": "Combined Min 101 Pack, Max 200 Pack", "reward": "₹432 off" },
  { "min_qty": 201, "max_qty": null, "conditions": "Combined Min 201 Pack", "reward": "₹500 off" }
]
```

- **`tiers` is `[]` unless the scheme has 2 or more tiers.** When it is empty, keep using `conditions` / `reward` / `combo_condition` / `combo_reward` exactly as today.
- Tiers come lowest range first. `min_qty` / `max_qty` are in the scheme's qty basis (the `conditions` text already says Pack / Unit). **`max_qty: null` means no upper limit** — show it as "and above".
- `conditions` and `reward` are ready-to-show text. A multi-product scheme starts with "Combined"; a single-product scheme doesn't.
- For a tiered scheme, `combo_condition`, `combo_reward`, `products[].conditions` and `products[].reward` show **tier 1 only**.

## 2. `nearest_scheme` on products — retailer and salesman apps

| App | Endpoint | Where |
|---|---|---|
| Retailer | `POST /customer/products` | `offers[].nearest_scheme` |
| Retailer | `POST /customer/product_by_id` | `offers[].nearest_scheme` |
| Salesman | `GET /api/salesman/products` | `offer.nearest_scheme` |

- `nearest_scheme` now carries `tiers` (same shape as above).
- **Bug fix on the retailer endpoints:** `nearest_scheme` came back `null` for almost every scheme distributors create today (schemes with per-product quantity conditions), so a product that *was* in a scheme showed none. It now returns the scheme, with the extra keys `is_multi_combo`, `conditions`, `reward` and `tiers` (the salesman app already had the first three). Existing keys (`id`, `name`, `type`, `end_date`, `buy_qty`, `free_product`, `free_qty`, `slabs`) are unchanged.
- It is still the one scheme that ends soonest for that product. `applied_schemes[]` on `product_by_id` is still empty until the product is in the cart and the cart qualifies.

## 3. Cart / place order — no change
Request and response shapes are unchanged. The discount, `applied_schemes[]` and the order totals use the matching tier automatically. The cart's `nearest_scheme` / `nearest_schemes[]` hint (schemes not yet unlocked) points at the scheme's **first tier** — it does not yet say "add N more to reach the next tier".

## 4. Distributor app (`/api/seller/schemes`) — only if a distributor app edits schemes

| Endpoint | Change |
|---|---|
| `GET /api/seller/schemes` | each scheme gains `tiers` — `[{min_qty, max_qty, conditions, reward}]`, empty unless 2+ tiers |
| `GET /api/seller/schemes/edit/{id}` | new `tiers` — `[{min_qty, max_qty, discount_value, free_qty}]`, lowest first, **tier 1 included**; empty unless 2+ tiers |
| `POST /api/seller/schemes/save` and `/update` | accept `tiers` (array or JSON string) |

Send `tiers` with **all** tiers including tier 1 (at least 2, otherwise leave it out or send `[]`). `products[]` is sent exactly as before; the server stores the lowest tier on it.

```json
{
  "name": "Madhur sugar combo", "type": "group_discount", "tax_option": "inclusive",
  "start_date": "2026-10-01", "end_date": "2027-01-31", "status": 1,
  "products": [
    { "seller_product_id": 1, "qty_basis": "outer", "min_qty": 25, "max_qty": 100, "discount_type": "flat", "discount_value": 321, "free_qty": 1, "free_qty_basis": "inner" },
    { "seller_product_id": 2, "qty_basis": "outer", "min_qty": 25, "max_qty": 100, "discount_type": "flat", "discount_value": 321, "free_qty": 1, "free_qty_basis": "inner" }
  ],
  "tiers": [
    { "min_qty": 25,  "max_qty": 100,  "discount_value": 321, "free_qty": null },
    { "min_qty": 101, "max_qty": 200,  "discount_value": 432, "free_qty": null },
    { "min_qty": 201, "max_qty": null, "discount_value": 500, "free_qty": null }
  ]
}
```

- **The amount of a tier** is `discount_value` for `percentage`, `flat` and `discounted_product` (the %), and `free_qty` for `free_product`. The discount type and qty basis come from `products[]` and are the same for every tier.
- **Rules (server returns `status: 0` + message):** every tier needs a Min and an amount; Max may be empty only on the last tier; tiers must not overlap (each Min greater than the previous Max); a percentage cannot exceed 100. Messages look like `Tier 2: Min Quantity must be more than Tier 1's Max Quantity.`
- **Updating a tiered scheme:** always send the `tiers` key (use `[]` to turn it back into a plain single rule). An update that omits `tiers` on a scheme that has tiers is refused with *"This scheme has quantity tiers this app version cannot edit. Please edit it from the web panel."* — so an old app can't silently wipe tiers 2+.

---

## Other small API changes in the same release

**Retailer app — `GET /customer/sellers`**: each distributor now also has `mobile` (with country code, e.g. `"+911212121212"`), `address` (Address Line 1 + 2, else the Google address), `latitude`, `longitude`.

**Salesman app — `POST /api/salesman/orders/place`**: the order note parameter is **`order_note`** (the same name as the retailer app's `place_order`; it was already supported). A parameter called `note` is ignored.

**Salesman app — retailer lists** (`my-retailers`, `pending`, `overview`, QR scan): no change to the request or response. A retailer whose area no active distributor in its zone has assigned — or who has no area — now shows to every distributor serving that zone, instead of being hidden from all salesmen.

**Distributor web panel — `GET /seller/loading_slips/areas`** ("Filter by area" on Create Loading Slip): now returns only areas that have at least one order that can go on a slip. It also accepts the same optional filters as `/seller/loading_slips/orders` (`is_rescheduled`, `product_ids[]`, `city_id`) so the options match the list. Web panel only.
