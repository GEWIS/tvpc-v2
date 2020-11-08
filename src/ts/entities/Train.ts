export interface Train {
  direction: string,
  plannedDateTime: Date,
  delay: number
  trainType: string,
  operator: string,
  cancelled: false,
  routeStations: string[],
  messages: [{
    message: string,
    style: string,
  }],
}
