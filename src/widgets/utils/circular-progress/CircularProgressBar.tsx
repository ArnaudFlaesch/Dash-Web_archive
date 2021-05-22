import "./CircularProgressBar.scss"

function percentageToDegrees(percentage: number): string {
    return (percentage / 100 * 360).toString()
}

interface IProps {
    value: number;
}

const CircularProgressBar: React.FunctionComponent<IProps> = (props) => {

    return (
        <div className="progress mx-auto">
            <span className="progress-left">
                <span style={{ transform: (props.value > 50) ? `rotate(${percentageToDegrees((props.value) - 50)}deg)` : 'unset' }} className="progress-bar border-primary"></span>
            </span>
            <span className="progress-right">
                <span style={{ transform: (props.value > 50) ? `rotate(180deg)` : `rotate(${percentageToDegrees(props.value)}deg)` }} className="progress-bar border-primary"></span>
            </span>
            <div className="progress-value w-100 h-100 rounded-circle d-flex align-items-center justify-content-center">
                <div className="h2 font-weight-bold">{Math.round(props.value)}%</div>
            </div>
        </div>
    )
}

export default CircularProgressBar;