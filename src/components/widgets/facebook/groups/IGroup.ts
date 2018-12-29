
export default interface IGroup {
    id: number;
    created_time: Date;
    email: string;
    name: string;
    cover: {
        cover_id: number;
        offset_x: string;
        offset_y: string;
        source: string;
        id: number
    };
    description: string;
    icon: string;
    purpose: string;
    picture: {
      data: {
        height: number;
        is_silhouette: boolean,
        url: string;
        width: number;
      }
    },
    administrator: boolean;
    bookmark_order: number;
    unread: number;
}
