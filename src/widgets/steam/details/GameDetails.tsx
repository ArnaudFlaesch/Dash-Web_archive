import axios from 'axios';
import React, { useEffect, useState } from 'react';
import authorizationBearer from 'src/services/auth.header';
import CircularProgressBar from 'src/widgets/utils/circular-progress/CircularProgressBar';
import { IGameInfo } from '../IGameInfo';

interface IAchievement {
  apiname: string;
  achieved: number;
  unlocktime: number;
}

export default function GameDetails(props: IGameInfo): React.ReactElement {
  const [achievements, setAchievements] = useState([]);
  const [completedAchievements, setCompletedAchievements] = useState([]);
  const STEAM_API_URL = 'https://api.steampowered.com';
  const STEAM_IMAGE_URL = 'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/';
  const STEAM_COMMUNITY_URL = 'https://steamcommunity.com/app/';
  const GET_ACHIVEMENTS_URL = `${STEAM_API_URL}/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${props.appid}&key=${process.env.REACT_APP_STEAM_API_KEY}&steamid=${process.env.REACT_APP_STEAM_USER_ID}`;

  useEffect(() => {
    axios
      .get<any>(`${process.env.REACT_APP_BACKEND_URL}/proxy/`, {
        headers: {
          Authorization: authorizationBearer(),
          'Content-type': 'application/json'
        },
        params: {
          url: GET_ACHIVEMENTS_URL
        }
      })
      .then((response) => {
        if (response.data.playerstats.achievements) {
          setAchievements(response.data.playerstats.achievements);
          setCompletedAchievements(
            response.data.playerstats.achievements.filter((achievement: IAchievement) => achievement.achieved === 1)
          );
        }
      });
  }, [props]);

  return (
    <div>
      <div className="flex flex-row">
        <div>{props.name}</div>
        <a href={`${STEAM_COMMUNITY_URL}${props.appid}`}>
          <img src={`${STEAM_IMAGE_URL}${props.appid}/${props.img_logo_url}.jpg                  `} />
        </a>
      </div>
      {achievements && completedAchievements && achievements.length > 0 && (
        <div className="flex flex-row">
          <div className="flex flex-column">
            <div className="totalachievements">Succès : {achievements.length}</div>
            <div className="completedAchievements">Succès complétés : {completedAchievements.length}</div>
          </div>
          <CircularProgressBar value={(completedAchievements.length / achievements.length) * 100} />
        </div>
      )}
    </div>
  );
}
