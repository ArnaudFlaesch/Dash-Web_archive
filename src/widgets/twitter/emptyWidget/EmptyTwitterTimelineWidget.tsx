import { Button, Input } from '@mui/material';
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
    <div className="flex flex-col mx-auto max-w-xs mt-10 space-y-8">
      <Input
        id="twitterProfileName"
        onChange={onChangeHandler}
        value={profile}
        placeholder="Saisissez le nom de l'utilisateur"
      />
      <Button
        className="validateProfileButton"
        variant="contained"
        color="success"
        onClick={onValidation}
        disabled={!profile || profile?.length < 1}
      >
        Valider
      </Button>
    </div>
  );
}
