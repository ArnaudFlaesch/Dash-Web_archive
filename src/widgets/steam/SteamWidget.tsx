import axios from 'axios';
import { useEffect, useState } from 'react';
import ComponentWithDetail from 'src/components/detailComponent/ComponentWithDetail';
import IBaseWidgetConfig from 'src/model/IBaseWidgetConfig';
import authorizationBearer from 'src/services/auth.header';
import logger from '../../utils/LogUtils';
import Widget from '../Widget';
import GameDetails from './details/GameDetails';
import { IGameInfo } from './IGameInfo';
import { IPlayerData } from './IPlayerData';

interface IPlayerDataResponse {
  response: {
    players: IPlayerData[];
  };
}

interface IOwnedGamesResponse {
  response: {
    games: IGameInfo[];
  };
}

export default function SteamWidget(props: IBaseWidgetConfig): React.ReactElement {
  const [playerData, setPlayerData] = useState<IPlayerData>();
  const [ownedGames, setOwnedGames] = useState<IGameInfo[]>();

  const STEAM_API_URL = 'https://api.steampowered.com';
  const GET_PLAYER_SUMMARIES_URL = `/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.REACT_APP_STEAM_API_KEY}&steamids=${process.env.REACT_APP_STEAM_USER_ID}`;
  const GET_OWNED_GAMES_URL = `/IPlayerService/GetOwnedGames/v0001/?key=${process.env.REACT_APP_STEAM_API_KEY}&steamid=${process.env.REACT_APP_STEAM_USER_ID}&format=json&include_appinfo=true`;
  const STEAM_IMAGE_URL = 'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/';
  const STEAM_COMMUNITY_URL = 'https://steamcommunity.com/app/';

  useEffect(() => {
    refreshWidget();
  }, []);

  function refreshWidget() {
    getPlayerData();
    getOwnedGames();
  }

  function getPlayerData(): void {
    axios
      .get<IPlayerDataResponse>(`${process.env.REACT_APP_BACKEND_URL}/proxy/`, {
        headers: {
          Authorization: authorizationBearer(),
          'Content-type': 'application/json'
        },
        params: {
          url: `${STEAM_API_URL}${GET_PLAYER_SUMMARIES_URL}`
        }
      })
      .then((response) => {
        setPlayerData(response.data.response.players[0]);
      })
      .catch((error: Error) => {
        logger.error(error.message);
      });
  }

  function getOwnedGames(): void {
    axios
      .get<IOwnedGamesResponse>(`${process.env.REACT_APP_BACKEND_URL}/proxy/`, {
        headers: {
          Authorization: authorizationBearer(),
          'Content-type': 'application/json'
        },
        params: {
          url: `${STEAM_API_URL}${GET_OWNED_GAMES_URL}`
        }
      })
      .then((response) => {
        setOwnedGames(
          (response.data.response.games as IGameInfo[]).sort((gameA, gameB) => gameA.name.localeCompare(gameB.name))
        );
      })
      .catch((error) => {
        logger.error(error.message);
      });
  }

  const widgetHeader = (
    <div>
      <a href={playerData?.profileurl} className="flex flex-row">
        <img src={playerData?.avatar} />
        <p>{playerData?.personaname}</p>
      </a>
    </div>
  );

  const widgetBody = (
    <div className="flex flex-column">
      {ownedGames &&
        ownedGames.map((game: IGameInfo) => {
          return (
            <ComponentWithDetail
              key={game.appid}
              componentRoot={
                <div className="gameInfo flex flex-row">
                  <div>
                    <img src={`${STEAM_IMAGE_URL}${game.appid}/${game.img_icon_url}.jpg                  `} />
                  </div>
                  <div>{game.name}</div>
                </div>
              }
              componentDetail={<GameDetails {...game} />}
              link={`${STEAM_COMMUNITY_URL}${game.appid}`}
            />
          );
        })}
    </div>
  );

  return (
    <Widget
      id={props.id}
      tabId={props.tabId}
      config={{}}
      header={widgetHeader}
      body={widgetBody}
      refreshFunction={refreshWidget}
      onDeleteButtonClicked={props.onDeleteButtonClicked}
    />
  );
}
