import './CircularProgressBar.scss';

function percentagetodegrees(percentage: number): string {
  return ((percentage / 100) * 360).toString();
}

interface IProps {
  value: number;
}

export default function CircularProgressBar(props: IProps): React.ReactElement {
  return (
    <div className="progress mx-auto">
      <span className="progressLeft">
        <span
          style={{ transform: props.value > 50 ? `rotate(${percentagetodegrees(props.value - 50)}deg) ` : 'unset' }}
          className="progressBar border-primary"
        ></span>
      </span>
      <span className="progressRight">
        <span
          style={{
            transform: props.value > 50 ? `rotate(180deg) ` : `rotate(${percentagetodegrees(props.value)}deg) `
          }}
          className="progressBar border-primary"
        ></span>
      </span>
      <div className="progressValue w-100 h-100 rounded-circle d-flex align-items-center justify-content-center">
        <div className="h2 font-weight-bold">{Math.round(props.value)}%</div>
      </div>
    </div>
  );
}
