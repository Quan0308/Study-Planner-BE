export default function get6DaysFromDate(date: Date) {
  const dateCopy = new Date(date);
  dateCopy.setDate(date.getDate() + 6);
  return dateCopy;
}
