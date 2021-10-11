import { useState } from 'react';

interface IProps {
  profile?: string;
  onProfileSubmitted: (profile: string) => void;
}

export default function EmptyTwitterTimelineWidget(props: IProps): React.ReactElement {
  const [profile, setProfile] = useState(props.profile);
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => setProfile(event.target.value);
  const onValidation = () => {
    if (profile) {
      props.onProfileSubmitted(profile);
    }
  };

  return (
    <div>
      <input
        id="twitterProfileName"
        onChange={onChangeHandler}
        value={profile}
        placeholder="Saisissez le nom de l'utilisateur"
      />
      <button onClick={onValidation} disabled={!profile || profile?.length < 1} className="btn btn-success">
        Valider
      </button>
    </div>
  );
}
