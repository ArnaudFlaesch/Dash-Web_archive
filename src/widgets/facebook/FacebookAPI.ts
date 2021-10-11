import logger from '../../utils/LogUtils';
import IFBUser from './IFBUser';

interface IFB {
  api: (url: string, data: unknown, response: (data: unknown) => unknown) => Promise<unknown>;
}

declare const FB: IFB;

export function getProfileInfo(): Promise<IFBUser> {
  return new Promise((resolve, reject) => {
    logger.debug('getProfile');
    FB.api(
      '/me',
      {
        fields: 'id,first_name,last_name,hometown,location,birthday,gender,link'
      },
      (userData: unknown) => {
        if (userData) {
          resolve(userData as IFBUser);
        } else {
          reject(Error('Promise rejected'));
        }
      }
    );
  });
}

export function getGroupsData(): Promise<unknown> {
  return new Promise((resolve, reject) => {
    logger.debug('getGroupsData');
    FB.api(
      '/me/groups',
      {
        fields:
          'administrator,bookmark_order,id,unread,cover,created_time,description,icon,email,link,name,purpose,venue,picture'
      },
      (groupsData) => {
        if (groupsData) {
          resolve(groupsData);
        } else {
          reject(Error('Promise rejected'));
        }
      }
    );
  });
}
