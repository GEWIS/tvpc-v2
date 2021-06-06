export interface DepartureMessage {
  message: string,
  style: string,
}

export interface Train {
  direction: string,
  plannedDateTime: Date,
  delay: number,
  trainType: string,
  operator: string,
  cancelled: false,
  routeStations: string[],
  messages: DepartureMessage[],
}
