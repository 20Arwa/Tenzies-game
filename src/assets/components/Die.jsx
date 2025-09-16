export default function Die(props) {
    return (
        <div className="col text-center">
            <button 
            className="die-btn rounded fs-3" 
            style={{backgroundColor: props.isHeld ?  "#59E391" : "white"}} 
            onClick={() => props.holdFun(props.id)}
            >{props.value}</button>
        </div>
    )
}