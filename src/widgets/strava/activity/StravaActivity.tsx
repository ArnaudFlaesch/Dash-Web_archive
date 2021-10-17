import { format } from 'date-fns';
import { ReactElement } from 'react';
import { IActivity } from '../IStrava';

function convertDecimalTimeToTime(decimalTime: number): number {
  const decimalPart = decimalTime % 1;
  const convertedDecimalPart = (decimalPart / 10) * 6;
  return decimalTime - decimalPart + convertedDecimalPart;
}

export default function StravaActivity(props: IActivity): ReactElement {
  return (
    <div>
      <div>
        <a href={`https://www.strava.com/activities/${props.id}`}>
          {format(new Date(props.start_date_local), 'dd MMM')} {props.name}
        </a>
      </div>
      <div>Distance : {Math.round(props.distance) / 1000} kms</div>
      <div>Durée : {convertDecimalTimeToTime(props.moving_time / 60)} mins</div>
      <div>Denivelé : {props.total_elevation_gain} mètres</div>
      <div>Trophées : {props.achievement_count}</div>
      <div>Vitesse moyenne : {props.average_speed}</div>
      <div>Vitesse max : {props.max_speed}</div>
      <div>Kudos : {props.kudos_count}</div>
      <div>Commentaires : {props.comment_count}</div>
    </div>
  );
}
