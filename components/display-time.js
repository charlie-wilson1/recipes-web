import PropTypes from "prop-types";
import { Duration } from "luxon";

/**
 * @param {number} minutes Number of minutes to display
 * @returns string
 */
export default function DisplayTime(minutes) {
  const duration = Duration.fromObject({ minutes });
  const correctedDuration = duration.shiftTo("hours", "minutes");
  let displayDuration = correctedDuration.toFormat("m 'minutes'");

  if (correctedDuration.hours > 0) {
    displayDuration = correctedDuration.toFormat("h 'hours' m 'minutes'");
  }

  return <span>{displayDuration}</span>;
}

DisplayTime.propTypes = {
  minutes: PropTypes.number,
};
