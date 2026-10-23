// Which driver statuses the DISTRIBUTOR panel offers (driver edit form status buttons + Drivers list chips).
//
//   true  = just Active / Deactive. Active can use the app; Deactive cannot log in and is logged out of the app
//           (the server already does that for every status other than Active).
//   false = the full set again: Not-Approved and Blocked come back in the form and as chips.
//
// Display only: the server accepts every status either way, and a driver already in another state (Registered,
// Not-Approved, Blocked, Removed) is still shown with that state, so nobody disappears from the panel.
// To bring the other statuses back, change this one word to false and rebuild (npm run dev).
export const SIMPLE_DRIVER_STATUS = true;
