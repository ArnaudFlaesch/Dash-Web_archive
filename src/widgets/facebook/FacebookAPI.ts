import logger from "../../utils/LogUtils";
import IGroup from './groups/IGroup';
declare const FB: any;

export function getProfileInfo(): any {
    return (new Promise((resolve, reject) => {
        logger.debug("getProfile");
        FB.api('/me',
            {
                "fields": "id,first_name,last_name,hometown,location,birthday,gender,link"
            },
            (userData: any) => {
                if (userData) {
                    resolve(userData);
                } else {
                    reject(Error("Promise rejected"));
                }
            }
        );
    }));
}

export function getGroupsData(): any {
    return (new Promise((resolve, reject) => {
        logger.debug("getGroupsData");
        FB.api('/me/groups',
            {
                "fields": "administrator,bookmark_order,id,unread,cover,created_time,description,icon,email,link,name,purpose,venue,picture"
            },
            (groupsData: IGroup[]) => {
                if (groupsData) {
                    resolve(groupsData);
                } else {
                    reject(Error("Promise rejected"));
                }
            }
        );
    }));
}