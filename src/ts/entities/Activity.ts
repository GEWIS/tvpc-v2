export default interface Activity {
  id: number,
  name: string,
  nameEn: string,
  beginTime: {
    date: Date,
  },
  endTime: {
    date: Date,
  },
  subscriptionDeadline: {
    date: Date,
  }
  location: string,
  locationEn: string,
  costs: string,
  costsEn: string,
  canSignUp: boolean,
  isFood: boolean,
  isMyFuture: boolean,
}
