import { Card, CardContent, Collapse } from '@mui/material';
import { useEffect, useState } from 'react';
import './ComponentWithDetail.scss';

interface IProps {
  componentRoot: React.ReactNode | string;
  componentDetail: React.ReactNode | string;
  link?: string;
  isClosed?: boolean;
  onOpenDetail?: () => void;
}

export default function ComponentWithDetail(props: IProps): React.ReactElement {
  const [openCollapse, setOpenCollapse] = useState(false);

  useEffect(() => {
    if (props.isClosed) {
      setOpenCollapse(false);
    }
  }, [props.isClosed]);

  const toggleCollapse = () => {
    if (!openCollapse && props.onOpenDetail) {
      props.onOpenDetail();
    }
    setOpenCollapse(!openCollapse);
  };

  return (
    <div>
      <div onClick={toggleCollapse} className="title">
        {props.componentRoot}
      </div>
      <div>
        <Collapse in={openCollapse}>
          <Card>
            <CardContent>{openCollapse && props.componentDetail && props.componentDetail}</CardContent>
          </Card>
        </Collapse>
      </div>
    </div>
  );
}
