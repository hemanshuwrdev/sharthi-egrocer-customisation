# API Changes — Retailer Notifications (orders, payments, delivery OTP)

## What changed
The retailer's Notifications screen (`GET /customer/notifications`) now also lists **order, payment and delivery-OTP events** — order placed / confirmed, out for delivery, delivered, payment received, delivery OTP, etc. Before, these were push-only and disappeared once dismissed. Each one now has a card with everything the design shows (distributor, invoice no., driver, OTP, amount), a category for the tabs, and read / unread state.

Existing keys on the list are unchanged; everything below is **additive**. Push notifications are unchanged.

## 1. List — `GET /customer/notifications`

Public route as before (guests still get broadcasts). Send the customer token to get their own cards + read state.

| Query param | Notes |
|---|---|
| `limit`, `offset` | as before (default 10 / 0) |
| `category` | **new** — `orders` \| `payments` \| `otp`. Omit for the **All** tab. Anything else is ignored (= All). |
| `unread` | **new** — `1` returns only unread |
| `search` | as before |
| `sort`, `order` | `sort` = `id` (default) \| `date_sent` \| `title`; `order` = `desc` (default) \| `asc` |

Response — existing fields, plus the new ones marked ★:

```json
{
  "status": 1,
  "message": "Success",
  "total": 12,
  "unread_count": 3,
  "data": [
    {
      "id": 481,
      "title": "Out for delivery",
      "message": "Order #8841 is on its way.",
      "type": "user",
      "type_id": 10,
      "image_url": "",
      "link_url": "",
      "date_sent": "21-10-2026 10:15 AM",
      "category": "orders",
      "event": "out_for_delivery",
      "order_id": 8841,
      "is_read": false,
      "date_sent_iso": "2026-10-21T10:15:02+05:30",
      "data": {
        "order_number": "8841",
        "invoice_number": "IN/0987",
        "distributor": { "id": 3, "name": "HL Proteins Pvt Ltd" },
        "driver": { "id": 5, "name": "Ramesh Yadav", "mobile": "+919876543210" },
        "otp": null,
        "amount": null,
        "payment_method": null,
        "expected_delivery_date": "2026-10-21",
        "placed_by": null
      }
    }
  ]
}
```

★ `unread_count` (top level) — all unread for this customer, **ignoring** `category` / `unread` / `search`. Use it for the bell badge. `0` for a guest.
★ `category` — `orders` \| `payments` \| `otp`, or `general` for notifications sent from the admin panel.
★ `event` — what happened (table below); `null` for panel-sent.
★ `order_id` — the order's numeric id (what the order APIs take); `null` for panel-sent.
★ `is_read` — boolean.
★ `date_sent_iso` — ISO-8601 with offset. Use this for the **Today / Yesterday** grouping (`date_sent` is a display string).
★ `data` — the card's facts. **Every key is always present** (null when it doesn't apply to that event); the whole object is `null` for panel-sent notifications.

### `data` keys

| Key | Meaning |
|---|---|
| `order_number` | the order's **id**, as a string — the same number every app shows as "Order #…" (equal to `order_id`; kept as a string) |
| `invoice_number` | distributor's invoice no.; **null until the slip is dispatched** → hide the chip when null |
| `distributor` | `{ id, name }` — the chip (name = the distributor's store name) |
| `driver` | `{ id, name, mobile }` or `null`; `mobile` includes the country code → the call button |
| `otp` | only on the `delivery_otp` card, `null` on every other card |
| `amount` | number, `payment_received` only |
| `payment_method` | `cash` \| `bank` \| `cheque`, `payment_received` only (`bank` = UPI/bank, same word as the other app APIs) |
| `expected_delivery_date` | `YYYY-MM-DD` or `null`. Date only — there is no delivery time slot to show |
| `placed_by` | salesman's name when a salesman placed the order for the retailer, else `null` |

### Events

| `event` | `category` | Fires when | Title |
|---|---|---|---|
| `order_placed` | orders | the order is placed (by the retailer, or by a salesman for them) | Order placed |
| `order_confirmed` | orders | the distributor moves it to *Processed* | Order confirmed |
| `out_for_delivery` | orders | the loading slip is dispatched (or the status is set manually) | Out for delivery |
| `delivery_otp` | otp | together with `out_for_delivery`, **only if that distributor uses delivery OTPs** | Delivery OTP |
| `order_delivered` | orders | delivered | Order delivered |
| `order_partially_delivered` | orders | delivered with shortfall | Order partially delivered |
| `order_not_delivered` | orders | driver marks not delivered | Order not delivered |
| `order_rescheduled` | orders | rescheduled | Order rescheduled |
| `order_cancelled` | orders | cancelled by the distributor / driver | Order cancelled |
| `order_returned` | orders | returned | Order returned |
| `payment_received` | payments | a driver or salesman records a cash / UPI-bank / cheque payment | Payment received |

`title` and `message` are already written, in the retailer's own language (English text where a translation isn't added yet) — the app can show them as-is. Tap targets: **View order / Track order** → `order_id`; distributor chip → `data.distributor.id`.

Not notified: *signature* (IOU) payments — that isn't money received; the retailer's own cancel / reschedule; a single item being cancelled.

