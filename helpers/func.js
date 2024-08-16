const dateDiffInSeconds = (date1, date2) =>
  Math.abs(date1.getTime() - date2.getTime()) / 1000;

const dateDiffInHours = (date1, date2) =>
  Math.abs(date1.getTime() - date2.getTime()) / (1000 * 60 * 60);

module.exports = {
  dateDiffInSeconds,
  dateDiffInHours,
};
