"use client"

export interface BookingEventDetail {
  service?: string
  doctor?: string
}

export function openBookingModal(options?: BookingEventDetail) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("open-carenova-booking", {
        detail: options || {},
      })
    )
  }
}