## 2. New — mark as read: `POST /customer/notifications/mark_read`

Auth: customer token (`Authenticate:api-customers`). Send **one** of:

```
{ "ids": [481, 480] }                 // just these
{ "all": 1 }                          // everything unread — "Mark all read"
{ "all": 1, "category": "orders" }    // everything unread in one tab
```

```json
{ "status": 1, "message": "Success", "data": { "marked": 2, "unread_count": 1 } }
```

- Safe to call again — already-read ones are skipped (`marked` counts only the newly read).
- `ids` that aren't this customer's are ignored.
- Neither `ids` nor `all` → `{ "status": 0, "message": "Send ids[] or all=1." }`.
- Read state is per customer, so a broadcast read by one customer stays unread for the others.

## Design → fields

| On the card | Use |
|---|---|
| Tabs All / Orders / Payments / OTP | `category` param (omit for All) |
| "Mark all read" | `mark_read` `{ "all": 1 }` |
| Blue unread dot | `is_read === false` |
| TODAY / YESTERDAY headers | group by `date_sent_iso` |
| Distributor chip | `data.distributor.name` |
| Invoice No. chip | `data.invoice_number` (hide if null) |
| Driver row + call | `data.driver.name` / `.mobile` |
| OTP box + Copy OTP | `data.otp` (on the `delivery_otp` card) |
| View order / Track order | `order_id` (Track order on `out_for_delivery`) |

## Not covered
- The **⋮** menu on a card: only mark-read exists. There is no delete / "mark as unread" yet.
- The OTP card keeps showing the OTP after the order is delivered — the app may want to hide `data.otp` once a later `order_delivered` card exists for the same `order_id`.
- When a slip is **dispatched** the retailer already gets the existing push "order #… is assigned to <driver name>" (unchanged, and not switched off by the retailer's push settings). The Out for delivery / Delivery OTP cards appear in the list at the same moment, but there is no second push for them.
- The "Expected delivery today by 4:00 PM" line in the design can't be built — only `expected_delivery_date` exists.

## Other apps — salesman, driver, distributor: same structure

The salesman, driver and distributor apps now return **exactly the structure above** (same card keys, `unread_count`, filters, `mark_read`) — built from the notifications each app already records. **Same URL pattern in every app, no extra parameter.**

| App | List | Mark read |
|---|---|---|
| Retailer | `GET /customer/notifications` | `POST /customer/notifications/mark_read` |
| Salesman | `GET /api/salesman/notifications` | `POST /api/salesman/notifications/mark_read` |
| Driver | `GET /api/delivery_boy/notifications` | `POST /api/delivery_boy/notifications/mark_read` |
| Distributor | `GET /api/seller/notifications` | `POST /api/seller/notifications/mark_read` |

Same auth and headers as those apps already use. Params, `unread_count`, card keys and `mark_read` body/response are identical to the retailer's section above: `limit` (max 100, default 10), `offset`, `category`, `unread`, `search`, and `{ "ids": [...] }` / `{ "all": 1 }` / `{ "all": 1, "category": "..." }` → `{ "marked", "unread_count" }`.

**This replaces the old response structure** of those two lists — older app builds that read it must be updated:

- salesman used to return `data: { unread_count, notifications: [...] }` (latest 50); it is now `data: [cards]` with a top-level `total` and `unread_count`.
- the driver and distributor used `GET /api/get_top_notifications`, which returned `data: { unread, notifications: [...] }`. Use the new URLs in the table instead. (`get_top_notifications` still exists for the web panel. Called without the panel's `X-Requested-With` header it also returns the new structure, but don't build on it.)
- `POST /api/notification_mark_read`, the first URL given for the driver and distributor, still works but is replaced by the `…/notifications/mark_read` URLs above.

Differences between the apps:

- **`id`** is a **string (UUID) for driver and distributor** — send it back as-is in `mark_read`. For the salesman it is an integer, like the retailer's.
- **`type` / `type_id`** identify the account: `delivery_boy` / `seller` / `salesman`, and its id.
- **`category`** — `orders`, plus **`returns`** (return requests — distributor) and `general` (anything else). **`payments` and `otp` are accepted as filters but return nothing** — these apps don't record such notifications today.
- **`data`** is the same facts block (order number, invoice number, distributor, driver, expected delivery date) **only when the notification is about an order**, otherwise `null`. `otp`, `amount` and `payment_method` are always `null` here. `order_id` is always the real order id.
- **`title`** follows `Content-Language`; **`message`** is the text as it was stored (English).

Events — what each app already records, nothing new:

| App | `event` | `category` | When |
|---|---|---|---|
| Driver, Distributor | `new_order` | orders | a new order |
| Driver, Distributor | `order_status_update` | orders | an order's status changed |
| Driver, Distributor | `item_status_update` | orders | one item's status changed |
| Distributor | `return_request_new`, `return_request_sent`, `return_request_status` | returns | return requests |
| Salesman | `address_change_request` | general | a retailer asked to change address |
| Salesman | (any notification that has an order) | orders | — |

So the **driver** list only has what the panel already records for a driver's own orders, and the **salesman** list today only has address-change requests — they will fill up when those apps get more events. Say which events you want next.

## Nothing else changes
No other endpoints, no other response shapes.
