export default interface IFBUser {
  id: string;
  first_name: string;
  last_name: string;
  hometown: {
    id: string;
    name: string;
  },
  birthday: string;
  gender: string;
  link: string;
}