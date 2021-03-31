export default interface IEvent {
  id: number;
  name: string;
  cover: {
    offset_x: number;
    offset_y: number;
    source: string;
    id: number;
  };
  description: string;
  end_time: Date;
  discount_code_enabled: boolean;
  interested_count: number;
  declined_count: number;
  maybe_count: number;
  noreply_count: number;
  place: {
    name: string;
    location: {
      city: string;
      country: string;
      latitude: number;
      longitude: number;
      street: string;
      zip: number;
    };
    id: number;
  };
  updated_time: Date;
  start_time: Date;
  ticket_uri: string;
  type: string;
  attending_count: number;
  rsvp_status: string;
  event_times: [
    {
      id: number;
      start_time: Date;
      end_time: Date;
      ticket_uri: string;
    }
  ];
}
