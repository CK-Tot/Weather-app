'use strict';


export const weekDayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
]


export const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
];




export const getDate =  (dateUnix, timezone) => {
    const date = new Date((dateUnix + timezone) * 1000);

    const weekDayName = weekDayNames[date.getUTCDay()];
    const monthName = monthNames[date.getUTCMonth()];

    return `${weekDayName},  ${monthName} ${date.getUTCDate()}`
}

export const getTime = (timeUnix, timezone) => {
  const date = new Date((timeUnix + timezone) * 1000);

  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');

  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Convert 0 to 12, 13 to 1, etc.

  return `${hours}:${minutes} ${period}`;
};




export const getHours = (timeUnix, timezone) =>
{
    const date = new Date((timeUnix + timezone) * 1000);
    const hours = date.getUTCHours();
    const period = hours > 12 ? 'PM' : 'AM';

    return `${hours % 12 || 12} ${period}`
}

export const mps_to_kmh = mps => {
    const mph = mps * 3600;
    return mph / 1000
}


export const aqiText = {
    1: {
    level: 'Good',
    message: 'Air quality is considered satisfactory, and air pollution poses little or no risk to the general population.'
  },
  2: {
    level: 'Fair',
    message: 'Air quality is generally acceptable; however, there may be a risk for people who are unusually sensitive to air pollution.'
  },
  3: {
    level: 'Moderate',
    message: 'Members of sensitive groups may experience minor to moderate health effects. The general public is not likely to be affected.'
  },
  4: {
    level: 'Poor',
    message: 'Sensitive groups may experience more serious health effects. The general public may experience mild irritation or discomfort.'
  },
  5: {
    level: 'Very Poor',
    message: 'Health alert: everyone may begin to experience health effects. Sensitive individuals should avoid outdoor activity.'
  }

};

